#!/usr/bin/env python3
"""Đọc bảng hàng các sàn trên Google Drive → feed/<duan>.json (mã hóa AES-GCM bằng APP_KEY).
Cấu hình nguồn lấy từ biến môi trường SOURCES (JSON) hoặc file sources.json. Chạy: python feed.py [--plain]"""
import os,sys,re,io,csv,json,base64,unicodedata,urllib.request,urllib.parse,datetime,hashlib
import openpyxl
UA={'User-Agent':'Mozilla/5.0 feed-bot'}
LOG=[]
RELAY=os.environ.get('RELAY_URL',''); RTOK=os.environ.get('RELAY_TOKEN','')
def get(url,tries=3):
    if RELAY and ('docs.google.com' in url or 'drive.google.com' in url):
        st,b=_get(RELAY+('&' if '?' in RELAY else '?')+'t='+urllib.parse.quote(RTOK)+'&u='+urllib.parse.quote(url,safe=''),tries)
        if st==200:
            try:
                j=json.loads(b.decode('utf8'))
                if j.get('ok'): return int(j.get('code',200)),base64.b64decode(j['b64'])
                LOG.append(f"relay {j.get('code')} {url[:80]} {str(j.get('msg'))[:120]}")
                if j.get('code') in (401,403,404): return int(j['code']),b''
            except Exception as e: LOG.append(f'relay lỗi {e}')
        else: LOG.append(f'relay {st} {url[:80]}')
    return _get(url,tries)
def _get(url,tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60) as r: return r.status,r.read()
        except urllib.error.HTTPError as e:
            try: body=e.read()[:300]
            except Exception: body=b''
            LOG.append(f'{e.code} {url[:90]} {body[:160]!r}')
            if e.code in (429,500,502,503) and i<tries-1:
                import time; time.sleep(8*(i+1)); continue
            return e.code,b''
        except Exception as e:
            if i==tries-1: return 0,str(e).encode()
def norm(v): return re.sub(r'\s+',' ',str(v if v is not None else '')).strip()
def fold(s):
    s=unicodedata.normalize('NFD',norm(s).lower()); s=''.join(ch for ch in s if unicodedata.category(ch)!='Mn')
    return s.replace('đ','d')
def fillof(c):
    f=c.fill
    if not f or f.fill_type is None or f.fgColor is None: return None
    col=f.fgColor
    if col.type=='rgb' and col.rgb not in ('00000000','FFFFFFFF'): return col.rgb[-6:].upper()
    return None
DEFAULT_COLORS={'FF0000':'sold','FFFF00':'lock','00FF00':'check','999999':'check','B3E5A1':'lock'}
CODE_RX=re.compile(r'^([A-Z]{1,3}[0-9]{0,2}[A-Z]?[-.][0-9A-Z][0-9A-Z.\-]*|F2\d{4}|[A-ZĐ]{1,3}\d{1,3}-\d{1,3})$')
def num(s,ty=False):
    s=norm(s).replace(' ','')
    if not s or s=='-': return None
    if ty:
        s=s.replace(',','.') if s.count(',')==1 and s.count('.')==0 else s.replace(',','')
        try: return float(s)*1e9
        except: return None
    if re.match(r'^\d{1,3}(\.\d{3})+$',s) or re.match(r'^\d{1,3}(,\d{3})+$',s): return float(re.sub(r'[.,]','',s))
    s2=s.replace(',','.') if s.count(',')==1 and '.' not in s else s.replace(',','')
    try: return float(s2)
    except: return None
def area(s):
    s=norm(s)
    if re.match(r'^\d+,\d+$',s): s=s.replace(',','.')
    try: return round(float(s),2)
    except: return None
def stext(t):
    f=fold(t)
    if not f: return ''
    if re.search(r'da ban|sold|da coc|dat coc|da ky|ky hd|^coc\b',f): return 'sold'
    if re.search(r'\block|dang giu|^giu',f): return 'lock'
    if re.search(r'check|^thu\b|thu hoi',f): return 'check'
    return ''
HDR=[('code',r'^ma can( ho)?$|^can ho ten thuong mai|^ma can\b'),('typ',r'^loai( can| hinh| can ho| sp)?\b'),('tt',r'thong th|^dttt'),('tim',r'tim tuong'),
     ('land',r'dien tich ?dat|^dt dat'),('floor',r'san ?xd|dtxd|tong dien ?tich san'),('st',r'tinh trang'),('note',r'^ghi chu'),('coc',r'^dat coc$|^ngay coc'),('dl',r'^dai ly'),
     ('pre',r'truoc vat|chua (gom )?vat'),('vat',r'^vat$'),('kp',r'^kpbt$'),('dg',r'^don gia')]
def sheets_of(fid):
    st,b=get(f'https://docs.google.com/spreadsheets/d/{fid}/htmlview')
    if st!=200: return []
    t=b.decode('utf8','replace')
    return [(json.loads('"'+n+'"'),g) for n,g in re.findall(r'\{name: "((?:[^"\\]|\\.)*)", pageUrl: "[^"]*?gid=(\d+)',t)]
def parse_sheet(rows,ws,src):
    hi=None
    for i,r in enumerate(rows[:80]):
        if any(re.search(HDR[0][1],fold(c)) for c in r): hi=i; break
    if hi is None: return [],'không thấy dòng tiêu đề (cột Mã căn)'
    H=[fold(c) for c in rows[hi]]
    col={}
    for j,h in enumerate(H):
        if not h: continue
        for k,rx in HDR:
            if k not in col and re.search(rx,h): col[k]=j; break
    prx=src.get('price')
    if prx:
        for j,h in enumerate(H):
            if h and re.search(prx,h): col['g']=j; break
    leg={}
    colors=dict(DEFAULT_COLORS)
    fills={}
    if ws is not None:
        for r in ws.iter_rows():
            for c in r:
                v=norm(c.value); f=fillof(c)
                if not v: continue
                if c.row<=hi+1 and f and len(v)<26 and re.search(r'lock|ban|check|coc|giu',fold(v)): leg[f]=stext(v) if stext(v) else ('lock' if 'lock' in fold(v) else '')
                vv=v.upper().replace(' ','')
                if CODE_RX.match(vv) and vv not in fills: fills[vv]=f
        colors.update({k:v for k,v in leg.items() if v is not None})
        if leg: colors={k:v for k,v in colors.items() if k in leg or k not in DEFAULT_COLORS or DEFAULT_COLORS[k]=='sold'}
    out=[]
    for i in range(hi+1,len(rows)):
        r=rows[i]; cell=lambda k:(r[col[k]] if k in col and col[k]<len(r) else '')
        code=norm(cell('code')).upper().replace(' ','')
        if not CODE_RX.match(code): continue
        s=None
        for k in ('st','note'):
            if k in col and stext(cell(k)): s=stext(cell(k)); break
        f=fills.get(code)
        if s is None and f and colors.get(f): s=colors[f]
        if s is None and 'coc' in col and norm(cell('coc')): s='sold'
        if s is None and 'dl' in col and norm(cell('dl')): s='lock'
        rec={'c':code,'s':s or ''}
        g=num(cell('g'),src.get('ty')) if 'g' in col else None
        if g and g>1e8: rec['g']=round(g)
        for k in ('pre','vat','kp','dg'):
            if k in col:
                v=num(cell(k))
                if v and v>1e5: rec[k]=round(v)
        for k in ('typ','dl'):
            if norm(cell(k)): rec[k]=norm(cell(k))[:40]
        for k in ('tt','tim','land','floor'):
            if k in col:
                v=area(cell(k))
                if v and 5<v<3000: rec[k]=v
        out.append(rec)
    return out,''
def run_source(src,cache):
    fid=src['file']; res={'k':src['k'],'label':src['label'],'dv':src.get('dv',''),'ok':False,'n':0,'msg':''}
    if fid not in cache:
        wb=None
        for u in (f'https://docs.google.com/spreadsheets/d/{fid}/export?format=xlsx',f'https://drive.google.com/uc?export=download&id={fid}'):
            st,b=get(u)
            if st==200 and b[:2]==b'PK':
                try: wb=openpyxl.load_workbook(io.BytesIO(b),data_only=False); break
                except Exception as e: LOG.append(f'xlsx lỗi {e}')
            else: LOG.append(f'{st} {u[:80]} {b[:120]!r}')
        cache[fid]=wb
        cache[fid+'_sh']=sheets_of(fid)
    wb=cache[fid]; shs=cache[fid+'_sh']
    if wb is None: res['msg']='không tải được file (kiểm tra quyền chia sẻ)'; return res,[]
    want=[]
    for g in src.get('gids',[]):
        n=[n for n,gg in shs if gg==str(g)]
        if n: want.append((n[0],str(g)))
    for rx in src.get('sheets',[]):
        for n,g in shs:
            if re.search(rx,n) and (n,g) not in want: want.append((n,g))
    if not want: res['msg']='không thấy trang tính cần đọc'; return res,[]
    recs=[]; msgs=[]
    for n,g in want:
        st,b=get(f'https://docs.google.com/spreadsheets/d/{fid}/export?format=csv&gid={g}')
        if st!=200: msgs.append(f'{n}: lỗi tải {st}'); continue
        rows=list(csv.reader(io.StringIO(b.decode('utf8','replace'))))
        ws=wb[n] if n in wb.sheetnames else None
        rr,m=parse_sheet(rows,ws,src)
        if m: msgs.append(f'{n}: {m}')
        recs+=rr
    seen={}
    for r in recs: seen.setdefault(r['c'],r)
    recs=list(seen.values())
    for r in recs: r['k']=src['k']
    res.update(ok=bool(recs),n=len(recs),msg='; '.join(msgs),sheets=[n for n,_ in want])
    return res,recs
def enc(obj,key):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    iv=os.urandom(12); ct=AESGCM(base64.b64decode(key)).encrypt(iv,json.dumps(obj,ensure_ascii=False,separators=(',',':')).encode(),None)
    return base64.b64encode(iv+ct).decode()
def main():
    plain='--plain' in sys.argv
    key=os.environ.get('APP_KEY','')
    here=os.path.dirname(os.path.abspath(__file__)); encp=os.path.join(here,'sources.enc')
    if key and os.path.exists(encp):
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM
        raw=base64.b64decode(open(encp).read().strip()); cfg=json.loads(AESGCM(base64.b64decode(key)).decrypt(raw[:12],raw[12:],None))
    elif os.environ.get('SOURCES'): cfg=json.loads(os.environ['SOURCES'])
    else: cfg=json.load(open(os.path.join(here,'sources.json'),encoding='utf8'))
    out_dir=os.environ.get('OUT','feed'); os.makedirs(out_dir,exist_ok=True)
    now=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7)))
    def old_feed(duan):
        try:
            o=json.load(open(os.path.join(out_dir,duan+'.json'),encoding='utf8'))
            if 'd' in o: return o['d']
            if key and 'e' in o:
                from cryptography.hazmat.primitives.ciphers.aead import AESGCM
                raw=base64.b64decode(o['e']); return json.loads(AESGCM(base64.b64decode(key)).decrypt(raw[:12],raw[12:],None))
        except Exception: return None
    olds={}
    cache={}; per={}
    for src in cfg:
        res,recs=run_source(src,cache)
        if not res['ok']:
            od=olds.setdefault(src['duan'],old_feed(src['duan']))
            if od:
                os_=next((x for x in od.get('src',[]) if x['k']==src['k'] and x.get('ok')),None)
                orec=[r for r in od.get('u',[]) if r.get('k')==src['k']]
                if os_ and orec:
                    print(f"{src['k']:12} lỗi lần này ({res['msg']}) – giữ dữ liệu lần trước {os_.get('at')}",file=sys.stderr)
                    res=dict(os_); res['stale']=1; res['msg']='Lần đọc gần nhất lỗi, đang dùng dữ liệu lúc '+str(os_.get('at')); recs=orec
                    per.setdefault(src['duan'],{'src':[],'u':[]})['src'].append(res); per[src['duan']]['u']+=recs; continue
        res['at']=now.strftime('%H:%M %d/%m/%Y')
        print(f"{src['k']:12} {res['n']:4} {res['msg']}",file=sys.stderr)
        d=per.setdefault(src['duan'],{'src':[],'u':[]})
        d['src'].append(res); d['u']+=recs
    status={}
    for duan,d in per.items():
        if not any(x.get('ok') for x in d['src']) and os.path.exists(os.path.join(out_dir,duan+'.json')):
            status[duan]='lỗi đọc – giữ file cũ'; continue
        body={'v':1,'at':now.strftime('%H:%M %d/%m/%Y'),'src':d['src'],'u':d['u']}
        h=hashlib.sha256(json.dumps({'src':[{k:v for k,v in s.items() if k!='at'} for s in d['src']],'u':d['u']},sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:16]
        body['h']=h
        p=os.path.join(out_dir,duan+'.json')
        try: old=json.load(open(p))
        except Exception: old={}
        if old.get('h')==h and not plain: status[duan]='không đổi'; continue
        data={'h':h,'at':body['at'],'d':body} if plain or not key else {'h':h,'at':body['at'],'e':enc(body,key)}
        json.dump(data,open(p,'w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
        status[duan]='cập nhật'
    print(json.dumps(status,ensure_ascii=False),file=sys.stderr)
    for l in LOG[:40]: print('LOG',l,file=sys.stderr)
if __name__=='__main__': main()

/* ===== Giao diện luôn nền sáng (không theo chế độ tối của máy); trang hỏi đáp trên máy tính: cuộn theo trang, khung trả lời rộng ===== */
(function(){
  var r=document.documentElement; r.setAttribute("data-theme","light"); r.style.colorScheme="light";
  try{var m=document.createElement("meta"); m.name="color-scheme"; m.content="light only"; (document.head||r).appendChild(m);}catch(e){}
  var css="@media (min-width:761px){html,body{height:auto!important}"
   +".app{display:block!important;height:auto!important;max-width:1480px!important}"
   +".app .main{grid-template-columns:230px minmax(0,1fr)!important;align-items:start;gap:22px!important}"
   +".app aside{position:sticky;top:12px;max-height:calc(100vh - 24px)!important;overflow:auto!important}"
   +".app .conv{display:block!important;min-height:75vh}"
   +".app .log{overflow:visible!important;min-height:70vh;padding:22px 26px!important;font-size:15.5px}"
   +".app .a .body{padding:16px 22px!important}"
   +".app form{position:sticky;bottom:0;z-index:5;background:var(--panel);border-radius:0 0 14px 14px;box-shadow:0 -8px 18px rgba(0,0,0,.06)}}";
  var st=document.createElement("style"); st.textContent=css; (document.head||r).appendChild(st);
})();

/* ===== Bản đặt trên GitHub Pages: thay google.script.run bằng gọi máy chủ Apps Script qua JSONP =====
   Trang chạy thẳng trên congthongtinbds.github.io (không qua khung Google) nên không có dải cảnh báo
   và không bị lỗi "không thể mở tệp" khi trình duyệt đăng nhập nhiều tài khoản Google. */
(function(){
var SV=window.__GH_SV, P1="AKfycbywAdmP2T72-qYtLfUoaBnQpxfNhr_r3zxNEzh-pcIkuDU9xPyjyP09KwkP_ILUR3ufkA";
function qs(q,cb){var u=SV+"?callback="+cb+"&t="+Date.now(); for(var k in q) u+="&"+k+"="+encodeURIComponent(q[k]); return u;}
function viaScript(q){return new Promise(function(ok,no){
  var cb="gh"+Date.now()+Math.floor(Math.random()*1e6), s=document.createElement("script"), to=setTimeout(function(){end();no(new Error("NET"));},20000);
  function end(){try{delete window[cb];}catch(e){} s.remove(); clearTimeout(to);}
  window[cb]=function(r){end();ok(r);}; s.onerror=function(){end();no(new Error("NET"));};
  s.src=qs(q,cb); (document.head||document.documentElement).appendChild(s);});}
// gọi máy chủ không kèm cookie Google: không bị lỗi khi trình duyệt đăng nhập nhiều tài khoản Google
function jsonp(q){
  if(!window.fetch) return viaScript(q);
  var cb="ghf"+Date.now(), ctl=window.AbortController?new AbortController():null, to=setTimeout(function(){if(ctl)ctl.abort();},20000);
  return fetch(qs(q,cb),{credentials:"omit",redirect:"follow",signal:ctl?ctl.signal:undefined}).then(function(r){return r.text();}).then(function(t){
    clearTimeout(to); t=t.trim(); var i=t.indexOf("("), j=t.lastIndexOf(")");
    if(t.indexOf(cb+"(")!==0||j<i) throw new Error("BAD"); return JSON.parse(t.slice(i+1,j));
  }).catch(function(){clearTimeout(to); return viaScript(q);});
}
var CALL={
  kichHoat:function(phone,device){var role="";try{role=localStorage.getItem("pb_role")||"";}catch(e){} return jsonp({phone:phone,device:device,role:role});},
  xinXuatPdf:function(phone){return jsonp({action:"pdf",phone:phone});},
  dsAnh:function(d){return jsonp({action:"anh",du_an:d}).then(function(r){return (r&&r.anh)||{};});},
  urlApp:function(){return Promise.resolve(null);}
};
function runner(s,f){return new Proxy({},{get:function(_,n){
  if(n==="withSuccessHandler") return function(h){return runner(h,f);};
  if(n==="withFailureHandler") return function(h){return runner(s,h);};
  if(n==="withUserObject") return function(){return runner(s,f);};
  if(!CALL[n]) return undefined;
  return function(){CALL[n].apply(null,arguments).then(function(r){if(s)s(r);},function(e){if(f)f(e);});};}});}
var Q={}; (location.search||"").replace(/^\?/,"").split("&").forEach(function(x){if(!x)return;var i=x.indexOf("=");Q[decodeURIComponent(i<0?x:x.slice(0,i))]=i<0?"":decodeURIComponent(x.slice(i+1));});
window.google={script:{run:runner(null,null),url:{getLocation:function(cb){setTimeout(function(){cb({parameter:Q,hash:location.hash.replace(/^#/,"")});},0);}}}};
// link sang trang khác của ứng dụng (dạng script.google.com/...?page=x) → trang tương ứng trên GitHub (x.html)
function keyOf(h){var m=h.match(/^https:\/\/script\.google\.com\/macros\/s\/([\w-]+)\/exec(?:\?(?:.*&)?page=([\w-]*))?/); if(!m) return null;
  var pg=m[2]||""; if(m[1]===P1){ if(!pg) return "pb"; if(pg==="dongtien") return "pbdongtien"; } return pg||"app";}
function fix(a){var h=a.getAttribute("href")||""; if(h.indexOf("https://script.google.com/macros/s/")!==0) return; var k=keyOf(h); if(!k) return;
  a.setAttribute("href",k==="app"?"./":"./"+k+".html"); a.removeAttribute("target");}
function fixAll(){var L=document.querySelectorAll("a[href]"); for(var i=0;i<L.length;i++) fix(L[i]);}
document.addEventListener("DOMContentLoaded",function(){fixAll(); setTimeout(fixAll,1000); setTimeout(fixAll,4000);});
["click","contextmenu","mousedown","touchstart","focusin","mouseover"].forEach(function(ev){document.addEventListener(ev,function(e){var a=e.target&&e.target.closest?e.target.closest("a[href]"):null; if(a) fix(a);},true);});
})();

// nút quay về trang chọn dự án (mọi trang trừ trang chủ)
(function(){
  var p=location.pathname, home=/\/(index\.html)?$/.test(p); if(home) return;
  var css="body.gh-pad{padding-top:calc(44px + env(safe-area-inset-top))!important}.gh-bar{position:fixed;left:0;right:0;top:0;padding:calc(8px + env(safe-area-inset-top)) 10px 8px;background:linear-gradient(var(--bg,#f5f3ee) 75%,rgba(255,255,255,0));z-index:60;display:flex;flex-wrap:wrap;overflow:visible;gap:8px;align-items:center;pointer-events:none;padding-bottom:4px}.gh-bar::-webkit-scrollbar{display:none}.gh-bar>*{flex:none;white-space:nowrap}@media (max-width:480px){.gh-bar{gap:6px}.gh-bar .gh-home,.gh-bar .ptg-fab,.gh-bar .xp-fab{padding:7px 10px!important;font-size:12.5px!important}}.gh-bar>*{pointer-events:auto}.gh-bar .ptg-fab,.gh-bar .xp-fab{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;padding:7px 13px!important;font:600 13.5px system-ui,-apple-system,'Segoe UI',sans-serif!important;box-shadow:0 4px 14px rgba(0,0,0,.2)!important;margin:0!important}.gh-bar [hidden]{display:none!important}.gh-home{position:static;display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:999px;background:#0e4f4b;color:#fff;text-decoration:none;font:600 13.5px system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.2)}.gh-home:hover{background:#17736d}@media print{.gh-home,.gh-bar{display:none}body.gh-pad{padding-top:0!important}}";
  function put(){
    if(document.querySelector(".gh-bar")) return;
    var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
    var bar=document.createElement("div"); bar.className="gh-bar";
    var a=document.createElement("a"); a.className="gh-home"; a.href="./"; a.innerHTML="&#8592; Các dự án"; a.title="Về trang chọn dự án"; document.body.classList.add("gh-pad");
    bar.appendChild(a); document.body.appendChild(bar);
    /* nút Phiếu tính giá và Xuất PDF tư vấn đưa lên cùng hàng với nút Các dự án */
    function grab(){ [".ptg-fab",".xp-fab"].forEach(function(q){ var b=document.querySelector(q); if(b&&b.parentNode!==bar) bar.appendChild(b); }); pad(); }
    function pad(){ var h=bar.offsetHeight||36; document.body.style.setProperty("padding-top","calc("+(h+14)+"px + env(safe-area-inset-top))","important"); }
    grab(); setTimeout(grab,300); setTimeout(grab,1500);
    try{ new MutationObserver(grab).observe(document.body,{childList:true}); }catch(e){}
    try{ new ResizeObserver(pad).observe(bar); }catch(e){ window.addEventListener("resize",pad); }
  }
  if(document.body) put(); else document.addEventListener("DOMContentLoaded",put);
})();

// Trình duyệt trong Zalo / Facebook trên Android không tải được file PDF (chặn tải file tạo trong trang):
// khi bấm "Xuất PDF" thì gợi ý mở trang này bằng Chrome. Quyền sử dụng giữ nguyên vì máy được nhận diện theo cấu hình điện thoại.
(function(){
  var UA=navigator.userAgent||"";
  if(!/Android/i.test(UA)) return;
  var app=/Zalo/i.test(UA)?"Zalo":/FBAN|FBAV|FB_IAB|Messenger/i.test(UA)?"Facebook":/Instagram/i.test(UA)?"Instagram":/Line\//i.test(UA)?"Line":/; wv\)/.test(UA)?"ứng dụng":"";
  if(!app) return;
  var skip=false;
  var url=location.href.split("#")[0];
  var intent="intent://"+url.replace(/^https?:\/\//,"")+"#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url="+encodeURIComponent(url)+";end";
  function modal(btn){
    var old=document.querySelector(".gh-pdfm"); if(old) old.remove();
    var st=document.getElementById("gh-pdfm-css");
    if(!st){st=document.createElement("style");st.id="gh-pdfm-css";st.textContent=".gh-pdfm{position:fixed;inset:0;z-index:9999;background:rgba(10,20,22,.6);display:flex;align-items:flex-end;justify-content:center;padding:12px}.gh-pdfm .bx{background:#fff;color:#14292c;max-width:440px;width:100%;border-radius:16px;padding:18px 16px calc(16px + env(safe-area-inset-bottom));font:15px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25)}.gh-pdfm h3{margin:0 0 6px;font-size:17px}.gh-pdfm p{margin:6px 0}.gh-pdfm a,.gh-pdfm button{display:block;width:100%;box-sizing:border-box;text-align:center;margin-top:9px;padding:12px;border-radius:12px;font:600 15px system-ui,sans-serif;text-decoration:none;border:none;cursor:pointer}.gh-pdfm .go{background:#0e4f4b;color:#fff}.gh-pdfm .cp{background:#eef4f3;color:#0e4f4b}.gh-pdfm .no{background:none;color:#5b6f72;font-weight:500}.gh-pdfm small{display:block;color:#5b6f72;font-size:13px;margin-top:8px}";document.head.appendChild(st);}
    var m=document.createElement("div"); m.className="gh-pdfm"; m.setAttribute("role","dialog");
    m.innerHTML='<div class="bx"><h3>Mở bằng Chrome để tải file PDF</h3><p>Trình duyệt trong '+app+' không cho tải file PDF về máy. Anh/chị bấm nút dưới đây để mở trang này bằng Chrome, rồi bấm <b>Xuất PDF</b> lại.</p>'+
      '<a class="go" href="'+intent+'">Mở bằng Chrome</a><button type="button" class="cp">Sao chép link trang</button>'+
      '<small>Nếu nút không mở được: bấm dấu <b>⋮</b> (hoặc <b>…</b>) ở góc trên bên phải → <b>Mở bằng trình duyệt</b>. Trong Chrome nhập lại số điện thoại đã đăng ký để dùng tiếp (cùng một điện thoại thường không bị tính thêm máy).</small>'+
      '<button type="button" class="no">Vẫn thử xuất trong '+app+'</button></div>';
    document.body.appendChild(m);
    m.addEventListener("click",function(e){if(e.target===m) m.remove();});
    m.querySelector(".no").onclick=function(){m.remove(); skip=true; try{btn.click();}finally{skip=false;}};
    var cp=m.querySelector(".cp");
    cp.onclick=function(){var ok=function(){cp.textContent="Đã sao chép – dán vào Chrome";};
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok,function(){prompt("Sao chép link:",url);});
      else prompt("Sao chép link:",url);};
  }
  document.addEventListener("click",function(e){
    if(skip) return;
    var b=e.target&&e.target.closest?e.target.closest("button,a"):null; if(!b||b.closest(".gh-pdfm")) return;
    if(!/Xuất PDF/i.test(b.textContent||"")) return;
    e.preventDefault(); e.stopImmediatePropagation(); modal(b);
  },true);
})();

// Màn hình nhập số điện thoại: thu gọn hộp mã QR mở khóa, làm nổi dòng "dùng thử miễn phí", chữ gợi ý trong ô nhập
(function(){
  function fix(){
    var g=document.getElementById("pay_gate"); if(g&&!g.dataset.ghFold){g.dataset.ghFold="1"; g.open=false;}
    var f=document.getElementById("gf"); if(!f) return;
    var p=f.querySelector("p");
    if(p&&!p.dataset.ghFree&&/dùng thử miễn phí/.test(p.textContent)){
      p.dataset.ghFree="1";
      p.innerHTML='<span class="gh-free">Nhập số điện thoại để dùng thử miễn phí ngay</span><span class="gh-free-sub">Số đã được cấp quyền thì dùng theo thời hạn đã cấp.</span>';
    }
    var i=document.getElementById("gp"); if(i&&!i.placeholder) i.placeholder="Nhập số điện thoại để dùng miễn phí";
    if(i&&!document.getElementById("gh_role")){
      var saved=""; try{saved=localStorage.getItem("pb_role")||"";}catch(e){}
      var r=document.createElement("fieldset"); r.id="gh_role"; r.className="gh-role";
      r.innerHTML='<legend>Bạn là ai? <span>(bắt buộc)</span></legend><div class="gh-role-b">'+
        '<label><input type="radio" name="gh_role" value="sales" required'+(saved==="sales"?" checked":"")+'><span>Tôi là Sales</span></label>'+
        '<label><input type="radio" name="gh_role" value="ndt" required'+(saved==="ndt"?" checked":"")+'><span>Tôi là Nhà đầu tư</span></label></div>'+
        '<small>Chọn đối tượng sử dụng để tìm đúng tài liệu bạn cần.</small><div class="gh-role-m" role="alert"></div>';
      var z=document.getElementById("gzalo"); (z&&z.parentNode===f?z:i).insertAdjacentElement("afterend",r);
      r.addEventListener("change",function(e){ if(e.target.name==="gh_role"){ try{localStorage.setItem("pb_role",e.target.value);}catch(x){} r.classList.remove("err"); r.querySelector(".gh-role-m").textContent=""; } });
      f.addEventListener("submit",function(e){ if(!f.querySelector('input[name="gh_role"]:checked')){ e.preventDefault(); e.stopImmediatePropagation(); r.classList.add("err"); r.querySelector(".gh-role-m").textContent="Vui lòng chọn Tôi là Sales hoặc Tôi là Nhà đầu tư."; r.scrollIntoView({block:"center",behavior:"smooth"}); } },true);
      var gb=document.getElementById("gb"); if(gb) gb.addEventListener("click",function(e){ if(!f.querySelector('input[name="gh_role"]:checked')){ e.preventDefault(); e.stopImmediatePropagation(); r.classList.add("err"); r.querySelector(".gh-role-m").textContent="Vui lòng chọn Tôi là Sales hoặc Tôi là Nhà đầu tư."; } },true);
    }
  }
  var st=document.createElement("style");
  st.textContent=".gh-free{display:block;margin:2px 0 4px;padding:10px 12px;border-radius:10px;background:#e6f4ef;border:1px solid #9fd0bf;color:#0b4a3f;font-weight:700;font-size:16.5px;line-height:1.4;text-align:center}.gh-free-sub{display:block;font-size:13px;color:#5d7270}#gp::placeholder{color:#7d918e;font-size:15px;letter-spacing:0}.gh-role{border:0;margin:12px 0 4px;padding:0;text-align:left}.gh-role legend{font-weight:700;font-size:14.5px;margin-bottom:6px;padding:0}.gh-role legend span{font-weight:400;color:#8a5a00;font-size:12.5px}.gh-role-b{display:grid;grid-template-columns:1fr 1fr;gap:8px}.gh-role-b label{display:block;margin:0;cursor:pointer}.gh-role-b input{position:absolute;opacity:0;width:1px;height:1px}.gh-role-b span{display:block;text-align:center;padding:11px 6px;border:2px solid #b9c9c5;border-radius:11px;font-weight:700;font-size:15px;color:#24433f;background:#fff}.gh-role-b input:checked+span{background:#0e5f57;border-color:#0e5f57;color:#fff}.gh-role-b input:focus-visible+span{outline:3px solid #9fd0bf}.gh-role small{display:block;margin-top:6px;color:#5d7270;font-size:12.5px}.gh-role.err .gh-role-b span{border-color:#c0392b}.gh-role-m{color:#c0392b;font-size:13px;font-weight:600;margin-top:4px}";
  (document.head||document.documentElement).appendChild(st);
  if(document.readyState!=="loading") fix(); else document.addEventListener("DOMContentLoaded",fix);
})();

// Lịch sử tra cứu: ghi lại câu hỏi của tài khoản đã kích hoạt (gom nhiều câu, gửi về Sheet của máy chủ dự án 02)
(function(){
  var SV2="https://script.google.com/macros/s/AKfycbwEgmv4gliQyFWw9vm-h2f9AjxB0kQJGGAQuC4JfkXrY_YG3L0Y7gcAUebNk_Dr7oo/exec", QK="pb_qlog";
  function lic(){try{return JSON.parse(localStorage.getItem("pb_qa_lic")||"null")||{};}catch(e){return {};}}
  function load(){try{return JSON.parse(localStorage.getItem(QK)||"[]")||[];}catch(e){return [];}}
  function save(a){try{localStorage.setItem(QK,JSON.stringify(a.slice(-200)));}catch(e){}}
  var TEN={"q1466": "M Riverside Danang", "q1277": "Vinhomes Green Paradise", "q1355": "Vinhomes Hải Vân Bay", "q1385": "Vinhomes Sài Gòn Park", "q612": "Vinhomes Grand Park", "q1295": "Charmora City (cao tầng)", "q1333": "The Global City", "q1332": "Vinhomes Pearl Bay", "q1296": "Charmora City (thấp tầng)", "q613": "The Global City (thấp tầng)", "q771": "Lumière Boulevard", "q772": "Masteri Centre Point", "q1249": "Vinhomes Star City", "q1258": "Vinhomes Grand Park (shophouse)", "q1037": "Vinhomes Green City", "q1435": "Alora Nha Trang - Libera Nha Trang", "q1260": "Grand Marina Saigon", "q1363": "Fours Tower", "q1285": "Sun Cora Tower", "q1406": "S-Light Tower", "q1275": "Sun Spana Tower", "q1308": "Capital Square", "q1320": "Sun Urban City", "q1391": "Sun Symphony 5", "q1272": "Sycamore Bình Dương (thấp tầng)", "q1456": "Ion City", "q1289": "Blanca City", "q1420": "La Tiên Villa - Libera Nha Trang", "q1356": "TMDV Vinhomes Grand Park (thấp tầng)", "q1426": "The Camellia Sơn Trà", "q1318": "Sun Urban City (thấp tầng)", "q1290": "Blanca City (thấp tầng)", "q1306": "Newtown Diamond", "q1423": "Palm City", "q1353": "The Berkley Thảo Điền", "q1413": "Gladia Heights", "q1337": "Sun Symphony Residence", "q1366": "Heragon City", "q1424": "The Parc One", "q1370": "Sycamore Bình Dương – Orchard Collection", "q1297": "Cara World", "q1367": "Thanh Xuan Valley", "q1389": "Salacia Villas", "q1455": "Sun Glory Residences", "q1396": "Eco Central Park (thấp tầng)", "q1360": "Eurowindow Light City", "q1323": "Vincom Shophouse Royal Park", "q1434": "Nghi Sơn Central Park", "q1399": "Flamingo Maison 108 Hồ Núi Cốc", "q1441": "Central Riverside", "q1442": "Vlasta Sầm Sơn", "q1400": "Ibiza Party Resort", "q1401": "Flamingo Hải Tiến (thấp tầng)", "q1403": "Flamingo Heritage Onsen & Resort", "q1405": "Flamingo Golden Hill", "q1467": "Swiss Eden (thấp tầng)", "q1468": "Gladia By The Waters", "q1460": "Selavia Phú Quốc", "q1253": "Vinhomes Star City (thấp tầng)", "q790": "Masteri Rivera Danang", "q1269": "Sun Riverpolis", "q1362": "Sun Võ Chí Công", "q1326": "Sun Symphony Residence (thấp tầng)", "q1328": "Sun Solar Residence", "q1457": "Royal Mansion", "q1348": "The Meridian Đà Nẵng", "p1314": "Malibu Walk", "q1327": "Meyhomes Capital Phú Quốc", "q1394": "Eco Central Park", "q1421": "Cara365", "p1344": "An Bình Homeland", "p1427": "Anlac Green Symphony", "p1448": "Astor 1", "p1280": "Celestine Westlake", "p1411": "Central Lakeside", "p1432": "D’. Diamant Bleu", "p1409": "Eden Residences", "p1388": "Eurowindow Twin Parks", "p872": "Gia By Kita", "p1281": "Greenera Southmark Ngọc Hồi", "p1382": "Hado Charm Villas", "p1404": "Hanoi Signature By Swiss-Belhotel", "p1351": "Him Lam Thượng Phúc Legend", "p1386": "Iconia Lakeside", "p1371": "Iconia Lakeside (thấp tầng)", "p466": "Imperia Signature (Cổ Loa)", "p1341": "Imperia Sky Park", "p1418": "Le Parc Place - Park City", "p1412": "Long Biên Golf Villas", "p1376": "Lumière Hanoi Seasons Garden", "p1279": "Lumière Orient Pearl", "p1443": "Maison Privée", "p297": "Masteri Grand Avenue", "p102": "Masteri Lakeside (OCP1)", "p1276": "Masteri Sky Quarter", "p1248": "Masterise Homes Cổ Loa - Lumière Essence Peak", "p1446": "Metro Grand Street", "p1339": "Metropoli5", "p1431": "Moonlight 2", "p1459": "Mỹ Đình Pearl", "p1464": "Nammon Square", "p1365": "Noble Crystal Long Biên", "p1358": "Noble Crystal Tây Hồ", "p1368": "Noble Palace Long Biên", "p1375": "Noble Palace Tây Hồ", "p1359": "Noble Palace Tây Thăng Long", "p1414": "Pearl Rivera", "p1325": "Rivea Hanoi", "p1469": "Starlake The Prime", "p1251": "Sun Feliza Suites", "p1395": "Sunshine River Park", "p1352": "The Flame Vine", "p1450": "The Heritage Láng Hạ", "p1378": "The Magnolia Private Residences", "p604": "The Matrix One Premium", "p1445": "The President Park", "p1287": "The Queen", "p1381": "The Reflection West Lake", "p586": "The Senique Hà Nội (OCP1)", "p1390": "The Vista Van La", "p1419": "The Vista Van La (thấp tầng)", "p1451": "The Windsor Collection", "p1425": "TMC Smart Home", "p1282": "TMDV Smart City", "p1350": "TMDV Vinhomes Ocean Park 1", "p1454": "Viha Flora", "p308": "Vinhomes Global Gate", "p92": "Vinhomes Ocean Park 1", "p788": "Vinhomes The Gallery", "p465": "Vinhomes Wonder City", "p1461": "Vista Nam An Khánh", "p1393": "Động Lực Tower", "p1261": "Alluvia City", "p1430": "Alluvia Sunshine Marina", "p1321": "Alumi", "p1315": "Imperia Ocean City - The Parkland", "p1463": "Legacy 89", "p1422": "Lumière Ocean Crest", "p358": "Lumière Springbay", "p1310": "Masteri Era Landmark", "p1330": "Masteri Grand Coast", "p533": "Masteri Trinity Square (OCP2)", "p1292": "Sunshine Legend City", "p1453": "The Cityon", "p1265": "The Fullton", "p87": "Vinhomes Ocean Park 2", "p355": "Vinhomes Ocean Park 3", "sr": "The Sunrise Bay", "gc": "Golden Crown Hải Phòng", "sg": "Sol Garden", "hh": "Hoàng Huy Commerce", "sc": "Sun Centro Town", "scdongtien": "Sun Centro Town – Dòng tiền", "sb": "Sora Bay Halong", "sbdongtien": "Sora Bay Halong – Dòng tiền", "lm": "Landmark 35", "lmdongtien": "Landmark 35 – Dòng tiền", "sf": "Sun Festo Town", "sfdongtien": "Sun Festo Town – Dòng tiền", "ih": "Imperia Holiday", "ihdongtien": "Imperia Holiday – Dòng tiền", "pb": "Prima Bay", "dongtien": "Prima Bay – Dòng tiền homestay", "ab": "Aria Bay", "abdongtien": "Aria Bay – Dòng tiền", "hlx": "Vin Hạ Long Xanh", "hlxdongtien": "Vin Hạ Long Xanh – Dòng tiền", "ho": "Horizon Bay", "hodongtien": "Horizon Bay – Dòng tiền", "sk": "SkyM", "skdongtien": "SkyM – Dòng tiền", "se": "The Sea", "nx": "Marina Living (NOXH)", "dk": "Vinhomes Golden City", "xi": "Xanh Island", "es": "Emerald Symphony", "ri": "Vinhomes Royal Island", "fc": "Flamingo Cát Bà", "am": "Ambience – Gamuda", "ru": "Ramond Urbaniz", "ga": "Vinhomes Golden Avenue", "cv": "Crystal Holidays Harbour", "np": "Noble Palace Hạ Long", "js": "Jade Square", "index": "Trang chọn dự án", "pbdongtien": "Prima Bay – Dòng tiền homestay"};
  function appName(){var f=(location.pathname.split("/").pop()||"index").replace(/\.html$/,"")||"index"; return TEN[f]||(document.title||"").replace(/\s*Hỏi Đáp\s*$/,"").trim()||f;}
  function add(q){q=String(q||"").replace(/\s+/g," ").trim(); if(!q) return; var a=load(); a.push([Date.now(),appName(),q.slice(0,300)]); save(a); if(a.length>=5) flush();}
  var busy=false;
  function flush(){
    var L=lic(); if(busy||!L.phone) return; var a=load(); if(!a.length) return;
    var part=[], len=0; for(var i=0;i<a.length&&part.length<20;i++){var s=JSON.stringify(a[i]); if(len+s.length>1400) break; part.push(a[i]); len+=s.length;}
    var role=""; try{role=localStorage.getItem("pb_role")||"";}catch(e){}
    var cb="ghl"+Date.now(), u=SV2+"?callback="+cb+"&action=log&phone="+encodeURIComponent(L.phone)+"&role="+encodeURIComponent(role)+"&d="+encodeURIComponent(JSON.stringify(part));
    busy=true;
    var done=function(ok){busy=false; if(ok){var b=load(); save(b.slice(part.length)); if(b.length-part.length>0) setTimeout(flush,1500);}};
    if(window.fetch) fetch(u,{credentials:"omit"}).then(function(r){return r.text();}).then(function(t){done(/"ok":\s*true/.test(t));}).catch(function(){done(false);});
    else done(false);
  }
  function watch(){
    var log=document.getElementById("log"); if(!log) return;
    new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1&&n.classList&&n.classList.contains("q")) add(n.textContent);});});}).observe(log,{childList:true});
    setInterval(flush,60000); setTimeout(flush,5000);
    document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden") flush();});
  }
  if(document.readyState!=="loading") watch(); else document.addEventListener("DOMContentLoaded",watch);
})();

// Sau mỗi câu trả lời: gợi ý câu hỏi tiếp theo, sát với câu vừa hỏi (không phải kéo lên đầu trang tìm lại)
(function(){
  var SW={"la":1,"co":1,"bao":1,"nhieu":1,"du":1,"an":1,"khong":1,"gi":1,"nao":1,"the":1,"cua":1,"va":1,"cho":1,"ve":1,"o":1,"tai":1,"thi":1,"khi":1,"nay":1,"mot":1,"cac":1,"nhung":1,"duoc":1,"hay":1,"hoac":1,"voi":1,"tu":1,"den":1,"can":0,"hang":1,"nam":1,"ty":1};
  function fold(t){return String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g," ").trim();}
  function words(t){return fold(t).split(" ").filter(function(w){return w.length>1&&!SW[w];});}
  function chips(){var L=[];document.querySelectorAll("#side .chip").forEach(function(c){ if(c.style.display==="none"||c.offsetParent===null&&getComputedStyle(c).display==="none") return; var t=(c.textContent||"").trim(); if(t) L.push({t:t,g:c.closest("#side > div")});}); return L;}
  function pick(q){
    var W=words(q), L=chips(), fq=fold(q), seen={}, out=[];
    var sc=L.map(function(c){var f=" "+fold(c.t)+" ", s=0; W.forEach(function(w){ if(f.indexOf(" "+w+" ")>=0) s+=(/\d/.test(w)?0.5:1); }); return {c:c,s:s};});
    sc.sort(function(a,b){return b.s-a.s;});
    var best=sc.length&&sc[0].s>0?sc[0].c.g:null;
    function add(t){var k=fold(t); if(!k||k===fq||seen[k]) return; seen[k]=1; out.push(t);}
    sc.forEach(function(o){ if(o.s>0&&out.length<4) add(o.c.t); });
    if(best) L.forEach(function(c){ if(c.g===best&&out.length<6) add(c.t); });
    if(out.length<6) L.forEach(function(c){ var h=c.g&&c.g.querySelector("h2"); if(h&&/^Ví dụ/i.test(h.textContent)&&out.length<6) add(c.t); });
    if(out.length<6) L.forEach(function(c){ if(out.length<6) add(c.t); });
    return out.slice(0,6);
  }
  function send(q){var ta=document.querySelector("form textarea, form input[type=text]"), f=ta&&ta.closest("form"); if(!ta||!f) return; ta.value=q; ta.dispatchEvent(new Event("input",{bubbles:true})); if(f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event("submit",{cancelable:true,bubbles:true}));}
  function decorate(a){
    if(!a||a.querySelector(".gh-next")) return; var qe=a.previousElementSibling; if(!qe||!qe.classList.contains("q")) return;
    var L=pick(qe.textContent); if(!L.length) return;
    var d=document.createElement("div"); d.className="gh-next"; d.innerHTML='<span>Có thể hỏi tiếp</span><div class="gh-nc"></div>';
    L.forEach(function(t){var b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t; b.onclick=function(e){e.preventDefault();e.stopPropagation();send(t);}; d.querySelector(".gh-nc").appendChild(b);});
    var tools=a.querySelector(".tools"); if(tools&&tools.parentNode===a) a.insertBefore(d,tools.nextSibling); else a.appendChild(d);
  }
  function start(){var log=document.getElementById("log"); if(!log) return;
    var st=document.createElement("style"); st.textContent=".gh-next{margin:10px 0 2px;padding:10px 12px;border:1px dashed var(--line,#d5ddd9);border-radius:12px;background:var(--panel,#fff)}.gh-next>span{display:block;font:600 11px/1 system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--muted,#667);margin-bottom:8px}.gh-nc{display:flex;flex-wrap:wrap;gap:6px}@media print{.gh-next{display:none}}"; document.head.appendChild(st);
    log.querySelectorAll(".a").forEach(decorate);
    new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){ if(n.nodeType===1&&n.classList.contains("a")) setTimeout(function(){decorate(n);},30); });});}).observe(log,{childList:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
})();

// Nút "Nhập quỹ căn mới": người dùng đã kích hoạt nhập quỹ căn (từng căn hoặc dán từ Excel) → lưu về máy chủ → ứng dụng tự cập nhật
(function(){
  var SV2="https://script.google.com/macros/s/AKfycbwEgmv4gliQyFWw9vm-h2f9AjxB0kQJGGAQuC4JfkXrY_YG3L0Y7gcAUebNk_Dr7oo/exec";
  var K=(location.pathname.split("/").pop()||"").replace(/\.html$/,""); if(!K||K==="index"||/dongtien$/.test(K)) return;
  var LOW={"sb": "L", "hlx": "L", "ho": "L", "dk": "L", "es": "L", "ri": "L", "ru": "L", "ga": "L", "np": "L", "sg": "L", "p1427": "L", "p1411": "L", "p1409": "L", "p1388": "L", "p872": "L", "p1382": "L", "p1351": "L", "p1371": "L", "p1412": "L", "p1446": "L", "p1464": "L", "p1368": "L", "p1375": "L", "p1359": "L", "p1414": "L", "p1450": "L", "p1445": "L", "p1419": "L", "p1451": "L", "p1282": "L", "p1350": "L", "p308": "L", "p788": "L", "p465": "L", "p1461": "L", "p1261": "L", "p1463": "L", "p1265": "L", "p87": "L", "p355": "L", "p1314": "L", "q1290": "L", "q1468": "L", "q1389": "L", "q1272": "L", "q1356": "L", "q613": "L", "q1258": "L", "q1037": "L", "q1277": "L", "q1385": "L", "q1269": "L", "q1326": "L", "q1362": "L", "q1355": "L", "q1297": "L", "q1296": "L", "q1420": "L", "q1332": "L", "q1441": "L", "q1396": "L", "q1360": "L", "q1401": "L", "q1366": "L", "q1434": "L", "q1323": "L", "q1253": "L", "q1442": "L", "q1405": "L", "q1403": "L", "q1399": "L", "q1456": "L", "q1318": "L", "q1467": "L", "q1367": "L"};
  var FA=[["c","Mã căn *"],["toa","Tòa"],["tang","Tầng"],["truc","Trục"],["loai","Loại căn"],["tt","DT thông thủy (m²)"],["tim","DT tim tường (m²)"],["huong","Hướng"],["view","View"],["gia","Giá bán"],["tts","Giá thanh toán sớm"],["gc","Ghi chú giá (VAT, KPBT…)"],["quy","Nguồn quỹ / sàn"],["st","Tình trạng"],["note","Ghi chú"]];
  var FL=[["c","Mã căn *"],["khu","Phân khu / dãy"],["loai","Loại căn"],["dat","DT đất (m²)"],["xd","DT xây dựng (m²)"],["tang","Số tầng"],["huong","Hướng"],["gia","Giá bán"],["tts","Giá thanh toán sớm"],["gc","Ghi chú giá (VAT, KPBT…)"],["quy","Nguồn quỹ / sàn"],["st","Tình trạng"],["note","Ghi chú"]];
/* Đọc bảng hàng (file Excel nhiều sheet hoặc bảng dán từ Excel/Google Sheet) → danh sách căn theo cột chuẩn của ứng dụng */
var UQP=(function(){
  function fold(t){return String(t==null?"":t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g," ").trim();}
  function txt(c){return c==null?"":(typeof c==="object"&&!(c instanceof Date)?(c.v==null?"":c.v):c);}
  function fillOf(c){return c&&typeof c==="object"&&c.f?String(c.f).toUpperCase():"";}
  var ST=[[/da ban|sold/,"Đã bán"],[/lock|giu cho|dang giu/,"Đang lock / giữ chỗ"],[/check admin|kiem tra/,"Cần check admin"],[/doc quyen/,"Độc quyền"],[/chua mo|chua ban ra/,"Chưa mở bán"],[/dang mo ban|dang ban|con hang|mo ban/,"Đang mở bán"]];
  function stOf(t){var f=fold(t); for(var i=0;i<ST.length;i++) if(ST[i][0].test(f)) return ST[i][1]; return "";}
  function classify(h,low,hasMaCan){
    var f=fold(h); if(!f) return null;
    if(/^(stt|tt|so tt|no)$/.test(f)) return null;
    if(/stk|tai khoan|chu tk|so tk/.test(f)) return null;
    if(/sdt|so dien thoai|dien thoai|^dt lien he|phone|zalo|email|mail/.test(f)) return null;
    if(/^ptg$|phieu tinh gia|chi can|^link|hinh anh|anh can|^anh$/.test(f)) return null;
    if(/^(ma can|ma san pham|ma sp|can ho|can|ma can ho|ma lo|ky hieu|ky hieu can|ky hieu lo|so lo|ma nha|ma bds|ma)$/.test(f)||/^ma can\b|^can ho so|^ma san pham/.test(f)) return f==="ma"&&hasMaCan?"truc":"c";
        if(/^so can$|^can so$|truc/.test(f)) return "truc";
    if(/^toa|^block|^blok/.test(f)) return low?"khu":"toa";
    if(/phan khu|^khu\b|^vinh|^day\b|^lo\b/.test(f)) return "khu";
    if(/tang/.test(f)&&!/tien|gia/.test(f)) return "tang";
    if(/^loai|loai can|loai hinh|so pn|phong ngu|dang can|kieu can/.test(f)) return "loai";
    if(/thong thuy|^dttt|^dt tt/.test(f)) return "tt";
    if(/tim tuong/.test(f)) return "tim";
    if(/(dien tich|^dt) ?dat|^dien tich dat/.test(f)&&!/gia/.test(f)) return "dat";
    if(/dtxd|xay dung|dien tich san|tong dien tich/.test(f)&&!/gia|tien|don/.test(f)) return "xd";
    if(/huong/.test(f)) return "huong";
    if(/^dien tich$|^dt$|^dien tich m2$|^dt m2$/.test(f)) return low?"dat":"tt";
    if(/view|tam nhin/.test(f)) return "view";
    if(/thanh toan som|tt som|sau uu dai|sau chiet khau|sau ck/.test(f)) return "tts";
    if(/tinh trang|trang thai|status/.test(f)) return "st";
    if(/^dai ly|^dl$|^quy|nguon hang|^san$/.test(f)) return "quy";
    if(/ghi chu gia/.test(f)) return "gc";
    if(/ghi chu|note/.test(f)) return "note";
    return "x";
  }
  function priceScore(h){var f=fold(h).replace(/^tgt\b/,'tong gia tri'); if(!/gia/.test(f)||/don gia|chua gom|truoc vat|chua vat|gia tri dat|gia tri xay|tien dat|tien xay/.test(f)) return 0;
    if(/kpbt/.test(f)&&/gom|bao gom/.test(f)) return 5; if(/gia tri can|tong gia|gia ban gom|gom thue|gom vat/.test(f)) return 4; if(/gia ban|niem yet|chinh thuc|gia tran|gia full/.test(f)) return 3; return 1;}
  function ty(n){return (Math.round(n/1e6)/1e3).toLocaleString("vi-VN",{maximumFractionDigits:3})+" tỷ";}
  function num(v){ if(typeof v==="number") return v; var s=String(v).trim(); if(!/^[\d.,\s]+$/.test(s)) return NaN; if(/^\d{1,3}([.,]\d{3})+$/.test(s)) return +s.replace(/[.,]/g,""); return +s.replace(/\s/g,"").replace(",","."); }
  function fmt(k,v,h){
    if(v instanceof Date) return ("0"+v.getDate()).slice(-2)+"/"+("0"+(v.getMonth()+1)).slice(-2)+"/"+v.getFullYear();
    var s=String(v).trim(); if(!s||s==="-") return "";
    var n=num(v);
    if(!isNaN(n)){
      var fh=fold(h);
      if(k==="x"&&/don gia/.test(fh)&&n>=1e5) return (Math.round(n/1e5)/10).toLocaleString("vi-VN")+" tr/m²";
      if(k==="gia"||k==="tts"||(k==="x"&&/gia|tien|vat|kpbt|tgt/.test(fh))){ if(n>=1e6) return ty(n); if(n>0&&n<1000&&(k==="gia"||k==="tts")) return n.toLocaleString("vi-VN")+" tỷ"; }
      if(k==="tang"||k==="truc") return String(Math.round(n*100)/100).replace(/\.0+$/,"");
      if(k==="tt"||k==="tim"||k==="dat"||k==="xd") return (Math.round(n*100)/100).toLocaleString("vi-VN");
      if(k==="x"&&/ngay|date/.test(fh)&&n>30000&&n<60000){var d=new Date(Math.round((n-25569)*864e5)); return ("0"+d.getUTCDate()).slice(-2)+"/"+("0"+(d.getUTCMonth()+1)).slice(-2)+"/"+d.getUTCFullYear();}
      if(Math.abs(n-Math.round(n))<1e-9) return String(Math.round(n));
    }
    return s.replace(/\s+/g," ");
  }
  function codeOk(s){s=String(s).trim(); return s.length>=3&&s.length<=30&&/\d/.test(s)&&/[a-z]/i.test(s)&&!/\s{2,}/.test(s)&&!/^(toa|tang|block|khu)\b/i.test(fold(s));}
  /* grid: mảng dòng, mỗi ô là giá trị hoặc {v, f:'RRGGBB'} */
  function parse(grid,low){
    var H=-1,best=0;
    for(var r=0;r<Math.min(grid.length,25);r++){var row=grid[r]||[], has=false, n=0;
      row.forEach(function(c){var f=fold(txt(c)); if(/^ma can|^ma$|^ma san pham/.test(f)) has=true; if(f&&classify(txt(c),low,true)&&classify(txt(c),low,true)!=="x") n++;});
      if(has&&n>best){best=n;H=r;} if(has&&H<0){H=r;}}
    if(H<0){ best=0; for(var r1=0;r1<Math.min(grid.length,25);r1++){var n1=0;(grid[r1]||[]).forEach(function(c){var k=classify(txt(c),low,false); if(k&&k!=="x") n1++;}); if(n1>best){best=n1;H=r1;}} if(best<3) H=-1; }
    if(H<0){ // không có tiêu đề: tìm cột có nhiều giá trị giống mã căn nhất, dùng làm mã căn
      var cnt={}; grid.slice(0,400).forEach(function(row){(row||[]).forEach(function(c,i){if(codeOk(txt(c))) cnt[i]=(cnt[i]||0)+1;});});
      var bc=-1,bv=0; Object.keys(cnt).forEach(function(i){if(cnt[i]>bv){bv=cnt[i];bc=+i;}}); if(bc<0||bv<3) return {ok:false,msg:"Không tìm thấy cột mã căn."};
      var w=0; grid.forEach(function(r){w=Math.max(w,(r||[]).length);}); var hd=[]; for(var i0=0;i0<w;i0++) hd.push(i0===bc?"Mã căn":"Cột "+(i0+1)); grid=[hd].concat(grid); H=0; }
    var head=(grid[H]||[]).map(function(c){return String(txt(c)).replace(/\s+/g," ").trim();});
    var sub=grid[H+1]||[], subTxt=sub.filter(function(c){var t=String(txt(c)).trim(); return t&&isNaN(num(t));}).length;
    var start=H+1;
    if(subTxt>=2&&!sub.some(function(c){return codeOk(txt(c));})){ var par=""; head=head.map(function(h,i){ if(h) par=h; var s=String(txt(sub[i])||"").replace(/\s+/g," ").trim(); return s?(h&&h!==s?h+" – "+s:(par&&!h?par+" – "+s:s)):h;}); start=H+2; }
    var hasMa=head.some(function(h){return /^ma can|^ma san pham/.test(fold(h));});
    var keys=head.map(function(h){return classify(h,low,hasMa);});
    // giá: chỉ giữ 1 cột tổng giá rõ nhất, cột giá khác thành cột thêm
    var bi=-1,bs=0; head.forEach(function(h,i){var s=priceScore(h); if(s>bs){bs=s;bi=i;}}); head.forEach(function(h,i){ if(priceScore(h)>0||keys[i]==="x"&&/^gia/.test(fold(h))) keys[i]=(i===bi)?"gia":"x"; });
    var used={}; keys=keys.map(function(k,i){ if(!k||k==="x") return k; if(used[k]) return "x"; used[k]=1; return k;});
    var ci=keys.indexOf("c");
    if(ci<0){ var cc={}; grid.slice(start,start+300).forEach(function(row){(row||[]).forEach(function(c,i){if(codeOk(txt(c))) cc[i]=(cc[i]||0)+1;});}); var bv2=0; Object.keys(cc).forEach(function(i){if(cc[i]>bv2){bv2=cc[i];ci=+i;}}); if(ci<0||bv2<2) return {ok:false,msg:"Không tìm thấy cột mã căn."}; keys[ci]="c"; }
    // cột không có tên rõ ("Cột 3"…): đoán theo giá trị (loại căn, giá, diện tích, hướng, tình trạng)
    keys.forEach(function(k,i){ if(k!=="x"||!/^(cot \d+|column \d+|)$/.test(fold(head[i]))) return;
      var vals=grid.slice(start,start+200).map(function(r){return String(txt((r||[])[i])).trim();}).filter(Boolean); if(vals.length<2) return;
      var hit=function(re){return vals.filter(function(v){return re.test(fold(v));}).length/vals.length;};
      var nums=vals.map(num).filter(function(n){return !isNaN(n);});
      var cand=null;
      if(hit(/^(studio|stu|\d ?pn|\d ?br|duplex|penthouse|lien ke|shophouse|song lap|don lap|biet thu|villa|shop)/)>0.6) cand="loai";
      else if(hit(/ty$|ti$/)>0.5||(nums.length/vals.length>0.8&&nums.every(function(n){return n>=1e8;}))) cand="gia";
      else if(hit(/^(dong|tay|nam|bac)( (nam|bac))?$/)>0.6) cand="huong";
      else if(hit(/da ban|dang ban|lock|check admin|giu cho|con hang/)>0.5) cand="st";
      else if(nums.length/vals.length>0.8&&nums.every(function(n){return n>=15&&n<=1000;})&&nums.some(function(n){return n%1;})) cand=low?"dat":"tt";
      if(cand&&keys.indexOf(cand)<0) keys[i]=cand; });
    var lab={}, names={}; keys.forEach(function(k,i){ if(k!=="x") return; var n=head[i]||("Cột "+(i+1)); if(names[n]){names[n]++; n=n+" ("+names[n]+")";} else names[n]=1; lab[i]="x:"+n.slice(0,40);});
    // chú thích màu (trên dòng tiêu đề): màu ô → tình trạng
    var leg={}; for(var r2=0;r2<H;r2++)(grid[r2]||[]).forEach(function(c,i){var s=stOf(txt(c)), f=fillOf(c); if(s&&f&&f!=="FFFFFF") leg[f]=s; var nx=(grid[r2]||[])[i-1]; if(s&&!f&&nx&&fillOf(nx)&&!txt(nx)&&fillOf(nx)!=="FFFFFF") leg[fillOf(nx)]=s;});
    var out=[], seen={}, secCtx="";
    for(var r3=start;r3<grid.length;r3++){var row=grid[r3]||[], code=String(txt(row[ci])).trim().replace(/\s+/g,"");
      if(!codeOk(code)){ var ne=row.filter(function(c){return String(txt(c)).trim();}); if(ne.length===1){var sec=String(txt(ne[0])).trim(), fs=fold(sec); if(/^(toa|block|phan khu|khu|day|vinh)\b/.test(fs)&&sec.length<40) secCtx=sec.replace(/^(tòa|toà|toa|block|phân khu|khu|dãy)\s*/i,"");} continue; }
      code=code.toUpperCase();
      var u=seen[code]||{c:code};
      keys.forEach(function(k,i){ if(!k||k==="c") return; var v=fmt(k,txt(row[i]),head[i]); if(!v) return; if(k==="st") v=stOf(v)||v; u[k==="x"?lab[i]:k]=v; });
      if(secCtx&&!u.toa&&!u.khu) u[low?"khu":"toa"]=secCtx;
      if(!u.st){ for(var j=0;j<row.length;j++){ if(j===ci) continue; var tv=String(txt(row[j])).trim(); if(tv&&tv.length<=25&&isNaN(num(tv))){ var s2=stOf(tv); if(s2&&/^(da ban|lock|dang lock|check admin|giu cho|dang giu|chua mo ban|sold)/.test(fold(tv))){u.st=s2;break;} } } }
      if(!u.st){ var f=fillOf(row[ci]); if(f&&leg[f]) u.st=leg[f]; else if(Object.keys(leg).length&&!seen[code]) u.st="Đang mở bán"; }
      if(!seen[code]){seen[code]=u; out.push(u);} }
    var good=out.filter(function(u){return u.gia||u.loai||u.tt||u.dat||u.st||u.tim;}).length;
    return {ok:true,u:out,header:H+1,cols:head.filter(Boolean).length,legend:leg,main:out.length>=1&&good>=out.length*0.5};
  }
  function fromText(t){ var L=String(t||"").replace(/\r/g,"").split("\n"); var sep=L.some(function(l){return l.indexOf("\t")>=0;})?"\t":(L[0].indexOf(";")>=0?";":","); return L.map(function(l){return l.split(sep);}); }
  function fromSheet(XLSX,ws){ if(!ws||!ws["!ref"]) return []; var R=XLSX.utils.decode_range(ws["!ref"]), g=[]; for(var r=R.s.r;r<=Math.min(R.e.r,R.s.r+5000);r++){var row=[]; for(var c=R.s.c;c<=Math.min(R.e.c,R.s.c+60);c++){var cell=ws[XLSX.utils.encode_cell({r:r,c:c})]; var f=cell&&cell.s&&cell.s.patternType==="solid"&&cell.s.fgColor&&cell.s.fgColor.rgb?String(cell.s.fgColor.rgb).slice(-6):""; row.push(cell?{v:cell.v instanceof Date?cell.v:(cell.w!=null&&typeof cell.v==="string"?cell.w:cell.v),f:f}:(f?{v:"",f:f}:null));} g.push(row);} 
    (ws["!merges"]||[]).forEach(function(m){ var v=g[m.s.r-R.s.r]&&g[m.s.r-R.s.r][m.s.c-R.s.c]; if(!v) return; for(var c=m.s.c;c<=m.e.c;c++) if(m.s.r===m.e.r&&c>m.s.c&&g[m.s.r-R.s.r]&&!g[m.s.r-R.s.r][c-R.s.c]) {} }); return g; }
  return {parse:parse,fromText:fromText,fromSheet:fromSheet,fold:fold,fmt:fmt,stOf:stOf};
})();


  var F=LOW[K]?FL:FA, extra=[];
  var MAP=[[/^(ma can|ma|can|ma so|code)$/,"c"],[/toa|block|building/,"toa"],[/phan khu|^khu|day nha|^day/,"khu"],[/so tang|^tang|floor/,"tang"],[/truc|axis/,"truc"],[/loai|type|so pn|phong ngu/,"loai"],[/thong thuy|^tt$|dt tt|dien tich thong/,"tt"],[/tim tuong|tim$/,"tim"],[/dat/,"dat"],[/xay dung|^xd|san xay/,"xd"],[/huong/,"huong"],[/view|tam nhin/,"view"],[/thanh toan som|tt som|tts|gia sau uu dai/,"tts"],[/ghi chu gia|ghi chu ve gia|vat|kpbt/,"gc"],[/gia|tong gia|price/,"gia"],[/quy|san|nguon|dai ly/,"quy"],[/tinh trang|trang thai|status/,"st"],[/ghi chu|note/,"note"]];
  function fold(t){return String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g," ").trim();}
  function lic(){try{return JSON.parse(localStorage.getItem("pb_qa_lic")||"null")||{};}catch(e){return {};}}
  function E(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function label(k){var f=(F.concat(extra)).filter(function(x){return x[0]===k;})[0]; return f?f[1].replace(" *",""):k.replace(/^x:/,"");}
  function cache(u){try{localStorage.setItem("uq_"+K,JSON.stringify({at:Date.now(),u:u}));}catch(e){} try{window.dispatchEvent(new Event("uq"));}catch(e){}}
  function cached(){try{return (JSON.parse(localStorage.getItem("uq_"+K)||"null")||{}).u||[];}catch(e){return [];}}
  function jget(q){var cb="ghq"+Date.now()+Math.floor(Math.random()*1e4), u=SV2+"?callback="+cb; for(var k in q) u+="&"+k+"="+encodeURIComponent(q[k]);
    return fetch(u,{credentials:"omit"}).then(function(r){return r.text();}).then(function(t){var i=t.indexOf("("),j=t.lastIndexOf(")"); return JSON.parse(t.slice(i+1,j));});}
  function refresh(){ if(!window.fetch) return; jget({action:"quy",duan:K}).then(function(r){ if(r&&r.ok) cache(r.u||[]); }).catch(function(){}); }
  var css=".gh-bar .gh-home{order:0}.gh-bar .ptg-fab{order:1}.gh-bar .xp-fab{order:2}.gh-bar .uq-btn{order:3}.uq-btn{border:none;border-radius:999px;padding:7px 13px;background:#1d7a4c;color:#fff;font:600 13.5px system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.2);cursor:pointer;white-space:nowrap}.uq-btn:hover{background:#15603b}"
   +".uq-ov{position:fixed;inset:0;z-index:200;background:rgba(10,20,30,.55);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:calc(16px + env(safe-area-inset-top)) 10px 30px}"
   +".uq-pn{background:#fff;color:#16302e;width:100%;max-width:860px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.35);font:14px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif}"
   +".uq-hd{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #e3e8ee}.uq-hd b{font-size:16px}.uq-hd button{margin-left:auto;border:none;background:#eef2f5;border-radius:8px;width:34px;height:34px;font-size:20px;cursor:pointer}"
   +".uq-bd{padding:14px 18px;display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}.uq-bd>*{min-width:0}.uq-pn{min-width:0;box-sizing:border-box}.uq-tabs{display:flex;gap:6px}.uq-tabs button{border:1px solid #d5dde5;background:#fff;border-radius:999px;padding:6px 14px;font:600 13px inherit;cursor:pointer}.uq-tabs button[aria-pressed=true]{background:#1d7a4c;border-color:#1d7a4c;color:#fff}"
   +".uq-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}.uq-grid label{display:grid;gap:3px;font-size:12.5px;color:#4b5d66}.uq-grid input,.uq-grid select,.uq-bd textarea{border:1px solid #cfd8e0;border-radius:8px;padding:8px 10px;font:14px inherit;color:#16302e;background:#fff;width:100%}"
   +".uq-bd textarea{min-height:140px;font-family:ui-monospace,Consolas,monospace;font-size:12.5px}.uq-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.uq-row button{border:1px solid #cfd8e0;background:#fff;border-radius:9px;padding:8px 14px;font:600 13.5px inherit;cursor:pointer}.uq-row .pri{background:#1d7a4c;border-color:#1d7a4c;color:#fff}"
   +".uq-note{font-size:12.5px;color:#5b6b73}.uq-file{display:inline-flex;align-items:center;gap:6px;border:1px solid #1d7a4c;color:#1d7a4c;background:#eef8f2;border-radius:9px;padding:8px 14px;font-weight:600;cursor:pointer}.uq-msg{font-size:13.5px;min-height:18px}.uq-msg.err{color:#b3261e}.uq-msg.ok{color:#1d7a4c}.uq-tw{overflow-x:auto;border:1px solid #e3e8ee;border-radius:10px}.uq-tw table{border-collapse:collapse;font-size:12.5px;min-width:100%}.uq-tw th,.uq-tw td{border-bottom:1px solid #eef1f4;padding:5px 8px;text-align:left;white-space:nowrap}.uq-tw th{background:#f4f7f9}.uq-tw td[contenteditable]:focus{outline:2px solid #1d7a4c;background:#f2faf5}";
  function open(){
    var L=lic(); var ov=document.createElement("div"); ov.className="uq-ov";
    ov.innerHTML='<div class="uq-pn" role="dialog" aria-label="Nhập quỹ căn mới"><div class="uq-hd"><b>Nhập quỹ căn mới</b><button type="button" aria-label="Đóng">×</button></div><div class="uq-bd">'
     +(L.phone?'':'<p class="uq-msg err">Cần kích hoạt ứng dụng bằng số điện thoại trước khi nhập quỹ căn.</p>')
     +'<p class="uq-note">Quỹ căn nhập ở đây được lưu vào hệ thống và hiện ngay trong ứng dụng của dự án này cho mọi người dùng (ghi rõ là do người dùng nhập). Cùng mã căn nhập lại thì lấy thông tin mới nhất.</p>'
     +'<div class="uq-tabs"><button type="button" data-t="one" aria-pressed="true">Nhập từng căn</button><button type="button" data-t="paste" aria-pressed="false">Từ file Excel / dán bảng</button></div>'
     +'<div data-p="one"><div class="uq-grid" id="uq-f"></div><div class="uq-row" style="margin-top:10px"><button type="button" id="uq-addcol">+ Thêm cột</button><button type="button" id="uq-addrow">Thêm căn khác (nhập nhiều căn)</button></div></div>'
     +'<div data-p="paste" hidden><div class="uq-row"><label class="uq-file" for="uq-fileinp">📄 Chọn file Excel / CSV</label><input type="file" id="uq-fileinp" accept=".xlsx,.xls,.xlsm,.csv,.ods" hidden><span class="uq-note">nhận nhiều sheet, tự tìm dòng tiêu đề, đọc cả màu tình trạng (đã bán, lock…)</span></div>'
     +'<div class="uq-row" style="margin-top:8px"><label class="uq-file" for="uq-imginp">📷 Chụp ảnh / chọn ảnh bảng hàng</label><input type="file" id="uq-imginp" accept="image/*" multiple hidden><span class="uq-note">AI đọc bảng trong ảnh (chọn được nhiều ảnh). Kiểm tra và sửa lại từng ô trước khi lưu.</span></div>'
     +'<div id="uq-sheets"></div>'
     +'<p class="uq-note" style="margin-top:10px">Hoặc copy bảng trong Excel / Google Sheet rồi dán vào ô dưới (có hay không có dòng tiêu đề đều được; khi dán, màu ô không được giữ nên tình trạng lấy theo cột chữ).</p><textarea id="uq-paste" placeholder="Mã căn&#9;Tòa&#9;Tầng&#9;Loại&#9;Diện tích&#9;Giá&#10;C22130&#9;C2&#9;21&#9;Studio&#9;30,2&#9;3,65 tỷ"></textarea><div class="uq-row" style="margin-top:8px"><button type="button" id="uq-parse">Đọc bảng đã dán</button></div></div>'
     +'<div><b style="font-size:13.5px">Danh sách sẽ lưu (<span id="uq-n">0</span> căn)</b><div class="uq-tw" style="margin-top:6px"><table id="uq-tb"></table></div></div>'
     +'<div class="uq-row"><button type="button" class="pri" id="uq-save">Lưu vào hệ thống</button><button type="button" id="uq-clear">Xóa danh sách</button><span class="uq-msg" id="uq-msg"></span></div>'
     +'</div></div>';
    document.body.appendChild(ov);
    var list=[], $=function(s){return ov.querySelector(s);};
    function close(){ov.remove();}
    $(".uq-hd button").onclick=close; ov.addEventListener("click",function(e){if(e.target===ov) close();});
    ov.querySelectorAll(".uq-tabs button").forEach(function(b){b.onclick=function(){ov.querySelectorAll(".uq-tabs button").forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false");}); ov.querySelectorAll("[data-p]").forEach(function(p){p.hidden=p.getAttribute("data-p")!==b.getAttribute("data-t");});};});
    function form(){ $("#uq-f").innerHTML=F.concat(extra).map(function(f){ var id="uq_"+f[0].replace(/[^a-z0-9]/gi,"_");
      if(f[0]==="st") return '<label for="'+id+'">'+E(f[1])+'<select id="'+id+'" data-k="st"><option>Đang mở bán</option><option>Đã bán</option><option>Đang lock / giữ chỗ</option><option>Chưa mở bán</option></select></label>';
      return '<label for="'+id+'">'+E(f[1])+'<input id="'+id+'" data-k="'+E(f[0])+'" autocomplete="off"></label>'; }).join(""); }
    function cols(){var s={}; list.forEach(function(u){Object.keys(u).forEach(function(k){s[k]=1;});}); var o=F.map(function(f){return f[0];}).filter(function(k){return s[k];}); Object.keys(s).forEach(function(k){if(o.indexOf(k)<0) o.push(k);}); return o;}
    function draw(){var c=cols(); $("#uq-n").textContent=list.length; $("#uq-tb").innerHTML=list.length?'<thead><tr>'+c.map(function(k){return '<th>'+E(label(k))+'</th>';}).join("")+'<th></th></tr></thead><tbody>'+list.map(function(u,i){return '<tr>'+c.map(function(k){return '<td contenteditable="true" data-r="'+i+'" data-k="'+E(k)+'">'+E(u[k]||"")+'</td>';}).join("")+'<td><button type="button" data-del="'+i+'" style="border:none;background:none;color:#b3261e;cursor:pointer">Bỏ</button></td></tr>';}).join("")+'</tbody>':'<tbody><tr><td class="uq-note" style="padding:10px">Chưa có căn nào. Nhập từng căn hoặc dán bảng từ Excel.</td></tr></tbody>';}
    $("#uq-tb").addEventListener("focusout",function(e){var td=e.target.closest&&e.target.closest("td[data-k]"); if(!td) return; var u=list[+td.getAttribute("data-r")]; if(!u) return; var k=td.getAttribute("data-k"), v=td.textContent.replace(/\s+/g," ").trim(); if(k==="c"){ v=v.toUpperCase().replace(/\s+/g,""); if(!v){td.textContent=u.c; return;} } if(v) u[k]=v; else delete u[k];});
    $("#uq-tb").addEventListener("click",function(e){var b=e.target.closest("[data-del]"); if(b){list.splice(+b.getAttribute("data-del"),1); draw();}});
    function msg(t,c){var m=$("#uq-msg"); m.textContent=t; m.className="uq-msg "+(c||"");}
    $("#uq-addcol").onclick=function(){var w=document.createElement("div"); w.className="uq-row"; w.innerHTML='<input id="uq-newcol" placeholder="Tên cột mới, ví dụ: Chính sách, Số phòng ngủ" style="flex:1;min-width:200px;border:1px solid #cfd8e0;border-radius:8px;padding:8px 10px;font:14px inherit"><button type="button" class="pri">Thêm</button>';
      this.parentNode.after(w); var inp=w.querySelector("input"); inp.focus(); w.querySelector("button").onclick=function(){var n=inp.value.trim(); if(n){var k="x:"+n.slice(0,30); if(!extra.some(function(x){return x[0]===k;})) extra.push([k,n.slice(0,30)]); var keep={}; ov.querySelectorAll("#uq-f [data-k]").forEach(function(i){keep[i.getAttribute("data-k")]=i.value;}); form(); ov.querySelectorAll("#uq-f [data-k]").forEach(function(i){if(keep[i.getAttribute("data-k")]!=null) i.value=keep[i.getAttribute("data-k")];});} w.remove();};};
    function takeForm(quiet){var u={}; ov.querySelectorAll("#uq-f [data-k]").forEach(function(i){var v=i.value.trim(); if(v) u[i.getAttribute("data-k")]=v;}); u.c=String(u.c||"").toUpperCase().replace(/\s+/g,""); if(!u.c) return null; list=list.filter(function(x){return x.c!==u.c;}); list.push(u); ov.querySelectorAll("#uq-f input").forEach(function(i){ if(["c","tang","truc"].indexOf(i.getAttribute("data-k"))>=0) i.value=""; }); draw(); return u;}
    $("#uq-addrow").onclick=function(){var u={}; ov.querySelectorAll("#uq-f [data-k]").forEach(function(i){var v=i.value.trim(); if(v) u[i.getAttribute("data-k")]=v;});
      u.c=String(u.c||"").toUpperCase().replace(/\s+/g,""); if(!u.c){msg("Cần nhập mã căn.","err"); return;}
      list=list.filter(function(x){return x.c!==u.c;}); list.push(u); draw(); msg("Đã thêm căn "+u.c+". Nhập tiếp căn khác hoặc bấm \"Lưu vào hệ thống\".","ok");
      ov.querySelectorAll("#uq-f input").forEach(function(i){ if(["c","tang","truc"].indexOf(i.getAttribute("data-k"))>=0) i.value=""; }); var c0=$("#uq-f [data-k=c]"); if(c0) c0.focus();};
    function mergeIn(U,label){ var n=0; U.forEach(function(u){ var o=null; for(var q=0;q<list.length;q++) if(list[q].c===u.c){o=list[q];break;} if(!o){o={c:u.c}; list.push(o);} for(var k in u){ if(k!=="c"&&u[k]!=="") o[k]=u[k]; if(k.indexOf("x:")===0&&!extra.some(function(x){return x[0]===k;})) extra.push([k,k.slice(2)]);} n++; }); draw(); return n; }
    $("#uq-parse").onclick=function(){var txt=$("#uq-paste").value.replace(/\r/g,"").trim(); if(!txt){msg("Chưa có dữ liệu để đọc.","err"); return;}
      var r=UQP.parse(UQP.fromText(txt),!!LOW[K]); if(!r.ok){msg(r.msg,"err"); return;}
      var n=mergeIn(r.u); $("#uq-paste").value=""; msg("Đã đọc "+n+" căn. Kiểm tra bảng rồi bấm \"Lưu vào hệ thống\".","ok");};
    function shrink(file){ return new Promise(function(res,rej){ var fr=new FileReader(); fr.onload=function(){ var im=new Image(); im.onload=function(){ var M=2000, w=im.width, h=im.height, k=Math.min(1,M/Math.max(w,h)); var cv=document.createElement("canvas"); cv.width=Math.round(w*k); cv.height=Math.round(h*k); cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height); res(cv.toDataURL("image/jpeg",0.85).split(",")[1]); }; im.onerror=function(){rej(new Error("Không mở được ảnh"));}; im.src=fr.result; }; fr.onerror=rej; fr.readAsDataURL(file); }); }
    function fromAI(rows){ return rows.map(function(r){ var u={}; Object.keys(r||{}).forEach(function(k){ var v=r[k]; if(k==="x"&&v&&typeof v==="object"){ Object.keys(v).forEach(function(n){ var t=String(v[n]==null?"":v[n]).trim(); if(t&&!/sdt|dien thoai|tai khoan|stk|email/.test(UQP.fold(n))) u["x:"+String(n).slice(0,40)]=UQP.fmt("x",t,n); }); return; } if(v==null||v==="") return; var t=String(v).trim(); if(!t) return; u[k]=k==="st"?(UQP.stOf(t)||t):(k==="c"?t.toUpperCase().replace(/\s+/g,""):UQP.fmt(k,t,"")); }); return u; }).filter(function(u){return u.c&&u.c.length>=2;}); }
    $("#uq-imginp").onchange=function(){ var files=[].slice.call(this.files||[]); this.value=""; if(!files.length) return; var L=lic(); if(!L.phone){msg("Cần kích hoạt ứng dụng bằng số điện thoại trước.","err"); return;}
      var i=0, tot=0, left=null;
      (function next(){ if(i>=files.length){ msg("Đã đọc "+tot+" căn từ "+files.length+" ảnh"+(left!=null?" (còn "+left+" lượt đọc ảnh hôm nay)":"")+". Kiểm tra và sửa lại các ô trong bảng (bấm vào ô để sửa) rồi bấm \"Lưu vào hệ thống\".","ok"); return; }
        var f=files[i++]; msg("Đang đọc ảnh "+i+"/"+files.length+"… (khoảng 10–30 giây)");
        shrink(f).then(function(b64){ return fetch(SV2,{method:"POST",credentials:"omit",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"docanh",phone:L.phone,duan:K,low:!!LOW[K],img:{mime:"image/jpeg",data:b64}})}).then(function(r){return r.json();}); })
         .then(function(r){ if(!r||!r.ok){ msg((r&&r.msg)||"Không đọc được ảnh.","err"); return; } left=r.con; var U=fromAI(r.rows||[]); tot+=mergeIn(U); next(); })
         .catch(function(e){ msg("Không gửi được ảnh: "+(e&&e.message||"kiểm tra mạng")+".","err"); }); })(); };
    var XL=null; function loadXL(cb){ if(window.XLSX) return cb(window.XLSX); var sc=document.createElement("script"); sc.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; sc.onload=function(){cb(window.XLSX);}; sc.onerror=function(){msg("Không tải được bộ đọc Excel, kiểm tra mạng rồi thử lại.","err");}; document.head.appendChild(sc); }
    $("#uq-fileinp").onchange=function(){ var file=this.files&&this.files[0]; this.value=""; if(!file) return; msg("Đang đọc file "+file.name+"…");
      loadXL(function(X){ var rd=new FileReader(); rd.onload=function(){ try{
        var wb=X.read(new Uint8Array(rd.result),{type:"array",cellStyles:true,cellDates:true}); var res=[];
        wb.SheetNames.forEach(function(nm){ var r=UQP.parse(UQP.fromSheet(X,wb.Sheets[nm]),!!LOW[K]); if(r.ok&&r.u.length) res.push({n:nm,r:r}); });
        if(!res.length){ msg("Không tìm thấy bảng quỹ căn nào trong file (cần có cột mã căn).","err"); return; }
        var box=$("#uq-sheets"); box.innerHTML='<div style="margin-top:10px;border:1px solid #e3e8ee;border-radius:10px;padding:10px 12px"><b style="font-size:13.5px">File '+E(file.name)+' – chọn sheet cần lấy</b><p class="uq-note" style="margin:4px 0 8px">Sheet sau ghi đè thông tin căn trùng mã ở sheet trước. Bỏ chọn các sheet cũ (giỏ hàng cũ, minigame…) nếu không cần.</p>'
          +res.map(function(x,i){ var st={}; x.r.u.forEach(function(u){ if(u.st) st[u.st]=(st[u.st]||0)+1; }); var info=Object.keys(st).map(function(k){return k+" "+st[k];}).join(", ");
            var cols=Object.keys(x.r.u[0]||{}).filter(function(k){return k!=="c";}).map(label).slice(0,7).join(", ");
            return '<label style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-top:1px solid #f0f3f6"><input type="checkbox" data-i="'+i+'"'+(x.r.main?' checked':'')+' style="margin-top:3px"><span><b>'+E(x.n)+'</b> – '+x.r.u.length+' căn'+(info?' ('+E(info)+')':'')+(x.r.main?'':' <i style="color:#8a6d1e">bảng phụ</i>')+'<br><small class="uq-note">Cột: '+E(cols)+'</small></span></label>'; }).join("")
          +'<div class="uq-row" style="margin-top:8px"><button type="button" class="pri" id="uq-takesheets">Lấy dữ liệu các sheet đã chọn</button></div></div>';
        $("#uq-takesheets").onclick=function(){ var n=0; box.querySelectorAll("input[data-i]").forEach(function(c){ if(c.checked) n+=mergeIn(res[+c.getAttribute("data-i")].r.u); }); box.innerHTML=""; msg("Đã lấy "+list.length+" căn từ file. Kiểm tra bảng rồi bấm \"Lưu vào hệ thống\".","ok"); };
        msg("Đã đọc file: "+res.length+" sheet có quỹ căn. Chọn sheet rồi bấm \"Lấy dữ liệu\".","ok");
      }catch(e){ msg("Không đọc được file này: "+(e&&e.message||e),"err"); } }; rd.readAsArrayBuffer(file); }); };
    $("#uq-clear").onclick=function(){list=[]; draw(); msg("");};
    $("#uq-save").onclick=function(){var L=lic(); if(!L.phone){msg("Cần kích hoạt ứng dụng bằng số điện thoại trước.","err"); return;}
      var pv=$("#uq-paste"); if(!$("[data-p=paste]").hidden&&pv.value.trim()){ $("#uq-parse").click(); pv.value=""; }
      var c0=$("#uq-f [data-k=c]"); if(c0&&c0.value.trim()) takeForm(true);
      if(!list.length){msg("Chưa có căn nào: nhập mã căn hoặc dán bảng trước.","err"); return;}
      var btn=this; btn.disabled=true; var todo=list.slice(), done=0, usePost=true;
      function next(){ if(!todo.length){ msg("Đã lưu "+done+" căn. Ứng dụng đã cập nhật quỹ căn mới.","ok"); btn.disabled=false; var m={}; cached().forEach(function(u){m[u.c]=u;}); list.forEach(function(u){var x={}; for(var k in u) x[k]=u[k]; x.t=new Date().toLocaleString("vi-VN"); m[u.c]=x;}); cache(Object.keys(m).map(function(k){return m[k];})); list=[]; draw(); setTimeout(refresh,3000); return; }
        var part=[], len=0, lim=usePost?150:15, cap=usePost?200000:1300; while(todo.length&&part.length<lim){var s=JSON.stringify(todo[0]); if(part.length&&len+s.length>cap) break; part.push(todo.shift()); len+=s.length;}
        msg("Đang lưu… "+done+"/"+list.length);
        (usePost?fetch(SV2,{method:"POST",credentials:"omit",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"nhapquy",phone:L.phone,duan:K,d:part})}).then(function(r){return r.json();}).catch(function(){usePost=false; return jget({action:"nhapquy",phone:L.phone,duan:K,d:JSON.stringify(part)});}):jget({action:"nhapquy",phone:L.phone,duan:K,d:JSON.stringify(part)})).then(function(r){ if(!r||!r.ok){ msg((r&&r.msg)||"Chưa lưu được, thử lại sau.","err"); btn.disabled=false; return; } done+=part.length; next(); })
         .catch(function(){ msg("Không kết nối được máy chủ. Kiểm tra mạng rồi bấm lưu lại.","err"); btn.disabled=false; });}
      next();};
    form(); draw();
  }
  function put(){
    if(!document.getElementById("log")) return;
    var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
    var b=document.createElement("button"); b.type="button"; b.className="uq-btn"; b.textContent="＋ Nhập quỹ căn mới"; b.onclick=open;
    function place(){var bar=document.querySelector(".gh-bar"); if(bar&&b.parentNode!==bar){bar.appendChild(b); return true;} return false;}
    if(!place()){ document.body.appendChild(b); b.style.cssText="position:fixed;right:12px;top:calc(56px + env(safe-area-inset-top));z-index:61"; var n=0, iv=setInterval(function(){ if(place()||++n>20){ clearInterval(iv); b.style.cssText=""; } },300); }
    refresh(); setInterval(refresh,10*60*1000);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",put); else put();
})();

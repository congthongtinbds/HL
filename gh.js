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
  var css="body.gh-pad{padding-top:calc(44px + env(safe-area-inset-top))!important}.gh-bar{position:absolute;left:10px;right:10px;top:calc(8px + env(safe-area-inset-top));z-index:60;display:flex;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:8px;align-items:center;pointer-events:none;padding-bottom:4px}.gh-bar::-webkit-scrollbar{display:none}.gh-bar>*{flex:none;white-space:nowrap}@media (max-width:480px){.gh-bar{gap:6px}.gh-bar .gh-home,.gh-bar .ptg-fab,.gh-bar .xp-fab{padding:7px 10px!important;font-size:12.5px!important}}.gh-bar>*{pointer-events:auto}.gh-bar .ptg-fab,.gh-bar .xp-fab{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;padding:7px 13px!important;font:600 13.5px system-ui,-apple-system,'Segoe UI',sans-serif!important;box-shadow:0 4px 14px rgba(0,0,0,.2)!important;margin:0!important}.gh-bar [hidden]{display:none!important}.gh-home{position:static;display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:999px;background:#0e4f4b;color:#fff;text-decoration:none;font:600 13.5px system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.2)}.gh-home:hover{background:#17736d}@media print{.gh-home,.gh-bar{display:none}body.gh-pad{padding-top:0!important}}";
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

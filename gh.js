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
  kichHoat:function(phone,device){return jsonp({phone:phone,device:device});},
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
  var css=".gh-home{position:fixed;left:12px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:39;display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:999px;background:#0e4f4b;color:#fff;text-decoration:none;font:600 13.5px system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.2)}.gh-home:hover{background:#17736d}@media print{.gh-home{display:none}}";
  function put(){
    if(document.querySelector(".gh-home")) return;
    var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
    var a=document.createElement("a"); a.className="gh-home"; a.href="./"; a.innerHTML="&#8592; Các dự án"; a.title="Về trang chọn dự án";
    document.body.appendChild(a);
  }
  if(document.body) put(); else document.addEventListener("DOMContentLoaded",put);
})();

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
  var css="body.gh-pad{padding-top:calc(44px + env(safe-area-inset-top))!important}.gh-home{position:fixed;left:10px;top:calc(8px + env(safe-area-inset-top));z-index:60;display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:999px;background:#0e4f4b;color:#fff;text-decoration:none;font:600 13.5px system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.2)}.gh-home:hover{background:#17736d}@media print{.gh-home{display:none}body.gh-pad{padding-top:0!important}}";
  function put(){
    if(document.querySelector(".gh-home")) return;
    var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
    var a=document.createElement("a"); a.className="gh-home"; a.href="./"; a.innerHTML="&#8592; Các dự án"; a.title="Về trang chọn dự án"; document.body.classList.add("gh-pad");
    document.body.appendChild(a);
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
  }
  var st=document.createElement("style");
  st.textContent=".gh-free{display:block;margin:2px 0 4px;padding:10px 12px;border-radius:10px;background:#e6f4ef;border:1px solid #9fd0bf;color:#0b4a3f;font-weight:700;font-size:16.5px;line-height:1.4;text-align:center}.gh-free-sub{display:block;font-size:13px;color:#5d7270}#gp::placeholder{color:#7d918e;font-size:15px;letter-spacing:0}";
  (document.head||document.documentElement).appendChild(st);
  if(document.readyState!=="loading") fix(); else document.addEventListener("DOMContentLoaded",fix);
})();

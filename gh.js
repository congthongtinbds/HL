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
  var app=(document.title||"").replace(/\s*Hỏi Đáp\s*$/,"").trim()||location.pathname.split("/").pop();
  function add(q){q=String(q||"").replace(/\s+/g," ").trim(); if(!q) return; var a=load(); a.push([Date.now(),app,q.slice(0,300)]); save(a); if(a.length>=5) flush();}
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

/* ============================================================================
   Deus Intus · Self-Mastery Toolkit — SHARED TOOL SHELL
   tool-shell.js  ·  reusable mechanics as the global `DI` namespace
   Load with <script src="../../00_shared/js/tool-shell.js"></script> BEFORE the
   tool's inline <script>. Tool-specific generation/scoring logic stays inline.

   Provides:
     DI.$ / DI.$$              query helpers
     DI.show(id)              switch active .view, scroll top
     DI.wireNav(onValidate)   wire [data-go]/[data-validate] buttons
     DI.singleSelect(group)   radio-style .opt group; returns selected data-v
     DI.multiSelect(group,max) checkbox-style .opt group (optional max)
     DI.selected(group)       current single value
     DI.selectedAll(group)    array of values
     DI.flash(el)             aqua validation flash
     DI.counter(inputSel,outSel,max)  live char counter
     DI.chips(groupSel,targetSel)     click-to-fill chip group
     DI.store(key,obj)/DI.load(key)/DI.clear(key)  localStorage JSON
     DI.print()               window.print()
     DI.fmtDate(v)            long en-GB date from yyyy-mm-dd
     DI.tomorrow()            yyyy-mm-dd for tomorrow
     DI.card(canvasSel)       returns a ShareCard helper (canvas, no SVG)
     DI.download(name,dataURL)  trigger a download
   No SVG anywhere. Share cards render on <canvas>.
   ============================================================================ */
"use strict";
(function(global){
  const $  = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];

  function show(id){
    $$(".view").forEach(v=>v.classList.remove("active"));
    const el=$("#"+id); if(el) el.classList.add("active");
    window.scrollTo(0,0);
  }

  function wireNav(onValidate){
    $$("[data-go]").forEach(b=>{
      b.addEventListener("click",()=>{
        const step=b.dataset.validate;
        if(step && typeof onValidate==="function" && !onValidate(step)) return;
        show(b.dataset.go);
      });
    });
  }

  function singleSelect(group){
    $$("#"+group+" .opt").forEach(o=>{
      o.addEventListener("click",()=>{
        $$("#"+group+" .opt").forEach(x=>x.classList.remove("sel"));
        o.classList.add("sel");
        o.dispatchEvent(new CustomEvent("di:select",{bubbles:true,detail:o.dataset.v}));
      });
    });
  }

  function multiSelect(group,maxFn){
    $$("#"+group+" .opt").forEach(o=>{
      o.addEventListener("click",()=>{
        const max = typeof maxFn==="function" ? maxFn() : maxFn;
        if(!o.classList.contains("sel") && max && selectedAll(group).length>=max){
          alert("You can choose at most "+max+" here."); return;
        }
        o.classList.toggle("sel");
        o.dispatchEvent(new CustomEvent("di:select",{bubbles:true,detail:selectedAll(group)}));
      });
    });
  }

  const selected    = g => { const e=$("#"+g+" .opt.sel"); return e?e.dataset.v:null; };
  const selectedAll = g => $$("#"+g+" .opt.sel").map(e=>e.dataset.v);

  function flash(el){
    if(!el) return;
    el.style.borderColor="var(--di-aqua)";
    el.scrollIntoView({block:"center"});
    setTimeout(()=>el.style.borderColor="",1200);
  }

  function counter(inputSel,outSel,max){
    const i=$(inputSel), o=$(outSel); if(!i||!o) return;
    const upd=()=>o.textContent=i.value.length+"/"+max;
    i.addEventListener("input",upd); upd();
  }

  function chips(groupSel,targetSel){
    const t=$(targetSel); if(!t) return;
    $$(groupSel+" .chip").forEach(c=>c.addEventListener("click",()=>{ t.value=c.textContent.trim(); }));
  }

  const store = (k,obj)=>localStorage.setItem(k,JSON.stringify(obj));
  const load  = k => { try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } };
  const clear = k => localStorage.removeItem(k);

  const print = ()=>window.print();

  function fmtDate(v){
    if(!v) return "";
    const d=new Date(v+"T00:00:00");
    return d.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
  }
  function tomorrow(){ const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().split("T")[0]; }

  function download(name,dataURL){
    const a=document.createElement("a"); a.download=name; a.href=dataURL; a.click();
  }

  /* ---- ShareCard: canvas helper (1080x1350), no SVG ---- */
  function card(canvasSel){
    const c=$(canvasSel), x=c.getContext("2d");
    const W=c.width, H=c.height;
    const P={black:"#050A12",navy:"#0B213A",gold:"#C9A227",goldSoft:"#D7C38A",
             aqua:"#84D7D2",ivory:"#F7F4EE"};
    const api={
      W,H,x,P,
      bg(color){ x.fillStyle=color||P.navy; x.fillRect(0,0,W,H); return api; },
      flame(cx,cy,r){ // gold+aqua gradient teardrop, no svg
        const g=x.createRadialGradient(cx,cy,4,cx,cy,r);
        g.addColorStop(0,P.aqua); g.addColorStop(1,"rgba(132,215,210,0)");
        x.fillStyle=g; x.beginPath(); x.ellipse(cx,cy,r*0.75,r,0,0,7); x.fill(); return api;
      },
      circle(cx,cy,r,color,lw){ x.strokeStyle=color||"rgba(201,162,39,0.7)"; x.lineWidth=lw||2;
        x.beginPath(); x.arc(cx,cy,r,0,7); x.stroke(); return api; },
      text(t,cx,cy,font,color,align){ x.fillStyle=color||P.ivory; x.font=font; x.textAlign=align||"center";
        x.fillText(t,cx,cy); return api; },
      wrap(t,cx,cy,maxW,lh,font,color){ x.font=font; x.fillStyle=color||P.ivory; x.textAlign="center";
        const words=(t||"").split(" "); let line=""; const lines=[];
        words.forEach(w=>{ const t2=line?line+" "+w:w; if(x.measureText(t2).width>maxW){ lines.push(line); line=w; } else line=t2; });
        if(line) lines.push(line);
        const start=cy-((lines.length-1)*lh)/2;
        lines.forEach((l,i)=>x.fillText(l,cx,start+i*lh)); return api;
      },
      toURL(){ return c.toDataURL("image/png"); }
    };
    return api;
  }

  global.DI={ $,$$,show,wireNav,singleSelect,multiSelect,selected,selectedAll,
    flash,counter,chips,store,load,clear,print,fmtDate,tomorrow,download,card };
})(window);

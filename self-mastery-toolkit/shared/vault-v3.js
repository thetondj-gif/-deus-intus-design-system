/* Deus Intus · Vault v3 — persistent history, pattern detection, cross-tool intelligence.
   Include after tool logic. Tools call DIVault.record(tool, entry) after generate(),
   and DIVault.renderPanel(el, tool) to draw the history section. */
(function(){
  "use strict";
  const KEY = "di.vault.v3";
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
  function save(v){ localStorage.setItem(KEY, JSON.stringify(v)); }
  function fmt(ts){ return new Date(ts).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); }

  const DIVault = {
    record(tool, entry){
      const v = load();
      v[tool] = v[tool] || [];
      entry.ts = Date.now();
      v[tool].push(entry);
      if(v[tool].length > 52) v[tool] = v[tool].slice(-52);
      save(v);
    },
    history(tool){ return (load()[tool] || []).slice().reverse(); },

    /* recurring pattern detection: most frequent value of a field across entries */
    pattern(tool, field, min){
      const h = load()[tool] || [];
      const counts = {};
      h.forEach(e => { const val = e[field]; if(val) counts[val] = (counts[val]||0)+1; });
      let best = null, n = 0;
      Object.keys(counts).forEach(k => { if(counts[k] > n){ best = k; n = counts[k]; } });
      return (n >= (min||2)) ? { value: best, count: n, total: h.length } : null;
    },

    /* week-over-week deltas for weekly review scores */
    trend(tool, field, limit){
      const h = load()[tool] || [];
      return h.slice(-(limit||8)).map(e => ({ ts: e.ts, val: +e[field] || 0 }));
    },

    crossNotes(currentTool){
      const v = load(); const notes = [];
      if(currentTool !== "mr" && v.mr && v.mr.length){
        const last = v.mr[v.mr.length-1];
        notes.push("Morning Ritual \u00B7 last sequence: " + (last.template||"") + " \u2014 \u201C" + (last.phrase||"") + "\u201D");
      }
      if(currentTool !== "bb" && v.bb && v.bb.length){
        const last = v.bb[v.bb.length-1];
        notes.push("Boundary held \u00B7 " + (last.context_label||"") + " \u2014 " + fmt(last.ts));
      }
      if(currentTool !== "wr" && v.wr && v.wr.length){
        const last = v.wr[v.wr.length-1];
        notes.push("Last weekly score \u00B7 " + last.score + " (" + (last.band||"") + ")");
      }
      return notes;
    },

    renderPanel(el, tool, opts){
      opts = opts || {};
      const h = this.history(tool);
      let html = '<h3>The Vault</h3><p class="v-sub">Private to this device. Nothing leaves it.</p>';
      if(!h.length){
        html += '<div class="v-item"><div class="v-main">Your saved outputs will gather here \u2014 every sequence, boundary and score, kept.</div></div>';
      } else {
        if(tool === "wr" && h.length >= 2){
          const t = this.trend(tool, "score", 8);
          const max = Math.max.apply(null, t.map(x=>x.val).concat([1]));
          html += '<div class="v3-trend">' + t.map(function(x,i){
            return '<i style="height:' + Math.max(8, Math.round(x.val/max*64)) + 'px" class="' + (i===t.length-1?"hi":"") + '"></i>';
          }).join("") + '</div><div class="v3-trend-cap">Week-over-week \u00B7 last ' + t.length + ' scores</div>';
          const d = t[t.length-1].val - t[t.length-2].val;
          html += '<div class="v-item"><div class="v-main">This week ' + (d>=0?"+":"") + d + ' against last week.</div></div>';
        }
        if(opts.patternField){
          const p = this.pattern(tool, opts.patternField, 2);
          if(p) html += '<div class="v-pattern">' + (opts.patternLabel||"Recurring pattern") + ': \u201C' + p.value.replace(/_/g," ") + '\u201D \u2014 named in ' + p.count + ' of ' + p.total + ' entries. Patterns repeat until they are commanded.</div>';
        }
        h.slice(0,6).forEach(function(e){
          html += '<div class="v-item"><div class="v-date">' + fmt(e.ts) + '</div><div class="v-main">' + (e.summary||"") + '</div>' + (e.score!=null?'<div class="v-score">' + e.score + '</div>':"") + '</div>';
        });
      }
      const cross = this.crossNotes(tool);
      if(cross.length) html += '<div class="v-cross">' + cross.join(" &nbsp;\u00B7&nbsp; ") + '</div>';
      el.innerHTML = html;
    }
  };
  window.DIVault = DIVault;
})();

/* ============================================================================
   Deus Intus · V3 shared runtime — analytics, privacy, data control
   Load BEFORE each tool's inline <script> (after tool-shell.js).
   - DI.track(event, data): fires dataLayer push + console (no-op if no endpoint)
   - DI.clearAllData(): removes every Deus Intus namespaced key on this device
   - DI.hasSavedData(): true if any V3 key holds data
   No API keys, no network calls unless DI.ANALYTICS_ENDPOINT is set (server-side).
   ============================================================================ */
(function(global){
  "use strict";

  // Namespaced V3 storage keys (handoff §8)
  var V3_KEYS = [
    "deus_intus_morning_v3",
    "deus_intus_boundary_v3",
    "deus_intus_weekly_v3",
    "deus_intus_vault_v3",
    "di.vault.v3"
  ];
  // Legacy v1 keys also cleared for a clean slate
  var LEGACY_KEYS = [
    "di.mr.sequence_v1",
    "di.bb.card_v1",
    "di.wr.card_latest",
    "di.wr.history"
  ];

  function safeGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }

  function track(event, data){
    data = data || {};
    var payload = Object.assign({
      event: event,
      edition: "v3",
      ts: Date.now(),
      path: location.pathname.split("https://raw.githack.com/thetondj-gif/-deus-intus-design-system/website-preview-site/").pop(),
      page: location.pathname.split("https://raw.githack.com/thetondj-gif/-deus-intus-design-system/website-preview-site/").pop(),
      device: (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop"),
      referrer: document.referrer || "",
      utm_source: new URLSearchParams(location.search).get("utm_source") || "",
      utm_medium: new URLSearchParams(location.search).get("utm_medium") || "",
      utm_campaign: new URLSearchParams(location.search).get("utm_campaign") || ""
    }, data);

    // 1) dataLayer (GTM / GA4 / any tag manager)
    try { (window.dataLayer = window.dataLayer || []).push(payload); } catch(e){}
    // 2) optional server endpoint (set DI.ANALYTICS_ENDPOINT to a Cloudflare Worker / n8n)
    if (global.DI && global.DI.ANALYTICS_ENDPOINT) {
      try {
        navigator.sendBeacon(global.DI.ANALYTICS_ENDPOINT, new Blob([JSON.stringify(payload)], {type:"application/json"}));
      } catch(e){}
    }
    // 3) dev visibility
    if (global.DI && global.DI.DEBUG) console.log("[DI track]", payload);
  }

  function clearAllData(){
    V3_KEYS.concat(LEGACY_KEYS).forEach(function(k){ try { localStorage.removeItem(k); } catch(e){} });
  }

  function hasSavedData(){
    return V3_KEYS.concat(LEGACY_KEYS).some(function(k){ return !!safeGet(k); });
  }

  // Migrate legacy v1 data into the V3 namespaced keys on first run (non-destructive read)
  function migrateIfNeeded(){
    try {
      if (!safeGet("deus_intus_morning_v3") && safeGet("di.mr.sequence_v1"))
        localStorage.setItem("deus_intus_morning_v3", localStorage.getItem("di.mr.sequence_v1"));
      if (!safeGet("deus_intus_boundary_v3") && safeGet("di.bb.card_v1"))
        localStorage.setItem("deus_intus_boundary_v3", localStorage.getItem("di.bb.card_v1"));
      if (!safeGet("deus_intus_weekly_v3") && safeGet("di.wr.card_latest"))
        localStorage.setItem("deus_intus_weekly_v3", localStorage.getItem("di.wr.card_latest"));
    } catch(e){}
  }

  global.DI = global.DI || {};
  global.DI.track = track;
  global.DI.clearAllData = clearAllData;
  global.DI.hasSavedData = hasSavedData;
  global.DI.migrateIfNeeded = migrateIfNeeded;

  // Auto: returning-user detection + migration on load
  migrateIfNeeded();
  document.addEventListener("DOMContentLoaded", function(){
    if (hasSavedData()) track("returning_user_detected", {});
  });
})(window);

/**
 * EndoPima — backend adapter example (Supabase REST / PostgREST)
 * ==============================================================
 * This file documents how the prototype's mock API layer maps to a real
 * backend. It uses plain `fetch` against Supabase's REST endpoint, so NO
 * SDK or CDN is required — the exact same pattern is already implemented
 * inside index.html (see `Cloud` service), and activates when
 * SUPABASE_CONFIG.url and .anonKey are filled in.
 *
 * Offline-first design (why writes go local first):
 *   1. UI reads/writes localStorage instantly (works offline, on feature
 *      phones, in low connectivity — the Kenya reality).
 *   2. A background push mirrors the record to Supabase when online.
 *   3. On app start, a pull refreshes local cache from the cloud.
 *
 * STATUS: NOT CONNECTED until you add keys. The prototype labels itself
 * "DEMO — on-device storage" in the Architecture card until then.
 */

const SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT.supabase.co',   // <- your project URL
  anonKey: 'YOUR-ANON-KEY'                   // <- anon (public) key
};

const DEVICE_ID = Store.get('ep_device_id', null) || (() => {
  const id = 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  Store.set('ep_device_id', id);
  return id;
})();

const Cloud = {
  enabled: !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && !SUPABASE_CONFIG.url.includes('YOUR-')),

  async _req(table, method, body, query) {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${table}${query ? '?' + query : ''}`;
    const res = await fetch(url, {
      method,
      headers: {
        apikey: SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`supabase ${table} ${res.status}`);
    return res.json();
  },

  /** Upsert one record keyed by device_id. Caller passes {device_id, ...row}. */
  async upsert(table, row) {
    return this._req(table, 'POST', [row], `on_conflict=device_id`);
  },

  /** Read the latest record for this device. */
  async latest(table) {
    const rows = await this._req(table, 'GET', null, `device_id=eq.${DEVICE_ID}&order=updated_at.desc&limit=1`);
    return rows[0] || null;
  }
};

/** Example usage in the app (already wired inside index.html v0.2+):
 *  API.screening.save(r)  ->  Store.set('ep_screening', r)  // instant
 *                          + Cloud.upsert('screenings', {device_id: DEVICE_ID, ...r})
 *                            .catch(()=>{})                  // best-effort
 */

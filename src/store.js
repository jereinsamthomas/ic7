import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DEFAULT_SUPABASE_URL = "https://orxzaxcwgcaombqzvguk.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_vydGxxx7VKaSxghRQ5aoFg_mmNOtBj3";

function getSupabaseConfig() {
  let url = '';
  let key = '';
  try {
    url = localStorage.getItem('ic7_supabase_url') || '';
    key = localStorage.getItem('ic7_supabase_key') || '';
  } catch (e) {}

  if (!url && typeof import.meta !== 'undefined' && import.meta.env) {
    url = import.meta.env.VITE_SUPABASE_URL || '';
    key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  }

  if (!url) url = DEFAULT_SUPABASE_URL;
  if (!key) key = DEFAULT_SUPABASE_KEY;

  return { url: url.trim(), key: key.trim() };
}

let supabase = null;
const dbCache = {};
let initialized = false;
let isCloudConnected = false;
let realtimeSubscribed = false;

function initClient() {
  const { url, key } = getSupabaseConfig();
  if (url && key && !url.includes('example') && !url.includes('invalid')) {
    try {
      supabase = createClient(url, key);
    } catch (e) {
      console.warn("Failed to initialize Supabase client:", e);
      supabase = null;
    }
  } else {
    supabase = null;
  }
}

initClient();

// Cross-tab local synchronization fallback
try {
  window.addEventListener('storage', (e) => {
    if (e.key && (e.key.startsWith('ic7_') || e.key.startsWith('mt_'))) {
      try {
        const val = JSON.parse(e.newValue);
        dbCache[e.key] = val;
        window.dispatchEvent(new CustomEvent('ic7_store_updated', { detail: { key: e.key, value: val } }));
      } catch (err) {}
    }
  });
} catch (e) {}

export const Store = {
  get isCloudConnected() { return isCloudConnected; },

  async init() {
    if (initialized) return;
    initClient();
    
    // Always load local cache first so UI renders instantly
    this.loadLocalCache();

    if (supabase) {
      try {
        const { data, error } = await supabase.from('ic7_store').select('*');
        if (!error && data) {
          isCloudConnected = true;
          data.forEach(row => {
            dbCache[row.key] = row.value;
            try { localStorage.setItem(row.key, JSON.stringify(row.value)); } catch (e) {}
          });
          this.setupRealtime();
        } else {
          console.warn("Supabase fetch notice (using local cache):", error);
        }
      } catch (err) {
        console.warn("Supabase connection notice (using local cache):", err);
      }
    }
    initialized = true;
  },

  setupRealtime() {
    if (!supabase || realtimeSubscribed) return;
    realtimeSubscribed = true;
    try {
      supabase.channel('ic7_store_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'ic7_store' }, payload => {
          if (payload.new && payload.new.key) {
            dbCache[payload.new.key] = payload.new.value;
            try { localStorage.setItem(payload.new.key, JSON.stringify(payload.new.value)); } catch (e) {}
            window.dispatchEvent(new CustomEvent('ic7_store_updated', { detail: payload.new }));
          } else if (payload.eventType === 'DELETE' && payload.old && payload.old.key) {
            delete dbCache[payload.old.key];
            try { localStorage.removeItem(payload.old.key); } catch (e) {}
            window.dispatchEvent(new CustomEvent('ic7_store_updated', { detail: payload.old }));
          }
        })
        .subscribe();
    } catch (e) {
      console.warn("Supabase realtime subscription notice:", e);
    }

    // Periodic poll every 15 seconds to guarantee background sync across all browsers
    setInterval(async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('ic7_store').select('*');
        if (!error && data) {
          let hasChanges = false;
          data.forEach(row => {
            if (JSON.stringify(dbCache[row.key]) !== JSON.stringify(row.value)) {
              dbCache[row.key] = row.value;
              try { localStorage.setItem(row.key, JSON.stringify(row.value)); } catch (e) {}
              hasChanges = true;
            }
          });
          if (hasChanges) {
            window.dispatchEvent(new CustomEvent('ic7_store_updated', { detail: {} }));
          }
        }
      } catch (e) {}
    }, 15000);
  },

  loadLocalCache() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('ic7_') || k.startsWith('mt_'))) {
          try { dbCache[k] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
        }
      }
    } catch (e) {}
  },

  get(key, fallback) {
    if (key in dbCache) return dbCache[key];
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },

  async set(key, value) {
    dbCache[key] = value;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}

    if (supabase) {
      try {
        const { error } = await supabase
          .from('ic7_store')
          .upsert({ key, value }, { onConflict: 'key' });
        if (error) console.error("Supabase upsert error:", error);
        else isCloudConnected = true;
      } catch (err) {
        console.error("Supabase upsert failed:", err);
      }
    }
    window.dispatchEvent(new CustomEvent('ic7_store_updated', { detail: { key, value } }));
    return true;
  },

  async remove(key) {
    delete dbCache[key];
    try { localStorage.removeItem(key); } catch (e) {}
    if (supabase) {
      try {
        await supabase.from('ic7_store').delete().eq('key', key);
      } catch (err) {
        console.error("Supabase delete failed:", err);
      }
    }
    window.dispatchEvent(new CustomEvent('ic7_store_updated', { detail: { key } }));
  },

  async testConnection(url, key) {
    try {
      const testClient = createClient(url, key);
      const { data, error } = await testClient.from('ic7_store').select('*').limit(1);
      if (error && error.code !== 'PGRST116' && !error.message.includes('relation "public.ic7_store" does not exist')) {
        return { success: false, error: error.message };
      }
      if (error && error.message.includes('relation "public.ic7_store" does not exist')) {
        return { success: false, error: 'Table "ic7_store" does not exist in your Supabase database. Please create a table named "ic7_store" with columns "key" (text primary key) and "value" (jsonb).' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  exportJson() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('ic7_') || k.startsWith('mt_'))) {
        try { data[k] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
      }
    }
    return JSON.stringify(data, null, 2);
  },

  async importJson(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      for (const [k, v] of Object.entries(parsed)) {
        await this.set(k, v);
      }
      return { success: true, count: Object.keys(parsed).length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

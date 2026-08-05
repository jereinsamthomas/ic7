import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
  return { url: url.trim(), key: key.trim() };
}

let supabase = null;
const dbCache = {};
let initialized = false;
let isCloudConnected = false;

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
        } else {
          console.warn("Supabase fetch notice (using local cache):", error);
        }
      } catch (err) {
        console.warn("Supabase connection notice (using local cache):", err);
      }
    }
    initialized = true;
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
          .upsert({ key, value });
        if (error) console.error("Supabase upsert error:", error);
        else isCloudConnected = true;
      } catch (err) {
        console.error("Supabase upsert failed:", err);
      }
    }
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

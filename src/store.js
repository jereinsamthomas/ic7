import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const dbCache = {};
let initialized = false;

export const Store = {
  isSupabase: !!supabase,
  
  async init() {
    if (initialized) return;
    if (supabase) {
      try {
        const { data, error } = await supabase.from('ic7_store').select('*');
        if (!error && data) {
          data.forEach(row => {
            dbCache[row.key] = row.value;
          });
        } else {
          console.warn("Supabase fetch error, falling back to localStorage:", error);
        }
      } catch (err) {
        console.warn("Supabase connection failed, falling back to localStorage:", err);
      }
    } else {
      console.info("Supabase credentials not configured. Running in localStorage fallback mode.");
    }
    initialized = true;
  },

  get(key, fallback) {
    if (supabase && initialized) {
      return (key in dbCache) ? dbCache[key] : fallback;
    }
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },

  async set(key, value) {
    if (supabase) {
      dbCache[key] = value;
      try {
        const { error } = await supabase
          .from('ic7_store')
          .upsert({ key, value });
        if (!error) return true;
        console.error("Supabase upsert error:", error);
      } catch (err) {
        console.error("Supabase upsert failed:", err);
      }
    }
    
    // Save to localStorage too as cache/fallback
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  
  async remove(key) {
    if (supabase) {
      delete dbCache[key];
      try {
        await supabase.from('ic7_store').delete().eq('key', key);
      } catch (err) {
        console.error("Supabase delete failed:", err);
      }
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

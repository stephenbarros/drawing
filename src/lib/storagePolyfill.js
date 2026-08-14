// Studio Log was originally built as a Claude.ai artifact, where
// `window.storage` is provided by the host environment. On a normal
// deployed website that API doesn't exist, so this polyfills the same
// shape (get/set/delete/list, all async, all namespaced under one
// prefix) using the browser's own localStorage. Import this once,
// before App renders, and the rest of the app needs no changes.

const PREFIX = "studio-log:";

function readRaw(key) {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key, shared = false) {
      const value = readRaw(key);
      if (value === null) return null;
      return { key, value, shared };
    },

    async set(key, value, shared = false) {
      try {
        localStorage.setItem(PREFIX + key, value);
      } catch (e) {
        console.error("storage.set failed", e);
        return null;
      }
      return { key, value, shared };
    },

    async delete(key, shared = false) {
      const existed = readRaw(key) !== null;
      try {
        localStorage.removeItem(PREFIX + key);
      } catch (e) {
        console.error("storage.delete failed", e);
        return null;
      }
      return { key, deleted: existed, shared };
    },

    async list(prefix = "", shared = false) {
      const keys = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const full = localStorage.key(i);
          if (full && full.startsWith(PREFIX)) {
            const key = full.slice(PREFIX.length);
            if (key.startsWith(prefix)) keys.push(key);
          }
        }
      } catch (e) {
        console.error("storage.list failed", e);
      }
      return { keys, prefix, shared };
    },
  };
}

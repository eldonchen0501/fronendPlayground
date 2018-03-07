/**
 * the app's wrapper around actual localStorage
 * this layer provides safe fallback against environment's that has no localStorage support.
 *
 * In other modules, instead of calling `localStorage` directly,
 * you should import this module and use it instead:
 *
 * import localStorage from '../path/to/this/file';
 * localStorage.setItem('key', value);
 */
let hasStorage;
let exportedLocalStorage;

const { hasOwnProperty } = Object.prototype;
const inMemoryDataStore = {};

// check if current browser supports localStorage
try {
  const uid = new Date();
  const testKey = 'key';
  localStorage.setItem(testKey, uid);
  localStorage.getItem(testKey);
  localStorage.removeItem(testKey);
  hasStorage = true;
} catch (e) {
  hasStorage = false;
}

// if localStorage is not supported, poly-fill it with in-memory object
if (hasStorage) {
  exportedLocalStorage = localStorage;
} else {
  exportedLocalStorage = {
    setItem: (key, value) => {
      inMemoryDataStore[key] = value;
    },

    getItem: key => inMemoryDataStore[key] || null,

    removeItem: (key) => {
      delete inMemoryDataStore[key];
    },

    clear: () => {
      const keys = Object.keys(inMemoryDataStore);

      inMemoryDataStore.each(keys, (key) => {
        if (hasOwnProperty.call(inMemoryDataStore, key)) {
          delete inMemoryDataStore[key];
        }
      });
    },
  };
}

// to avoid mutable exports: do this so that other module can not reassign _localStorage
const immutableExport = exportedLocalStorage;
export default immutableExport;

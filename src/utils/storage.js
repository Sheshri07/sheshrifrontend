// Storage utility to handle iOS Safari private mode issues
const isStorageAvailable = (type) => {
    try {
        const storage = window[type];
        const testKey = '__storage_test__';
        storage.setItem(testKey, 'test');
        storage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};

// Fallback storage using in-memory object when localStorage/sessionStorage is unavailable
class MemoryStorage {
    constructor() {
        this.storage = {};
    }

    getItem(key) {
        return this.storage[key] || null;
    }

    setItem(key, value) {
        this.storage[key] = String(value);
    }

    removeItem(key) {
        delete this.storage[key];
    }

    clear() {
        this.storage = {};
    }
}

// Create safe storage wrappers
const createSafeStorage = (type) => {
    if (isStorageAvailable(type)) {
        return window[type];
    }
    console.warn(`${type} is not available (possibly iOS private mode), using memory fallback`);
    return new MemoryStorage();
};

export const safeLocalStorage = createSafeStorage('localStorage');
export const safeSessionStorage = createSafeStorage('sessionStorage');

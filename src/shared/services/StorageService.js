// STORAGE SERVICE
// Abstraction layer for Chrome Storage API (and localStorage fallback)

export class StorageService {
  constructor() {
    // Check if Chrome storage is available, otherwise use localStorage
    this.useChrome = typeof chrome !== 'undefined' && chrome.storage;
  }

  async get(key) {
    if (this.useChrome) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      });
    } else {
      // Fallback to localStorage for testing
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  }

  async set(key, value) {
    if (this.useChrome) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    } else {
      // Fallback to localStorage for testing
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    }
  }

  async initialize() {
    // Check if storage exists, set defaults if needed
    const companion = await this.get('companion');
    if (!companion) {
      await this.set('companion', {
        id: 25,
        name: 'Pikachu',
        level: 1,
        health: 100,
        maxHealth: 100,
        experience: 0,
        experienceToNext: 100,
        lastFed: Date.now(),
        lastInteraction: Date.now(),
        happiness: 100
      });
    }
  }
}

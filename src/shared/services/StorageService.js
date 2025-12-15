export class StorageService {
  constructor() {
    this.useChrome = typeof chrome !== 'undefined' && chrome.storage;
    this.apiBase = '';
  }

  async get(key) {
    if (key === 'pokemon_collection') {
      try {
        const response = await fetch(`${this.apiBase}/api/pokemon`);
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.log('[StorageService] API not available, using local storage');
      }
    }
    
    if (key === 'companion') {
      try {
        const response = await fetch(`${this.apiBase}/api/companion`);
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.log('[StorageService] API not available, using local storage');
      }
    }

    if (key === 'favorite_pokemon') {
      try {
        const response = await fetch(`${this.apiBase}/api/party`);
        if (response.ok) {
          const data = await response.json();
          if (data.auto_selected) {
            return [];
          }
          return data.party || [];
        }
      } catch (e) {
        console.log('[StorageService] API not available, using local storage');
      }
    }
    
    if (this.useChrome) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      });
    } else {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  }

  async set(key, value) {
    if (key === 'companion') {
      try {
        const response = await fetch(`${this.apiBase}/api/companion`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value)
        });
        if (response.ok) {
          return;
        }
      } catch (e) {
        console.log('[StorageService] API not available, using local storage');
      }
    }
    
    if (this.useChrome) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    }
  }

  async addPokemon(pokemon) {
    try {
      const response = await fetch(`${this.apiBase}/api/pokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pokemon)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.log('[StorageService] API not available for adding pokemon');
    }
    return null;
  }

  async seedTestPokemon() {
    try {
      const response = await fetch(`${this.apiBase}/api/seed`, {
        method: 'POST'
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.log('[StorageService] Could not seed test pokemon');
    }
    return null;
  }

  async initialize() {
    try {
      await this.seedTestPokemon();
    } catch (e) {
      console.log('[StorageService] Initialization skipped');
    }
  }
}

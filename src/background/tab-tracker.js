// Tab Tracker - Monitors browsing activity to trigger Pokemon encounters

export class TabTracker {
  constructor(encounterThreshold = 3) {
    this.encounterThreshold = encounterThreshold; // Number of sites to visit before encounter
    this.visitCount = 0;
    this.lastDomain = null;
    this.onEncounterCallback = null;
    // Bind handler to preserve 'this' context and allow proper removal
    this.boundHandleTabUpdate = this.handleTabUpdate.bind(this);
  }

  /**
   * Start tracking tab activity
   */
  start(onEncounterReady) {
    this.onEncounterCallback = onEncounterReady;
    
    // Remove any existing listener first to prevent duplicates
    this.stop();
    
    // Listen for tab updates (navigation) with bound function
    chrome.tabs.onUpdated.addListener(this.boundHandleTabUpdate);
    
    console.log('[TabTracker] Started tracking with threshold:', this.encounterThreshold);
  }

  /**
   * Handle tab update event
   */
  handleTabUpdate(tabId, changeInfo, tab) {
    // Only count when page finishes loading
    if (changeInfo.status !== 'complete') return;
    if (!tab.url) return;

    // Check if this is a valid domain to count
    const domain = this.extractDomain(tab.url);
    if (!this.isValidDomain(tab.url) || domain === this.lastDomain) {
      return;
    }

    // Count this visit
    this.lastDomain = domain;
    this.visitCount++;
    
    console.log('[TabTracker] Visit counted:', domain, `(${this.visitCount}/${this.encounterThreshold})`);

    // Check if threshold reached
    if (this.visitCount >= this.encounterThreshold) {
      this.triggerEncounter();
    }
  }

  /**
   * Trigger encounter and reset counter
   */
  triggerEncounter() {
    console.log('[TabTracker] Encounter threshold reached! Triggering encounter...');
    this.visitCount = 0;
    
    if (this.onEncounterCallback) {
      this.onEncounterCallback();
    }
  }

  /**
   * Extract domain from URL
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if domain should be counted for encounters
   */
  isValidDomain(url) {
    if (!url) return false;
    
    // Ignore chrome internal pages
    if (url.startsWith('chrome://')) return false;
    if (url.startsWith('chrome-extension://')) return false;
    if (url.startsWith('about:')) return false;
    if (url.startsWith('file://')) return false;
    
    // Ignore Replit dev environment
    if (url.includes('replit.dev')) return false;
    if (url.includes('repl.co')) return false;
    
    // Ignore local development
    if (url.includes('localhost')) return false;
    if (url.includes('127.0.0.1')) return false;
    
    return true;
  }

  /**
   * Get current visit count
   */
  getVisitCount() {
    return this.visitCount;
  }

  /**
   * Reset visit counter
   */
  reset() {
    this.visitCount = 0;
    this.lastDomain = null;
  }

  /**
   * Stop tracking
   */
  stop() {
    if (this.boundHandleTabUpdate) {
      chrome.tabs.onUpdated.removeListener(this.boundHandleTabUpdate);
    }
  }
  
  /**
   * Get website category for encounter biasing
   */
  getCategoryForDomain(domain) {
    // Categorize websites to bias Pokemon encounters
    if (!domain) return 'normal';
    
    const domainLower = domain.toLowerCase();
    
    // Tech/Electric sites
    if (domainLower.includes('github') || domainLower.includes('stackoverflow') || 
        domainLower.includes('hackernews') || domainLower.includes('tech')) {
      return 'electric';
    }
    
    // Social/Psychic sites
    if (domainLower.includes('reddit') || domainLower.includes('twitter') || 
        domainLower.includes('facebook') || domainLower.includes('social')) {
      return 'psychic';
    }
    
    // Shopping/Normal sites
    if (domainLower.includes('amazon') || domainLower.includes('shop') || 
        domainLower.includes('store') || domainLower.includes('buy')) {
      return 'normal';
    }
    
    // News/Flying sites
    if (domainLower.includes('news') || domainLower.includes('cnn') || 
        domainLower.includes('bbc') || domainLower.includes('nytimes')) {
      return 'flying';
    }
    
    // Gaming/Fighting sites
    if (domainLower.includes('game') || domainLower.includes('steam') || 
        domainLower.includes('twitch') || domainLower.includes('ign')) {
      return 'fighting';
    }
    
    // Nature/Grass sites
    if (domainLower.includes('nature') || domainLower.includes('garden') || 
        domainLower.includes('green') || domainLower.includes('eco')) {
      return 'grass';
    }
    
    // Water sites
    if (domainLower.includes('ocean') || domainLower.includes('water') || 
        domainLower.includes('marine') || domainLower.includes('aqua')) {
      return 'water';
    }
    
    return 'normal'; // Default category
  }
}

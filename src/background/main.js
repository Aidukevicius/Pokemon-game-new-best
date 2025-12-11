// Background Service Worker - Main Entry Point
// Coordinates tab tracking and encounter generation

import { TabTracker } from './tab-tracker.js';
import { StorageService } from '../shared/services/StorageService.js';
import { EncounterService } from '../shared/services/EncounterService.js';

const storage = new StorageService();
const encounterService = new EncounterService();
let tabTracker;

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[Background] Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // First time install - set up defaults
    await initializeStorage();
    console.log('[Background] First install - storage initialized');
  }
  
  // Start tracking tabs
  startTabTracking();
});

// Initialize on browser startup
chrome.runtime.onStartup.addListener(() => {
  console.log('[Background] Browser started');
  startTabTracking();
});

/**
 * Initialize default storage values
 */
async function initializeStorage() {
  const defaults = {
    inventory: {
      pokeballs: 5,
      greatballs: 0,
      ultraballs: 0,
      potions: 3,
      superPotions: 0
    },
    pokemonCollection: [],
    pokedex: {},
    playerData: {
      coins: 100,
      totalEncounters: 0,
      totalCaught: 0
    },
    currentEncounter: null,
    encounterQueue: []
  };
  
  // Only set if not already exists
  for (const [key, value] of Object.entries(defaults)) {
    const existing = await storage.get(key);
    if (!existing) {
      await storage.set(key, value);
    }
  }
}

/**
 * Start tab tracking for encounters
 */
function startTabTracking() {
  if (tabTracker) {
    tabTracker.stop();
  }
  
  // Create tab tracker (trigger encounter every 3 page visits)
  tabTracker = new TabTracker(3);
  
  tabTracker.start(async () => {
    console.log('[Background] Encounter triggered!');
    // Get the current tab's domain to determine site category
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      let category = 'normal';
      if (tabs[0]?.url) {
        const domain = tabTracker.extractDomain(tabs[0].url);
        category = tabTracker.getCategoryForDomain(domain);
        console.log('[Background] Site category:', category, 'for domain:', domain);
      }
      await generateAndQueueEncounter(category);
    });
  });
  
  console.log('[Background] Tab tracking started');
}

/**
 * Generate new encounter and queue it
 * @param {string} siteCategory - Website category for encounter biasing
 */
async function generateAndQueueEncounter(siteCategory = 'normal') {
  // Get companion level for proper encounter scaling
  const companionData = await storage.get('companion') || {};
  const companionLevel = companionData.level || 1;
  
  const encounter = encounterService.generateEncounter(siteCategory, companionLevel);
  console.log('[Background] Generated encounter:', encounter.pokemon.name, 'Lv', encounter.level, `(Site: ${siteCategory}, Companion Lv: ${companionLevel})`);
  
  // Add to encounter queue
  const queue = await storage.get('encounterQueue') || [];
  queue.push(encounter);
  await storage.set('encounterQueue', queue);
  
  // Update player stats
  const playerData = await storage.get('playerData') || {};
  playerData.totalEncounters = (playerData.totalEncounters || 0) + 1;
  await storage.set('playerData', playerData);
  
  // Update Pokedex (encountered but not caught)
  const pokedex = await storage.get('pokedex') || {};
  if (!pokedex[encounter.pokemon.id]) {
    pokedex[encounter.pokemon.id] = {
      id: encounter.pokemon.id,
      name: encounter.pokemon.name,
      caught: false,
      timesEncountered: 1,
      timesCaught: 0
    };
  } else {
    pokedex[encounter.pokemon.id].timesEncountered++;
  }
  await storage.set('pokedex', pokedex);
  
  // Update badge to show available encounters
  await updateBadge(queue.length);
  
  // Show notification for rare/legendary Pokemon
  if (encounter.pokemon.rarity === 'rare' || encounter.pokemon.rarity === 'legendary') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icons/icon128.png',
      title: `Wild ${encounter.pokemon.name} appeared!`,
      message: `A ${encounter.pokemon.rarity} Pokemon is waiting! Level ${encounter.level}`,
      priority: 2
    });
  }
}

/**
 * Update extension badge with encounter count
 */
async function updateBadge(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#EF4444' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

/**
 * Clear badge when popup is opened
 */
chrome.action.onClicked.addListener(async () => {
  console.log('[Background] Extension icon clicked');
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEncounterQueue') {
    storage.get('encounterQueue').then(queue => {
      sendResponse({ queue: queue || [] });
    });
    return true; // Async response
  }
  
  if (request.action === 'clearEncounter') {
    storage.get('encounterQueue').then(async (queue) => {
      queue.shift(); // Remove first encounter
      await storage.set('encounterQueue', queue);
      await updateBadge(queue.length);
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log('[Background] Service worker initialized');

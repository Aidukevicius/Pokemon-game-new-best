// POPUP MAIN SCRIPT
// Initialize popup UI and manage screen navigation

import { MainScreen } from './screens/main-screen.js';
import { StorageScreen } from './screens/storage-screen.js';
import { CollectionScreen } from './screens/collection-screen.js';
import { SettingsScreen } from './screens/settings-screen.js';
import { SearchScreen } from './screens/search-screen.js';
import { PokedexScreen } from './screens/pokedex-screen.js';

console.log('[Main] Script loaded');
console.log('[Main] Screens imported');

// Simple implementation for now - just show MainScreen
async function initializeApp() {
  console.log('[Main] Initializing app...');

  try {
    const screensContainer = document.getElementById('screens');
    const tabButtons = document.querySelectorAll('.tab-button');

    console.log('[Main] Found screens container:', screensContainer);
    console.log('[Main] Found tab buttons:', tabButtons.length);

    // Create screen containers
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-screen-container';
    mainContainer.className = 'screen-container';
    screensContainer.appendChild(mainContainer);

    const storageContainer = document.createElement('div');
    storageContainer.id = 'storage-screen-container';
    storageContainer.className = 'screen-container';
    storageContainer.style.display = 'none';
    screensContainer.appendChild(storageContainer);

    const collectionContainer = document.createElement('div');
    collectionContainer.id = 'collection-screen-container';
    collectionContainer.className = 'screen-container';
    collectionContainer.style.display = 'none';
    screensContainer.appendChild(collectionContainer);

    const settingsContainer = document.createElement('div');
    settingsContainer.id = 'settings-screen-container';
    settingsContainer.className = 'screen-container';
    settingsContainer.style.display = 'none';
    screensContainer.appendChild(settingsContainer);

    const searchContainer = document.createElement('div');
    searchContainer.id = 'search-screen-container';
    searchContainer.className = 'screen-container';
    searchContainer.style.display = 'none';
    screensContainer.appendChild(searchContainer);

    const pokedexContainer = document.createElement('div');
    pokedexContainer.id = 'pokedex-screen-container';
    pokedexContainer.className = 'screen-container';
    pokedexContainer.style.display = 'none';
    screensContainer.appendChild(pokedexContainer);

    // Initialize screens
    console.log('[Main] Creating screens...');
    const mainScreen = new MainScreen(mainContainer);
    const storageScreen = new StorageScreen(storageContainer);
    const collectionScreen = new CollectionScreen(collectionContainer);
    const pokedexScreen = new PokedexScreen(pokedexContainer);
    const settingsScreen = new SettingsScreen(settingsContainer);
    const searchScreen = new SearchScreen(searchContainer);

    const screens = {
      main: mainScreen,
      storage: storageScreen,
      pokedex: pokedexScreen,
      collection: collectionScreen,
      settings: settingsScreen,
      search: searchScreen
    };

    console.log('[Main] Initializing MainScreen...');
    await mainScreen.initialize();
    await storageScreen.initialize();
    await collectionScreen.initialize();
    await pokedexScreen.initialize();
    await settingsScreen.initialize();
    await searchScreen.initialize();

    console.log('[Main] Showing MainScreen...');
    mainScreen.show();

    let currentScreen = 'main';

    // Tab click handlers
    console.log('[Main] Setting up tab listeners...');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked tab
        button.classList.add('active');

        // Get tab name
        const tabName = button.dataset.tab;
        console.log('[Main] Tab clicked:', tabName);

        // Hide current screen
        if (screens[currentScreen]) {
          screens[currentScreen].hide();
        }

        // Show selected screen
        if (screens[tabName]) {
          screens[tabName].show();
          currentScreen = tabName;
        } else {
          // Show placeholder for unimplemented screens
          screensContainer.querySelectorAll('[id$="-screen-container"]').forEach(c => c.style.display = 'none');
          mainContainer.style.display = 'block';
          mainContainer.innerHTML = `
            <div class="placeholder-screen snes-container" style="padding: 20px; text-align: center; margin: 10px;">
              <h3>${tabName.charAt(0).toUpperCase() + tabName.slice(1)}</h3>
              <p>Coming soon!</p>
            </div>
          `;
        }
      });
    });

    console.log('[Main] App initialized successfully!');
  } catch (error) {
    console.error('[Main] Error initializing app:', error);
    document.getElementById('screens').innerHTML = `
      <div style="padding: 20px; color: red;">
        <h3>Error loading app</h3>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM already loaded
  initializeApp();
}
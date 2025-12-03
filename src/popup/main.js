// POPUP MAIN SCRIPT
// Initialize popup UI and manage screen navigation

import { MainScreen } from './screens/main-screen.js';
import { StorageScreen } from './screens/storage-screen.js';
import { CollectionScreen } from './screens/collection-screen.js';

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
    screensContainer.appendChild(mainContainer);

    const storageContainer = document.createElement('div');
    storageContainer.id = 'storage-screen-container';
    storageContainer.style.display = 'none';
    screensContainer.appendChild(storageContainer);

    const collectionContainer = document.createElement('div');
    collectionContainer.id = 'collection-screen-container';
    collectionContainer.style.display = 'none';
    screensContainer.appendChild(collectionContainer);

    // Initialize screens
    console.log('[Main] Creating screens...');
    const mainScreen = new MainScreen(mainContainer);
    const storageScreen = new StorageScreen(storageContainer);
    const collectionScreen = new CollectionScreen(collectionContainer);

    const screens = {
      main: mainScreen,
      storage: storageScreen,
      pokedex: collectionScreen
    };

    console.log('[Main] Initializing MainScreen...');
    await mainScreen.initialize();
    await storageScreen.initialize();
    await collectionScreen.initialize();

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
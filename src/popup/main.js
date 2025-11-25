// POPUP MAIN SCRIPT
// Initialize popup UI and manage screen navigation

import { MainScreen } from './screens/main-screen.js';
import { CollectionScreen } from './screens/collection-screen.js';

console.log('[Main] Script loaded');
console.log('[Main] MainScreen imported');
console.log('[Main] CollectionScreen imported');

// Simple implementation for now - just show MainScreen
async function initializeApp() {
  console.log('[Main] Initializing app...');

  try {
    const screensContainer = document.getElementById('screens');
    const tabButtons = document.querySelectorAll('.tab-button');

    console.log('[Main] Found screens container:', screensContainer);
    console.log('[Main] Found tab buttons:', tabButtons.length);

    // Initialize screens
    console.log('[Main] Creating MainScreen...');
    const mainScreen = new MainScreen(screensContainer);

    console.log('[Main] Initializing MainScreen...');
    await mainScreen.initialize();

    console.log('[Main] Creating CollectionScreen...');
    const collectionScreen = new CollectionScreen(screensContainer);

    console.log('[Main] Initializing CollectionScreen...');
    await collectionScreen.initialize();
    collectionScreen.hide();

    console.log('[Main] Showing MainScreen...');
    mainScreen.show();

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

        // Hide all screens
        mainScreen.hide();
        collectionScreen.hide();

        // Show selected screen
        if (tabName === 'main') {
          mainScreen.show();
        } else if (tabName === 'collection') {
          collectionScreen.show();
        } else {
          // Placeholder for other screens
          console.log('[Main] Other screens not implemented yet');
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
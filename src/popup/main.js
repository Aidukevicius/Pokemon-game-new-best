// POPUP MAIN ENTRY POINT
// Main coordinator for tab-based popup UI

console.log('[Main] Script loaded');

import { MainScreen } from './screens/main-screen.js';

console.log('[Main] MainScreen imported');

// Simple implementation for now - just show MainScreen
async function initializeApp() {
  console.log('[Main] Initializing app...');
  
  try {
    const screensContainer = document.getElementById('screens');
    const tabButtons = document.querySelectorAll('.tab-button');

    console.log('[Main] Found screens container:', screensContainer);
    console.log('[Main] Found tab buttons:', tabButtons.length);

    // Initialize main screen
    console.log('[Main] Creating MainScreen...');
    const mainScreen = new MainScreen(screensContainer);
    
    console.log('[Main] Initializing MainScreen...');
    await mainScreen.initialize();
    
    console.log('[Main] Showing MainScreen...');
    mainScreen.show();

    console.log('[Main] Setting up tab listeners...');
    // Tab switching logic
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked tab
        button.classList.add('active');

        // For now, only main screen is implemented
        const tabId = button.dataset.tab;
        if (tabId === 'main') {
          mainScreen.show();
        } else {
          // Other screens not implemented yet
          screensContainer.innerHTML = `
            <div class="snes-container" style="margin: 20px; text-align: center;">
              <h2 style="font-size: 12px; margin-bottom: 12px;">${button.querySelector('.tab-label').textContent}</h2>
              <p style="font-size: 8px;">Coming soon! 🚧</p>
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

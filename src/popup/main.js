// POPUP MAIN ENTRY POINT PLACEHOLDER
// Main coordinator for tab-based popup UI (loaded as ES module)

// WHAT GOES HERE:

/*
IMPORTS:
import { TabsNavigation } from './tabs-navigation.js';
import { MainScreen } from './screens/main-screen.js';
import { SearchScreen } from './screens/search-screen.js';
import { PokedexScreen } from './screens/pokedex-screen.js';
import { StorageScreen } from './screens/storage-screen.js';
import { ShopScreen } from './screens/shop-screen.js';
import { SettingsScreen } from './screens/settings-screen.js';
import { StorageService } from '../shared/services/StorageService.js';

APP STRUCTURE:
The popup has 6 screens, only one visible at a time:
1. Main (catch) - Default
2. Search - Find specific Pokemon
3. Pokedex - View collection
4. Storage - Manage items
5. Shop - Buy items and trade
6. Settings - Preferences

Bottom tabs switch between screens

INITIALIZATION:

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Get container elements
  const appContainer = document.getElementById('app');
  const screensContainer = document.getElementById('screens');
  const tabsContainer = document.getElementById('tabs');
  
  // 2. Initialize StorageService
  const storageService = new StorageService();
  await storageService.initialize();
  
  // 3. Create all screen instances
  const screens = {
    main: new MainScreen(screensContainer),
    search: new SearchScreen(screensContainer),
    pokedex: new PokedexScreen(screensContainer),
    storage: new StorageScreen(screensContainer),
    shop: new ShopScreen(screensContainer),
    settings: new SettingsScreen(screensContainer)
  };
  
  // 4. Initialize each screen
  for (const screen of Object.values(screens)) {
    await screen.initialize();
    screen.hide(); // Hide all initially
  }
  
  // 5. Create tabs navigation
  const tabs = new TabsNavigation(tabsContainer);
  tabs.render();
  
  // 6. Show default screen (main)
  screens.main.show();
  tabs.setActiveTab('main');
  
  // 7. Listen for tab changes
  tabs.on('tabchange', (event) => {
    // Hide all screens
    Object.values(screens).forEach(screen => screen.hide());
    
    // Show selected screen
    const selectedScreen = screens[event.tabId];
    if (selectedScreen) {
      selectedScreen.show();
    }
  });
});

SCREEN COORDINATION:

switchScreen(fromScreenId, toScreenId)
- Hide current screen with fade-out animation
- Show new screen with fade-in animation
- Update tab navigation active state
- Maybe play screen transition sound

updateAllScreens(playerData)
- Called when player data changes
- Update all screens with new data
- Each screen refreshes its display

EVENT FLOW EXAMPLE:
1. User catches Pokemon in MainScreen
2. MainScreen emits 'pokemonCaught' event
3. main.js listens and:
   - Updates PlayerData in storage
   - Calls updateAllScreens()
   - PokedexScreen refreshes (new Pokemon)
   - StorageScreen refreshes (less Pokeballs)
   - ShopScreen refreshes (more coins)

GLOBAL EVENT LISTENERS:

Listen for events from screens:
- 'pokemonCaught' - Update all relevant screens
- 'itemPurchased' - Update storage and balance
- 'settingsChanged' - Apply new settings globally

LIFECYCLE:

initialize()
- Set up all screens
- Load initial data
- Show default screen

cleanup()
- Remove event listeners
- Called when popup closes (if needed)

ERROR HANDLING:
- Try/catch around initialization
- Display error screen if something fails
- "Oops! Something went wrong" with SNES styling
- Option to reset data

LAYOUT MANAGEMENT:
- Screens container: Full height minus tabs (640px - 60px = 580px)
- Tabs: Fixed at bottom (60px)
- Each screen: Scrollable if content exceeds 580px

EXPORTS:
(Main entry point, no exports needed)
*/

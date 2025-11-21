# PokéBrowse - Pokemon Chrome Extension

## Project Overview
A lofi SNES-style Pokemon catching game implemented as a Chrome extension. Users can encounter and catch Pokemon while browsing the web. Features a mobile-shaped popup (360x640px) with tab-based navigation for different screens.

## Current State (November 21, 2025)
**Phase**: Complete Modular Tab-Based Architecture with Placeholders
- Tab navigation system with 6 screens
- Each screen has dedicated component file
- SNES-style aesthetic design
- Mobile-shaped popup (360x580px screens + 60px tabs)
- Preview server configured for Replit testing

## Architecture

### Tab-Based Navigation Structure
The app uses a **tab navigation pattern** with 6 main screens:

1. **🎮 Main (Catch)** - Default screen for encountering/catching Pokemon
2. **🔍 Search** - Find specific Pokemon by name, type, or rarity
3. **📖 Pokédex** - View and manage caught Pokemon collection
4. **🎒 Storage** - Manage inventory items (Pokéballs, potions, etc.)
5. **🏪 Shop** - Buy items with PokéCoins, trading system
6. **⚙️ Settings** - Preferences, audio, data management

### File Organization

**Popup Runtime** (`src/popup/`)
- `main.js` - Tab coordinator and app entry point
- `tabs-navigation.js` - Bottom tab menu component
- `screens/` - Individual screen components (6 files, one per tab)
- UI helper components (ui-controller, encounter-screen, stats-display)

**Background Runtime** (`src/background/`)
- Service worker for browsing tracking
- Tab navigation monitoring
- Notification and badge management

**Shared Modules** (`src/shared/`)
- **Services**: Business logic (encounter, catch, sprite, storage, repository)
- **Data**: Pokemon database
- **Constants**: Game configuration
- **Utils**: Helper functions (random, formatting)

### Tech Stack
- Vanilla JavaScript with ES Modules
- Chrome Extension Manifest V3
- Tab-based navigation pattern
- Chrome APIs: Storage, Tabs, Notifications
- HTML5/CSS3 with SNES CSS Framework
- Optional: PokeAPI for sprites

## Module Responsibilities

### Screen Components (One per tab)
Each screen file has ONE clear purpose:
- `main-screen.js` - Encounter and catching interface ONLY
- `search-screen.js` - Pokemon search and filtering ONLY
- `pokedex-screen.js` - Collection viewing ONLY
- `storage-screen.js` - Item inventory management ONLY
- `shop-screen.js` - Purchasing and trading ONLY
- `settings-screen.js` - Preferences and data management ONLY

### Shared Services (Business Logic)
- `EncounterService.js` - Encounter generation logic ONLY
- `CatchService.js` - Catching mechanics ONLY
- `SpriteService.js` - Sprite/API connections ONLY
- `StorageService.js` - Chrome storage abstraction ONLY
- `PokemonRepository.js` - Pokemon data access ONLY

This makes code:
- Easy to find (catch logic? → CatchService.js)
- Easy to test (isolated responsibilities)
- Easy to maintain (changes don't affect other modules)
- Easy to extend (add new features without touching existing code)

## Development Workflow

### Layout Dimensions
- Total popup: 360x640px (mobile-shaped)
- Screens container: 360x580px (scrollable content area)
- Tabs navigation: 360x60px (fixed at bottom)

### Screen Switching
- Only one screen visible at a time
- TabsNavigation emits 'tabchange' events
- main.js coordinator hides all screens, shows selected screen
- Smooth fade transitions between screens

### Preview in Replit
The preview server runs on port 5000 displaying `preview.html`, which embeds popup.html in a 360x640px mobile frame.

### Install in Chrome (Future)
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked extension from this directory

## Recent Changes
- **2025-11-21**: Added tab-based navigation system
- **2025-11-21**: Created 6 separate screen component files
- **2025-11-21**: Added tabs-navigation.js for bottom tab menu
- **2025-11-21**: Updated main.js as tab coordinator
- **2025-11-21**: Updated popup.html structure for tabs + screens
- **2025-11-21**: Updated styles.css with tab styling guidelines
- **2025-11-21**: Designed modular architecture per user feedback
- **2025-11-21**: Created service-oriented structure with clear separation of concerns

## User Preferences
- Prefers highly modular file structure
- Wants each file to have one clear purpose
- Likes separation of concerns (encounter logic, catching logic, sprite connections all separate)
- Wants tab-based navigation with multiple screens (search, pokedex, items, shop, settings)
- Mobile-shaped interface (360x640px)
- SNES lofi aesthetic

## Design Decisions

### Why Tabs Instead of Single Screen?
- More features and functionality
- Familiar mobile app pattern
- Clear separation of concerns (each screen = one purpose)
- Easy to navigate between different functions
- Better organization of features

### Why Bottom Tabs?
- Mobile-friendly (thumb-accessible)
- Consistent with mobile app conventions
- Always visible (no menu needed)
- SNES aesthetic works well with button-style tabs

### Why Mobile-Shaped?
- Chrome extension popups work best in compact layouts
- 360x640px is familiar smartphone size
- Easy to design for one fixed dimension
- SNES aesthetic fits well in contained space

## Next Steps
1. Implement Pokemon database with actual data
2. Fill in TabsNavigation rendering logic
3. Implement each screen's UI and logic
4. Build SNES-style CSS
5. Connect screens in main.js coordinator
6. Source or create Pokemon sprite assets
7. Add sound effects

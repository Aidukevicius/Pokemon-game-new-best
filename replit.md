# PokéBrowse - Pokemon Chrome Extension

## Project Overview
A lofi SNES-style Pokemon catching game implemented as a Chrome extension. Users can encounter and catch Pokemon while browsing the web. Features a mobile-shaped popup (360x640px) with tab-based navigation for different screens.

## Current State (December 5, 2025)
**Phase**: Battle System Complete - Authentic Gen 3+ Mechanics
- Authentic Gen 3+ damage formula with STAB, critical hits (2.0x), and type effectiveness
- Complete 18-type effectiveness chart with immunities, resistances, and super effective matchups
- Physical/special move split based on PokeAPI damageClass
- Rarity-based level scaling (Common 5-15, Uncommon 15-25, Rare 25-40, Legendary 50-70)
- Wild Pokemon use type-appropriate moves with proper damage calculation
- Type effectiveness messages in battle log ("Super effective!", "Not very effective...")
- All 151 Gen 1 Pokemon with base stats and proper type lookups
- Search screen with Pokemon encounter testing buttons
- Encounter system with rarity-based Pokemon spawning (Common, Uncommon, Rare, Legendary)
- Gen 1 catch rate formula implementation
- Full encounter UI with Pokemon stats, HP bar, type badges
- PostgreSQL database connected via Flask backend
- Canonical Pokemon stat formulas using individual IVs (0-31 range)
- Nature system with +10%/-10% stat modifiers
- Tab navigation system with 6 screens
- SNES-style aesthetic with retro styling
- Mobile-shaped popup (280x500px in preview mode)

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
- **2025-12-08**: Combined critical hit, super effective, and miss messages into single battle log entries
- **2025-12-08**: Enlarged Pokemon name/HP plates with bigger text (12px name, 11px level) and taller HP bars (14px)
- **2025-12-08**: Improved companion Pokemon display with high-quality smooth rendering (non-pixelated)
- **2025-12-08**: Added enemy counter-attack after failed Pokeball catch attempts
- **2025-12-08**: Slowed down battle sequence for better message readability (1.2-2.5s delays)
- **2025-12-08**: Made battle screen more compact with larger Pokemon sprites (96px enemy, 110px ally)
- **2025-12-05**: Implemented authentic Gen 3+ damage formula with complete 18-type effectiveness chart
- **2025-12-05**: Added BattleService with STAB, critical hits (2.0x Gen3 multiplier), type immunities
- **2025-12-05**: Implemented physical/special move split using damageClass from PokeAPI
- **2025-12-05**: Added rarity-based level scaling (Common 5-15, Uncommon 15-25, Rare 25-40, Legendary 50-70)
- **2025-12-05**: Wild Pokemon now use type-appropriate move pools with proper damage calculation
- **2025-12-05**: Type effectiveness messages displayed in battle log (Super effective!, Not very effective...)
- **2025-12-05**: Extended base stats map to cover all Gen 1 Pokemon for accurate stat calculation
- **2025-12-05**: Companion types now pulled from Pokemon database for all 151 Pokemon
- **2025-12-05**: Integrated PokeAPI for real Pokemon move data (power, accuracy, PP, effects)
- **2025-12-05**: Created MoveService.js for fetching and caching move data from PokeAPI
- **2025-12-05**: Implemented 15+ type-specific CSS animations for move effects (Electric, Fire, Water, Grass, Psychic, Ice, Ghost, Dragon, Fighting, Rock, Ground, Poison, Bug, Flying, Normal)
- **2025-12-05**: Fixed status move handling - uses damageClass instead of power to differentiate
- **2025-12-05**: Added fixed-damage move support (Dragon Rage=40, Seismic Toss/Night Shade=level, Super Fang=half HP)
- **2025-12-05**: Battle log now shows damage dealt and STAB bonus indicators
- **2025-12-04**: Redesigned battle screen - larger battle field (280px), bigger Pokemon sprites (96px)
- **2025-12-04**: Removed "Wild Pokemon appeared" message and catch rate indicator from battle UI
- **2025-12-04**: Added Pokemon type badges displayed below wild Pokemon
- **2025-12-04**: Reorganized battle menu with 4-column move grid and larger action buttons
- **2025-12-04**: Dark theme battle frame with enhanced SNES aesthetic
- **2025-12-04**: Implemented Search screen with encounter testing buttons (Common/Uncommon/Rare/Legendary)
- **2025-12-04**: Added EncounterService for Pokemon encounter generation with rarity weights
- **2025-12-04**: Integrated CatchService with Gen 1 catch rate formula
- **2025-12-04**: Added Settings screen with "Add Test Pokemon" button
- **2025-12-04**: Created search-screen.css with styling for search mode and encounters
- **2025-12-03**: Redesigned item equipping UX - moved from Items tab to Pokemon detail modal
- **2025-12-03**: Simplified Items tab to overview-only with compact badge display
- **2025-12-03**: Added item selector in detail modal with equip/change/remove functionality
- **2025-12-03**: Collection screen now loads from API and refreshes on item changes
- **2025-12-03**: Added Individual Values (IVs) system with random 0-31 values per stat
- **2025-12-03**: Created IV rating system (Outstanding, Relatively Superior, Above Average, Decent)
- **2025-12-03**: Fixed Pokemon slot click handlers by using in-memory collection
- **2025-12-03**: Added IV columns to database (hp_iv, attack_iv, defense_iv, etc.)
- **2025-12-03**: Updated stats calculation to use individual IVs per Pokemon
- **2025-12-03**: Added IVs section to detail modal with visual bars and total display
- **2025-12-03**: Added Pokemon detail card modal with full stats display
- **2025-12-03**: Implemented canonical Pokemon stat formulas (IV/EV/nature)
- **2025-12-03**: Created stats.js utility with nature modifiers and stat calculations
- **2025-12-03**: Added EV tracking (6 stats, 510 total cap) with visual bars
- **2025-12-03**: Added item slot system for held items
- **2025-12-03**: Created detail-modal.css with SNES-style retro design
- **2025-12-02**: Integrated PostgreSQL database with Flask backend
- **2025-12-02**: Created server.py with Pokemon model and REST API endpoints
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

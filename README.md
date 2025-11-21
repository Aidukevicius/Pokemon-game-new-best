# 🎮 PokéBrowse - Pokemon Chrome Extension Game

A lofi SNES-style Pokemon catching game that runs as a Chrome extension. Encounter and catch Pokemon while browsing the web!

## 📱 App Structure

**Tab-Based Navigation** - 6 screens accessible via bottom tabs:
- 🎮 **Catch** - Main Pokemon encounter screen
- 🔍 **Search** - Look for specific Pokemon
- 📖 **Pokédex** - View your collection
- 🎒 **Items** - Manage inventory
- 🏪 **Shop** - Buy items and trade
- ⚙️ **Settings** - Preferences and data

Mobile-shaped popup (360x640px) with tabs fixed at bottom (60px height).

## 📁 Modular File Structure

```
pokemon-extension/
├── manifest.json                    # Chrome Extension V3 config
├── popup.html                       # Main UI with tabs + screens
├── styles.css                       # SNES-style lofi aesthetic
├── preview.html                     # Replit preview wrapper
│
├── src/
│   ├── popup/                       # Popup UI Runtime
│   │   ├── main.js                  # Tab coordinator & app entry
│   │   ├── tabs-navigation.js       # Bottom tab menu component
│   │   │
│   │   ├── screens/                 # Individual Screen Components
│   │   │   ├── main-screen.js       # 🎮 Catch Pokemon screen
│   │   │   ├── search-screen.js     # 🔍 Search for Pokemon
│   │   │   ├── pokedex-screen.js    # 📖 Collection view
│   │   │   ├── storage-screen.js    # 🎒 Item inventory
│   │   │   ├── shop-screen.js       # 🏪 Shop & trading
│   │   │   └── settings-screen.js   # ⚙️ Settings & preferences
│   │   │
│   │   ├── ui-controller.js         # DOM manipulation & animations
│   │   ├── encounter-screen.js      # Pokemon encounter component
│   │   └── stats-display.js         # Stats bar component
│   │
│   ├── background/                  # Background Service Worker
│   │   ├── main.js                  # Background entry point
│   │   ├── tab-tracker.js           # Browsing activity tracker
│   │   └── notification-manager.js  # Notifications & badge
│   │
│   └── shared/                      # Shared Modules
│       ├── index.js                 # Central export aggregator
│       │
│       ├── services/                # Business Logic Services
│       │   ├── EncounterService.js  # Pokemon encounter generation
│       │   ├── CatchService.js      # Catching mechanics & formulas
│       │   ├── SpriteService.js     # Sprite URL resolution
│       │   ├── StorageService.js    # Chrome Storage abstraction
│       │   └── PokemonRepository.js # Pokemon data access layer
│       │
│       ├── data/                    # Static Data
│       │   └── pokemon-database.js  # Complete Pokemon database
│       │
│       ├── constants/               # Configuration
│       │   └── game-config.js       # All game config & defaults
│       │
│       └── utils/                   # Utilities
│           ├── random.js            # Random number generators
│           └── helpers.js           # General helper functions
│
└── assets/
    ├── sprites/                     # Pokemon sprite images
    ├── icons/                       # Extension icons (16, 48, 128px)
    └── sounds/                      # Retro sound effects
```

## 🎯 Architecture Overview

### **Screen Navigation Flow**

```
popup.html
  ↓
src/popup/main.js (coordinator)
  ├─→ TabsNavigation (bottom tabs)
  │     └─→ emits 'tabchange' events
  │
  └─→ Screens (only one visible at a time)
        ├─→ MainScreen (catch Pokemon)
        ├─→ SearchScreen (find Pokemon)
        ├─→ PokedexScreen (view collection)
        ├─→ StorageScreen (manage items)
        ├─→ ShopScreen (buy/trade)
        └─→ SettingsScreen (preferences)
```

### **Separation of Concerns**

**Tab Navigation** (`tabs-navigation.js`)
- Renders bottom tab bar
- Handles tab switching
- Shows active tab state
- SNES-style tab buttons

**Screen Components** (`src/popup/screens/`)
- Each screen = separate file
- Own initialization and rendering
- show() and hide() methods
- Independent state management

**Shared Services** (`src/shared/services/`)
- Pure business logic
- No UI dependencies
- Reusable across screens
- Single responsibility per service

### **Data Flow Example**

```
User clicks "Throw Pokéball" in MainScreen
  ↓
MainScreen calls CatchService.attemptCatch()
  ↓
CatchService calculates success/fail
  ↓
Result returned to MainScreen
  ↓
MainScreen updates UI
  ↓
main.js broadcasts update to other screens
  ↓
PokedexScreen refreshes (new Pokemon if caught)
StorageScreen refreshes (less Pokéballs)
ShopScreen refreshes (earned coins)
```

## 🎨 Design Philosophy

- **Aesthetic**: Lofi SNES style inspired by https://snes-css.sadlative.com/
- **Dimensions**: Mobile-shaped popup (360x640px)
  - Screens area: 360x580px (scrollable)
  - Tabs area: 360x60px (fixed bottom)
- **Color Palette**: Warm grays and muted colors for lofi vibe
- **Typography**: Pixel fonts (Press Start 2P)
- **UI Elements**: SNES-style buttons, borders, and components
- **Architecture**: Modular ES modules with single responsibilities

## 🎮 Features by Screen

### 🎮 Main Screen (Catch)
- Pokemon encounter display
- Throw Pokéball / Run Away
- Player stats (Pokéballs, caught count)
- Catch animations

### 🔍 Search Screen
- Search Pokemon by name
- Filter by type and rarity
- View Pokemon details
- Browse all available Pokemon

### 📖 Pokédex Screen
- View caught Pokemon collection
- Sort and filter collection
- Completion percentage
- Pokemon details and stats

### 🎒 Storage Screen
- Inventory management
- View all items and quantities
- Item descriptions
- Use/equip items

### 🏪 Shop Screen
- Buy Pokéballs and items
- PokéCoin currency system
- Trading (future feature)
- Daily deals

### ⚙️ Settings Screen
- Audio settings
- Notification preferences
- Data management (export/import)
- Reset all data
- About info

## 🚀 Development

### Preview in Replit
Open the webview (running on port 5000) to see `preview.html` with the mobile-shaped popup frame.

### Install in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this project folder

## 📝 Current Status

**Structure Phase**: Complete modular tab-based architecture with placeholders.

Each file contains detailed comments explaining:
- What code should go there
- What it should import/export
- Methods and responsibilities
- Example implementations
- HTML structure
- Styling notes

**Next Steps**:
1. Implement Pokemon database with actual data
2. Fill in service logic (EncounterService, CatchService, etc.)
3. Build screen HTML/CSS with SNES styling
4. Implement tab navigation rendering
5. Connect screens in main.js coordinator
6. Add Pokemon sprites and assets

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES Modules)
- **Styling**: HTML5/CSS3 + SNES CSS Framework
- **APIs**: Chrome Extension APIs (Storage, Tabs, Notifications)
- **Architecture**: Service-oriented modular design with tab navigation
- **External**: PokeAPI / Pokemon Showdown sprites (optional)

## 💡 Key Design Decisions

1. **Tab-based Navigation**: Familiar mobile app pattern, easy to use
2. **One Screen at a Time**: Simple state management, clear UX
3. **Bottom Tabs**: Thumb-friendly for mobile-shaped popup
4. **Modular Screens**: Each screen is independent and maintainable
5. **Shared Services**: Business logic separated from UI
6. **SNES Aesthetic**: Nostalgic, cohesive visual identity

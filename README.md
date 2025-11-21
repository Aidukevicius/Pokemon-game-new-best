# 🎮 PokéBrowse - Pokemon Chrome Extension Game

A lofi SNES-style Pokemon catching game that runs as a Chrome extension. Encounter and catch Pokemon while browsing the web!

## 📁 Modular File Structure

```
pokemon-extension/
├── manifest.json                    # Chrome Extension V3 config
├── popup.html                       # Main UI entry point
├── styles.css                       # SNES-style lofi aesthetic
├── preview.html                     # Replit preview wrapper
│
├── src/
│   ├── popup/                       # Popup UI Runtime
│   │   ├── main.js                  # Popup entry point & coordinator
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

### **Separation of Concerns**

Each file has ONE clear responsibility:

**Popup Runtime** (`src/popup/`)
- `main.js` - Coordinates services and UI components
- `ui-controller.js` - Handles all DOM manipulation
- `encounter-screen.js` - Manages Pokemon display
- `stats-display.js` - Manages stats bar

**Background Runtime** (`src/background/`)
- `main.js` - Service worker coordinator
- `tab-tracker.js` - Tracks browsing to trigger encounters
- `notification-manager.js` - Handles notifications & badge

**Shared Services** (`src/shared/services/`)
- `EncounterService.js` - Encounter logic ONLY
- `CatchService.js` - Catching mechanics ONLY
- `SpriteService.js` - Sprite/API connections ONLY
- `StorageService.js` - Storage abstraction ONLY
- `PokemonRepository.js` - Data access ONLY

**Shared Data & Utils** (`src/shared/`)
- `data/` - Static Pokemon database
- `constants/` - Configuration values
- `utils/` - Helper functions

### **Module Communication**

```
popup/main.js
  ↓ imports
  ├─→ EncounterService → PokemonRepository → pokemon-database.js
  ├─→ CatchService → StorageService → Chrome Storage API
  ├─→ SpriteService → PokeAPI / CDN
  └─→ UIController → DOM Elements

background/main.js
  ↓ imports
  ├─→ TabTracker → Chrome Tabs API
  ├─→ NotificationManager → Chrome Notifications API
  └─→ StorageService → Chrome Storage API
```

## 🎨 Design Philosophy

- **Aesthetic**: Lofi SNES style inspired by https://snes-css.sadlative.com/
- **Dimensions**: Mobile-shaped popup (360x640px)
- **Color Palette**: Warm grays and muted colors for lofi vibe
- **Typography**: Pixel fonts and retro styling
- **Architecture**: Modular ES modules with single responsibilities

## 🚀 Development

### Preview in Replit
Open `preview.html` in the Replit webview to see the extension popup in a mobile frame.

### Install in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this project folder

## 📝 Current Status

**Structure Phase**: Modular file structure created with placeholder descriptions.

Each file contains detailed comments explaining:
- What code should go there
- What it should import
- What it should export
- Example implementations

**Next Steps**:
1. Implement `src/shared/data/pokemon-database.js` with actual Pokemon
2. Fill in service logic (EncounterService, CatchService, etc.)
3. Build popup UI with SNES-style HTML/CSS
4. Connect services to UI in main.js
5. Add Pokemon sprites and assets

## 🎯 Features (Planned)

- ✅ Modular architecture with clear separation of concerns
- ✅ ES module system for clean imports
- ⬜ Random Pokemon encounters while browsing
- ⬜ Pokéball catching mechanics with success rates
- ⬜ Pokemon collection/Pokédex
- ⬜ Retro sound effects
- ⬜ SNES-style animations
- ⬜ Chrome local storage for progress

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES Modules)
- **Styling**: HTML5/CSS3 + SNES CSS Framework
- **APIs**: Chrome Extension APIs (Storage, Tabs, Notifications)
- **Architecture**: Service-oriented modular design
- **External**: PokeAPI / Pokemon Showdown sprites (optional)

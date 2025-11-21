# 🎮 PokéBrowse - Pokemon Chrome Extension Game

A lofi SNES-style Pokemon catching game that runs as a Chrome extension. Encounter and catch Pokemon while browsing the web!

## 📁 File Structure

```
pokemon-extension/
├── manifest.json          # Chrome extension configuration
├── popup.html             # Main mobile-shaped UI (360x640px)
├── popup.js               # Popup interface logic
├── background.js          # Service worker for tracking browsing
├── storage.js             # Chrome Storage API utilities
├── pokemon-data.js        # Pokemon database
├── styles.css             # SNES-style lofi aesthetic
├── preview.html           # Replit preview page
├── assets/
│   ├── sprites/          # Pokemon sprite images
│   ├── icons/            # Extension icons (16, 48, 128px)
│   └── sounds/           # Retro sound effects
└── README.md             # This file
```

## 🎨 Design Philosophy

- **Aesthetic**: Lofi SNES style inspired by https://snes-css.sadlative.com/
- **Dimensions**: Mobile-shaped popup (360x640px)
- **Color Palette**: Warm grays and muted colors for lofi vibe
- **Typography**: Pixel fonts and retro styling

## 🚀 Development

### Preview in Replit
Open `preview.html` in the Replit webview to see the extension popup.

### Install in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this project folder

## 📝 Current Status

**Structure Phase**: All files contain placeholder descriptions of what code should go where.

**Next Steps**:
1. Fill in manifest.json with actual Chrome extension config
2. Build popup.html structure with SNES-style layout
3. Implement styles.css with lofi aesthetic
4. Add JavaScript game logic
5. Include Pokemon sprites and assets

## 🎯 Features (Planned)

- Random Pokemon encounters while browsing
- Pokéball catching mechanics
- Pokemon collection/Pokédex
- Retro sound effects
- SNES-style animations
- Local storage for progress

## 🛠️ Tech Stack

- Vanilla JavaScript (Chrome Extension APIs)
- HTML5/CSS3
- Chrome Storage API
- Chrome Tabs API
- SNES CSS Framework

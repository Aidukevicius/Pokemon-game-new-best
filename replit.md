# PokéBrowse - Pokemon Chrome Extension

## Project Overview
A lofi SNES-style Pokemon catching game implemented as a Chrome extension. Users can encounter and catch Pokemon while browsing the web, with a retro aesthetic inspired by https://snes-css.sadlative.com/.

## Current State (November 21, 2025)
**Phase**: File Structure Setup (Placeholders)
- All core files created with detailed placeholder descriptions
- Mobile-shaped popup design (360x640px)
- Preview server configured for Replit testing

## Architecture

### File Structure
- `manifest.json` - Chrome Extension V3 configuration
- `popup.html` - Main mobile UI (360x640px) 
- `popup.js` - Popup interface logic
- `background.js` - Service worker for browsing activity tracking
- `storage.js` - Chrome Storage API utilities
- `pokemon-data.js` - Pokemon database
- `styles.css` - SNES-style lofi aesthetic
- `preview.html` - Replit preview wrapper page
- `assets/` - Sprites, icons, and sounds

### Tech Stack
- Vanilla JavaScript with Chrome Extension APIs
- HTML5/CSS3
- SNES CSS Framework (to be integrated)
- Chrome Storage API
- Chrome Tabs API

## Development Workflow

### Preview in Replit
The preview server runs on port 5000 and displays `preview.html`, which embeds the popup.html in a mobile-shaped frame.

### Install in Chrome (Future)
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked extension from this directory

## Recent Changes
- **2025-11-21**: Created complete file structure with placeholder descriptions
- **2025-11-21**: Set up Python preview server on port 5000
- **2025-11-21**: Documented project structure and architecture

## Next Steps
1. Implement actual manifest.json configuration
2. Build popup.html with SNES-style layout
3. Create CSS styling with lofi aesthetic
4. Add JavaScript game logic
5. Source or create Pokemon sprite assets

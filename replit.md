# PokéBrowse - Pokemon Chrome Extension

## Project Overview
A lofi SNES-style Pokemon catching game implemented as a Chrome extension. Users can encounter and catch Pokemon while browsing the web, with a retro aesthetic inspired by https://snes-css.sadlative.com/.

## Current State (November 21, 2025)
**Phase**: Modular File Structure with Placeholders
- Complete modular architecture following separation of concerns
- Each file has ONE clear responsibility
- ES module system for clean imports
- Mobile-shaped popup design (360x640px)
- Preview server configured for Replit testing

## Architecture

### Modular Structure
The project uses a service-oriented architecture with clear separation:

**Popup Runtime** (`src/popup/`)
- Entry point and UI coordination
- Component-based UI (encounter screen, stats display)
- DOM manipulation isolated in ui-controller

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
- Chrome APIs: Storage, Tabs, Notifications
- HTML5/CSS3 with SNES CSS Framework
- Optional: PokeAPI for sprites

## File Organization Principle

Each file follows single responsibility:
- `EncounterService.js` - ONLY encounter generation logic
- `CatchService.js` - ONLY catching mechanics
- `SpriteService.js` - ONLY sprite/API connections
- `StorageService.js` - ONLY Chrome storage abstraction
- `PokemonRepository.js` - ONLY Pokemon data access

This makes code:
- Easy to find
- Easy to test
- Easy to maintain
- Easy to extend

## Development Workflow

### Preview in Replit
The preview server runs on port 5000 displaying `preview.html`, which embeds popup.html in a 360x640px mobile frame.

### Install in Chrome (Future)
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked extension from this directory

## Recent Changes
- **2025-11-21**: Redesigned with modular architecture per user feedback
- **2025-11-21**: Created service-oriented structure with clear separation of concerns
- **2025-11-21**: Organized into runtime-specific folders (popup, background, shared)
- **2025-11-21**: Added detailed placeholder descriptions in each module
- **2025-11-21**: Set up ES module imports system
- **2025-11-21**: Updated manifest.json to use modular entry points

## User Preferences
- Prefers highly modular file structure
- Wants each file to have one clear purpose
- Likes separation of concerns (encounter logic, catching logic, sprite connections all separate)

## Next Steps
1. Implement Pokemon database with actual data
2. Fill in service logic (starting with EncounterService and CatchService)
3. Build popup HTML structure with SNES styling
4. Implement CSS with lofi aesthetic
5. Connect services in popup/main.js
6. Source or create Pokemon sprite assets
7. Add sound effects

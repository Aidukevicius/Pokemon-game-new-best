// BACKGROUND.JS PLACEHOLDER
// Service worker for Chrome extension background tasks

// WHAT GOES HERE:

/*
SERVICE WORKER SETUP:
- Initialize extension on install
- Set up default storage values (Pokéballs, empty collection)

TAB ACTIVITY TRACKING:
- Listen for tab navigation events (chrome.tabs.onUpdated)
- Track unique website visits
- Increment encounter chance counter

ENCOUNTER TRIGGER SYSTEM:
- Every X websites visited = new encounter available
- Set badge on extension icon when encounter ready
- Send notification to user about new Pokemon

BADGE MANAGEMENT:
- chrome.action.setBadgeText() to show "!" when encounter ready
- Clear badge when popup is opened
- Badge color styling (red background)

NOTIFICATION SYSTEM (optional):
- Create browser notification when rare Pokemon appears
- Include Pokemon name and sprite in notification

STORAGE MANAGEMENT:
- Initialize player data on first install:
  * Starting Pokéballs: 20
  * Caught Pokemon: []
  * Encounters available: 1
- Periodic cleanup of old data

EVENT LISTENERS:
- chrome.runtime.onInstalled
- chrome.tabs.onUpdated
- chrome.action.onClicked (if needed)
*/

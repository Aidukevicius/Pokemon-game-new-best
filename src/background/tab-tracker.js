// TAB TRACKER MODULE PLACEHOLDER
// Tracks user browsing activity to trigger encounters

// WHAT GOES HERE:

/*
CLASS: TabTracker

RESPONSIBILITIES:
- Listen to Chrome tab navigation events
- Count unique website visits
- Determine when to trigger new encounters
- Filter out ignored domains (chrome://, extensions, etc.)

METHODS:

constructor(encounterThreshold = 5)
- Set how many sites = 1 encounter
- Initialize visited sites counter
- Set up Chrome API listeners

start()
- Begin listening to tab events
- chrome.tabs.onUpdated listener
- chrome.tabs.onActivated listener

onTabUpdated(tabId, changeInfo, tab)
- Check if navigation completed (changeInfo.status === 'complete')
- Extract domain from tab.url
- Check if domain should be counted (not chrome://, not same domain as last)
- Increment visit counter
- Check if threshold reached

isValidDomain(url)
- Return false for chrome://, chrome-extension://, about:, file://
- Return false for Repl domain (avoid counting dev)
- Return true for regular websites

incrementVisitCounter()
- Add 1 to visit count
- Save to storage
- Check if threshold reached

onThresholdReached()
- Emit event or call callback
- Reset counter
- Trigger encounter generation in main.js

stop()
- Remove Chrome API listeners
- Clean up

HELPER METHODS:
- extractDomain(url) - Get domain from full URL
- shouldCountVisit(url) - Validation logic

EXPORTS:
export class TabTracker { ... }
*/

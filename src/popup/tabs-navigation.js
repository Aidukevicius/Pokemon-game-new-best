// TABS NAVIGATION COMPONENT PLACEHOLDER
// Bottom tab menu for switching between screens

// WHAT GOES HERE:

/*
CLASS: TabsNavigation

RESPONSIBILITIES:
- Render bottom tab bar with all tabs
- Handle tab click events
- Switch active tab
- Emit events when tab changes
- Highlight current active tab
- SNES-style tab styling

TAB STRUCTURE:
const TABS = [
  { id: 'main', label: 'Catch', icon: '🎮' },
  { id: 'search', label: 'Search', icon: '🔍' },
  { id: 'pokedex', label: 'Pokédex', icon: '📖' },
  { id: 'storage', label: 'Items', icon: '🎒' },
  { id: 'shop', label: 'Shop', icon: '🏪' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

METHODS:

constructor(containerElement)
- Store reference to tab bar container
- Create tab elements
- Set default active tab ('main')

render()
- Build HTML structure for tab bar
- Create button for each tab
- Add icons and labels
- Apply SNES-style button styling
- Fixed to bottom of popup (60px height)

setActiveTab(tabId)
- Remove active class from all tabs
- Add active class to selected tab
- Update visual state (different color/border)
- Emit 'tabchange' event with new tabId

onTabClick(tabId)
- Handler for tab button clicks
- Call setActiveTab(tabId)
- Trigger screen change

getActiveTab()
- Return currently active tab ID
- Returns string

disableTab(tabId)
- Disable specific tab (grayed out, not clickable)
- Maybe used if feature is locked

enableTab(tabId)
- Re-enable previously disabled tab

updateBadge(tabId, count)
- Show notification badge on tab
- Example: badge on 'storage' showing "3" new items
- Small red circle with number

HTML STRUCTURE:
<nav class="tabs-navigation">
  <button class="tab-button active" data-tab="main">
    <span class="tab-icon">🎮</span>
    <span class="tab-label">Catch</span>
  </button>
  <button class="tab-button" data-tab="search">
    <span class="tab-icon">🔍</span>
    <span class="tab-label">Search</span>
  </button>
  <!-- ... more tabs -->
</nav>

CSS STYLING NOTES:
- Fixed position at bottom
- Height: 60px
- Display: flex, justify-content: space-evenly
- Each tab: 60px width
- SNES-style borders between tabs
- Active tab: raised/highlighted appearance
- Inactive tabs: slightly recessed
- Pixel font for labels
- Icon above label (vertical layout)

EVENTS:
- Emit 'tabchange' event with { tabId, previousTabId }
- Listen in main.js to switch screens

EXPORTS:
export class TabsNavigation { ... }
*/

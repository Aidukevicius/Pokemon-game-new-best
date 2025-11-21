// NOTIFICATION MANAGER PLACEHOLDER
// Handles extension notifications and badge

// WHAT GOES HERE:

/*
CLASS: NotificationManager

RESPONSIBILITIES:
- Show browser notifications
- Manage extension icon badge
- Alert user about encounters
- Special notifications for rare Pokemon

METHODS:

constructor()
- Set up notification templates
- Initialize badge settings

showEncounterNotification(pokemon)
- Create notification with Pokemon details
- Use Pokemon sprite as icon (if possible)
- Title: "A wild [Pokemon] appeared!"
- Message: Click to catch it
- chrome.notifications.create()

showRareEncounterNotification(pokemon)
- Special notification for rare/legendary
- Different icon or styling
- Play sound (optional)
- Higher priority

setBadge(text, color)
- Update extension icon badge
- chrome.action.setBadgeText({ text })
- chrome.action.setBadgeBackgroundColor({ color })
- Examples: "!" for encounter, "3" for 3 encounters available

clearBadge()
- Remove badge from icon
- Called when user opens popup

setEncounterAvailableBadge()
- Show "!" or "NEW" on icon
- Red background color
- Indicates encounter waiting

updateEncounterCount(count)
- Show number of available encounters
- If count > 0, show badge
- If count === 0, clear badge

HELPER METHODS:
- getNotificationIcon(pokemon) - Return sprite URL or default icon
- getPriorityByRarity(rarity) - Higher priority for rare Pokemon

EXPORTS:
export class NotificationManager { ... }
*/

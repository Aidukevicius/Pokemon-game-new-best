// UI CONTROLLER PLACEHOLDER
// Handles all DOM manipulation and UI updates

// WHAT GOES HERE:

/*
CLASS: UIController

RESPONSIBILITIES:
- Get references to all DOM elements
- Update UI based on game state
- Show/hide different screens
- Trigger animations
- Display messages and notifications

METHODS:

constructor()
- Cache all DOM element references
- Set up animation keyframes

displayPokemon(pokemon)
- Update Pokemon name, level, type
- Set sprite image source
- Show Pokemon info card

showCatchAnimation()
- Trigger Pokéball throw animation
- Play catch attempt sequence
- Return promise that resolves when animation completes

showCatchResult(success, pokemon)
- If success: Show "Gotcha!" message with Pokemon name
- If fail: Show "Oh no! Pokemon escaped!" message
- Trigger appropriate animation (success/fail)

updateStats(pokeballs, totalCaught)
- Update Pokéball counter display
- Update total Pokemon caught counter

showEncounterScreen()
- Display main encounter UI
- Hide collection/other screens

showCollectionButton()
- Make collection button visible
- Add click handler

disableButtons() / enableButtons()
- Prevent button spam during animations
- Re-enable after completion

EXPORTS:
export class UIController { ... }
*/

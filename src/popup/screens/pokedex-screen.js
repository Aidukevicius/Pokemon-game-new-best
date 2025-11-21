// POKEDEX SCREEN COMPONENT PLACEHOLDER
// View your caught Pokemon collection

// WHAT GOES HERE:

/*
CLASS: PokedexScreen

RESPONSIBILITIES:
- Display all caught Pokemon
- Show collection stats
- Sort/filter collection
- View individual Pokemon details
- Show completion percentage

IMPORTS:
import { StorageService } from '../../shared/services/StorageService.js';
import { SpriteService } from '../../shared/services/SpriteService.js';
import { POKEMON_DATABASE } from '../../shared/data/pokemon-database.js';

METHODS:

constructor(containerElement)
- Store reference to pokedex container
- Initialize StorageService
- Initialize SpriteService

async initialize()
- Load caught Pokemon from storage
- Calculate collection stats
- Render initial view

render()
- Build Pokedex interface:
  * Stats header (X/Y caught, completion %)
  * Sort/filter controls
  * Pokemon grid
  * Empty state if no Pokemon caught

async loadCollection()
- Get all caught Pokemon from StorageService
- Sort by caught date (newest first) or Pokedex number
- Return array of caught Pokemon

displayCollection(pokemonList)
- Render grid of caught Pokemon cards
- Each card shows:
  * Pokemon sprite
  * Pokemon name
  * Pokedex number
  * Level when caught
  * Date caught
  * Click to view details

showPokemonDetail(caughtPokemon)
- Display detailed view:
  * Large sprite
  * Name and Pokedex #
  * Type(s)
  * Level
  * Caught date
  * Maybe stats (future: IV, nature, etc.)
  * "Release" button (delete from collection)

calculateStats()
- Total caught / Total available
- Completion percentage
- Count by type
- Count by rarity
- Return stats object

sortCollection(sortBy)
- Sort options:
  * Pokedex number
  * Caught date (newest/oldest)
  * Name (A-Z)
  * Level (high/low)
- Update display

filterCollection(filterBy)
- Filter by type
- Filter by rarity
- Update display

showEmptyState()
- Display when no Pokemon caught yet
- Message: "Catch your first Pokemon!"
- Maybe show silhouettes of available Pokemon

releasePokemon(catchId)
- Confirm dialog (SNES-style)
- Remove from collection
- Update stats
- Show message

show()
- Make Pokedex visible
- Refresh collection data

hide()
- Hide Pokedex screen

HTML STRUCTURE:
<div class="pokedex-screen">
  <div class="pokedex-header">
    <h2>Pokédex</h2>
    <div class="stats">
      <span>Caught: 15/151</span>
      <span>Completion: 9.9%</span>
    </div>
  </div>
  
  <div class="controls">
    <select class="sort-select">
      <option>Sort by #</option>
      <option>Sort by Date</option>
    </select>
    
    <select class="filter-select">
      <option>All Types</option>
      <option>Fire</option>
      <!-- More types -->
    </select>
  </div>
  
  <div class="collection-grid">
    <!-- Pokemon cards render here -->
  </div>
</div>

STYLING NOTES:
- Grid layout: 2-3 columns
- Scrollable area
- Caught Pokemon: Full color sprites
- Uncaught Pokemon: Silhouettes (optional feature)
- SNES-style card borders
- Highlight rare/legendary with special border

EXPORTS:
export class PokedexScreen { ... }
*/

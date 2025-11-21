// SHARED MODULE INDEX PLACEHOLDER
// Central export aggregator for all shared modules

// WHAT GOES HERE:

/*
This file re-exports all shared services, utilities, and data
for convenient importing across the extension

EXPORTS:

// Services
export { EncounterService } from './services/EncounterService.js';
export { CatchService } from './services/CatchService.js';
export { SpriteService } from './services/SpriteService.js';
export { StorageService } from './services/StorageService.js';
export { PokemonRepository } from './services/PokemonRepository.js';

// Data
export { POKEMON_DATABASE } from './data/pokemon-database.js';

// Constants
export {
  ENCOUNTER_CONFIG,
  CATCH_CONFIG,
  UI_CONFIG,
  SPRITE_CONFIG,
  STORAGE_KEYS,
  DEFAULT_PLAYER_DATA,
  DEFAULT_SETTINGS,
  NOTIFICATION_CONFIG
} from './constants/game-config.js';

// Utilities
export {
  getRandomInt,
  getRandomFloat,
  weightedRandomChoice,
  shuffle,
  getRandomFromArray,
  chance,
  rollDice
} from './utils/random.js';

export {
  capitalize,
  formatPokemonName,
  slugify,
  formatNumber,
  padNumber,
  formatDate,
  getTimeSince,
  formatDuration,
  isValidUrl,
  isValidPokemonId,
  groupBy,
  sortBy,
  getChromeStorage,
  setChromeStorage,
  sleep,
  easeInOut
} from './utils/helpers.js';

USAGE:
Instead of:
  import { EncounterService } from '../shared/services/EncounterService.js';
  import { getRandomInt } from '../shared/utils/random.js';

You can do:
  import { EncounterService, getRandomInt } from '../shared/index.js';
*/

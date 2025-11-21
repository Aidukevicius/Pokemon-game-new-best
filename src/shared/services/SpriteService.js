// SPRITE SERVICE PLACEHOLDER
// Manages Pokemon sprite URLs and image loading

// WHAT GOES HERE:

/*
IMPORTS:
import { SPRITE_CONFIG } from '../constants/game-config.js';

CLASS: SpriteService

RESPONSIBILITIES:
- Resolve Pokemon sprite URLs
- Handle sprite loading
- Provide fallback images
- Support multiple sprite sources (local, API, CDN)
- Cache sprite URLs

METHODS:

constructor()
- Initialize sprite source configuration
- Set up cache for loaded sprites

getSpriteUrl(pokemonId, pokemonName)
- Return sprite URL for given Pokemon
- Check multiple sources:
  1. Local assets folder
  2. PokeAPI (https://pokeapi.co/api/v2/pokemon/{id})
  3. Pokémon Showdown sprites
  4. Custom fallback
- Return URL string

async loadSprite(pokemonId)
- Fetch sprite from API if needed
- Cache the result
- Return sprite data/URL
- Handle errors with fallback

getLocalSpriteUrl(pokemonName)
- Format: assets/sprites/{name}.png
- Convert name to lowercase
- Return local path

async getPokeApiSprite(pokemonId)
- Fetch from PokeAPI: https://pokeapi.co/api/v2/pokemon/{id}
- Extract sprite URL from response
- Prefer: sprites.front_default or sprites.other.official-artwork.front_default
- Return URL

getPokemonShowdownSprite(pokemonName)
- Format name for Showdown sprites
- Return CDN URL: https://play.pokemonshowdown.com/sprites/gen5/{name}.png
- Good fallback option

getFallbackSprite()
- Return generic Pokéball or question mark sprite
- Used when Pokemon sprite not found

preloadSprites(pokemonList)
- Preload common Pokemon sprites
- Load into browser cache
- Improves performance

SPRITE SOURCE PRIORITY:
1. Local assets (fastest, always available offline)
2. Pokémon Showdown CDN (reliable, good quality)
3. PokeAPI (official but slower)
4. Fallback image

EXPORTS:
export class SpriteService { ... }
*/

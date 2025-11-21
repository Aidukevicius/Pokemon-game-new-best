// SPRITE SERVICE
// Manages Pokemon sprite URLs (placeholder for now)

export class SpriteService {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
    // Project Pokemon 3D model GIF URLs (animated 3D renders)
    // These are pre-rendered animated GIFs from their 3D models
    this.modelUrls = {
      1: 'https://projectpokemon.org/images/normal-sprite/bulbasaur.gif',
      2: 'https://projectpokemon.org/images/normal-sprite/ivysaur.gif',
      3: 'https://projectpokemon.org/images/normal-sprite/venusaur.gif',
      4: 'https://projectpokemon.org/images/normal-sprite/charmander.gif',
      5: 'https://projectpokemon.org/images/normal-sprite/charmeleon.gif',
      6: 'https://projectpokemon.org/images/normal-sprite/charizard.gif',
      7: 'https://projectpokemon.org/images/normal-sprite/squirtle.gif',
      8: 'https://projectpokemon.org/images/normal-sprite/wartortle.gif',
      9: 'https://projectpokemon.org/images/normal-sprite/blastoise.gif',
      25: 'https://projectpokemon.org/images/normal-sprite/pikachu.gif',
      26: 'https://projectpokemon.org/images/normal-sprite/raichu.gif',
      150: 'https://projectpokemon.org/images/normal-sprite/mewtwo.gif',
    };
  }

  getSpriteUrl(pokemonId) {
    return `${this.baseUrl}/other/official-artwork/${pokemonId}.png`;
  }

  get3DModelUrl(pokemonId) {
    // Return Project Pokemon 3D sprite GIF if available, otherwise null for fallback
    return this.modelUrls[pokemonId] || null;
  }
}

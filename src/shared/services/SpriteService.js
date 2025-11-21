// SPRITE SERVICE
// Manages Pokemon sprite URLs (placeholder for now)

export class SpriteService {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
    // Project Pokemon 3D model animated GIFs (pre-rendered 3D)
    this.model3DUrls = {
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

  getHighQualitySpriteUrl(pokemonId) {
    // Use official artwork (high quality PNG) for better visuals
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  }

  get3DModelUrl(pokemonId) {
    // Return Project Pokemon 3D animated sprite URL if available
    return this.model3DUrls[pokemonId] || null;
  }

  get3DModelPath(pokemonId) {
    // Not using local files anymore
    return null;
  }
}

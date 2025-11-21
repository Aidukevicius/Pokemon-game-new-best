// SPRITE SERVICE
// Manages Pokemon sprite URLs (placeholder for now)

export class SpriteService {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
    // 3D model files (you'd need to download and host these locally)
    this.modelFiles = {
      25: '/assets/models/pikachu.glb',  // GLB format works best with Three.js
      1: '/assets/models/bulbasaur.glb',
      4: '/assets/models/charmander.glb',
      7: '/assets/models/squirtle.glb',
      // Add more as you download them
    };
  }

  getSpriteUrl(pokemonId) {
    return `${this.baseUrl}/other/official-artwork/${pokemonId}.png`;
  }

  getHighQualitySpriteUrl(pokemonId) {
    // Use official artwork (high quality PNG) for better visuals
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  }

  get3DModelPath(pokemonId) {
    // Return local 3D model file path if available
    return this.modelFiles[pokemonId] || null;
  }

  // For now, use high-quality 2D sprites
  get3DModelUrl(pokemonId) {
    return null;
  }
}

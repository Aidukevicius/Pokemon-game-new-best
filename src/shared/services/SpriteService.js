// SPRITE SERVICE
// Manages Pokemon sprite URLs (placeholder for now)

export class SpriteService {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  }

  getSpriteUrl(pokemonId) {
    return `${this.baseUrl}/other/official-artwork/${pokemonId}.png`;
  }

  getHighQualitySpriteUrl(pokemonId) {
    // Use official artwork (high quality PNG) for better visuals
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  }

  get3DModelUrl(pokemonId) {
    // For now, return null to use high-quality 2D artwork
    // In future, can integrate actual 3D models or animated sprites
    return null;
  }
}

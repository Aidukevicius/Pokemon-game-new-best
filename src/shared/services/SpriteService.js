// SPRITE SERVICE
// Manages Pokemon sprite URLs

export class SpriteService {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  }

  getSpriteUrl(pokemonId) {
    // Use official artwork (high quality PNG)
    return `${this.baseUrl}/other/official-artwork/${pokemonId}.png`;
  }

  getAnimatedSpriteUrl(pokemonId) {
    // Use animated GIF sprite
    return `${this.baseUrl}/versions/generation-v/black-white/animated/${pokemonId}.gif`;
  }

  getDefaultSpriteUrl(pokemonId) {
    // Fallback to standard sprite
    return `${this.baseUrl}/${pokemonId}.png`;
  }
}

// SPRITE SERVICE
// Manages Pokemon sprite URLs (placeholder for now)

export class SpriteService {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  }

  getSpriteUrl(pokemonId) {
    return `${this.baseUrl}/other/official-artwork/${pokemonId}.png`;
  }

  get3DModelUrl(pokemonId) {
    // Placeholder - would need actual 3D model hosting
    // For now, returns null to use sprite fallback
    return null;
  }
}

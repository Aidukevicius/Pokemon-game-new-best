// SPRITE SERVICE
// Manages Pokemon sprite URLs (placeholder for now)

export class SpriteService {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
    // SketchFab embed URLs for popular Pokemon
    this.modelUrls = {
      25: 'https://sketchfab.com/models/e50d043cfdce49bcb6df27b8f4e83415/embed?autostart=1&ui_theme=dark',  // Pikachu
      1: 'https://sketchfab.com/models/6e89ee0e9a844c3db2d76f2faa69da3c/embed?autostart=1&ui_theme=dark',   // Bulbasaur
      4: 'https://sketchfab.com/models/c5c1b9d0e7d545e8b7e8b9f9f9f9f9f9/embed?autostart=1&ui_theme=dark',   // Charmander
      7: 'https://sketchfab.com/models/9e9e9e9e9e9e9e9e9e9e9e9e9e9e9e9e/embed?autostart=1&ui_theme=dark',   // Squirtle
      6: 'https://sketchfab.com/models/f4a5b8c7d2e1f3a4b5c6d7e8f9a0b1c2/embed?autostart=1&ui_theme=dark',   // Charizard
      150: 'https://sketchfab.com/models/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6/embed?autostart=1&ui_theme=dark', // Mewtwo
    };
  }

  getSpriteUrl(pokemonId) {
    return `${this.baseUrl}/other/official-artwork/${pokemonId}.png`;
  }

  get3DModelUrl(pokemonId) {
    // Return SketchFab embed URL if available, otherwise null for sprite fallback
    return this.modelUrls[pokemonId] || null;
  }
}

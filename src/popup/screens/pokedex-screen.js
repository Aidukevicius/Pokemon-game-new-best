import { SpriteService } from '../../shared/services/SpriteService.js';
import { POKEMON_DATABASE, getTotalPokemonCount } from '../../shared/data/pokemon-database.js';

export class PokedexScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.spriteService = new SpriteService();
    this.pokedexData = {};
    this.stats = { total: 151, encountered: 0, caught: 0 };
    this.filterMode = 'all';
  }

  async initialize() {
    console.log('[PokedexScreen] Initializing...');
    await this.loadPokedexData();
    this.render();
  }

  async loadPokedexData() {
    try {
      const [entriesRes, statsRes] = await Promise.all([
        fetch('/api/pokedex'),
        fetch('/api/pokedex/stats')
      ]);
      this.pokedexData = await entriesRes.json();
      this.stats = await statsRes.json();
      console.log('[PokedexScreen] Loaded pokedex data:', Object.keys(this.pokedexData).length, 'entries');
    } catch (error) {
      console.error('[PokedexScreen] Error loading pokedex:', error);
      this.pokedexData = {};
    }
  }

  render() {
    const allPokemon = this.getAllGen1Pokemon();
    
    this.container.innerHTML = `
      <div class="pokedex-screen">
        <div class="snes-container pokedex-header">
          <h2 class="pokedex-title">Pokedex</h2>
          <div class="pokedex-stats">
            <span class="stat-badge encountered">Seen: ${this.stats.encountered}/${this.stats.total}</span>
            <span class="stat-badge caught">Caught: ${this.stats.caught}/${this.stats.total}</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill encountered-fill" style="width: ${this.stats.encounterPercent || 0}%"></div>
            </div>
            <span class="progress-text">${this.stats.encounterPercent || 0}% Complete</span>
          </div>
        </div>

        <div class="pokedex-controls">
          <button class="filter-btn ${this.filterMode === 'all' ? 'active' : ''}" data-filter="all">All</button>
          <button class="filter-btn ${this.filterMode === 'seen' ? 'active' : ''}" data-filter="seen">Seen</button>
          <button class="filter-btn ${this.filterMode === 'caught' ? 'active' : ''}" data-filter="caught">Caught</button>
          <button class="filter-btn ${this.filterMode === 'unseen' ? 'active' : ''}" data-filter="unseen">Unseen</button>
        </div>

        <div class="pokedex-grid" id="pokedexGrid">
          ${this.renderPokemonGrid(allPokemon)}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  getAllGen1Pokemon() {
    const pokemon = [];
    for (let id = 1; id <= 151; id++) {
      const dbEntry = POKEMON_DATABASE.find(p => p.id === id);
      const pokedexEntry = this.pokedexData[id];
      
      pokemon.push({
        id,
        name: dbEntry?.name || `Pokemon #${id}`,
        types: dbEntry?.types || ['Unknown'],
        rarity: dbEntry?.rarity || 'common',
        encountered: pokedexEntry?.encountered || false,
        caught: pokedexEntry?.caught || false,
        timesEncountered: pokedexEntry?.timesEncountered || 0,
        timesCaught: pokedexEntry?.timesCaught || 0
      });
    }
    return pokemon;
  }

  renderPokemonGrid(pokemonList) {
    let filtered = pokemonList;
    
    if (this.filterMode === 'seen') {
      filtered = pokemonList.filter(p => p.encountered);
    } else if (this.filterMode === 'caught') {
      filtered = pokemonList.filter(p => p.caught);
    } else if (this.filterMode === 'unseen') {
      filtered = pokemonList.filter(p => !p.encountered);
    }

    if (filtered.length === 0) {
      return `<div class="empty-state">No Pokemon match this filter</div>`;
    }

    return filtered.map(pokemon => this.renderPokemonCard(pokemon)).join('');
  }

  renderPokemonCard(pokemon) {
    const spriteUrl = this.spriteService.getDefaultSpriteUrl(pokemon.id);
    const isEncountered = pokemon.encountered;
    const isCaught = pokemon.caught;
    
    const cardClass = isEncountered ? (isCaught ? 'caught' : 'seen') : 'unseen';
    const rarityClass = `rarity-${pokemon.rarity}`;
    
    return `
      <div class="pokedex-card ${cardClass} ${rarityClass}" data-id="${pokemon.id}">
        <div class="card-number">#${String(pokemon.id).padStart(3, '0')}</div>
        <div class="card-sprite-container">
          <img src="${spriteUrl}" 
               alt="${isEncountered ? pokemon.name : '???'}" 
               class="pokemon-sprite ${isEncountered ? '' : 'silhouette'}"
               onerror="this.style.display='none'">
        </div>
        <div class="card-name">${isEncountered ? pokemon.name : '???'}</div>
        ${isCaught ? '<div class="caught-badge">&#9733;</div>' : ''}
      </div>
    `;
  }

  attachEventListeners() {
    const filterBtns = this.container.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterMode = btn.dataset.filter;
        this.render();
      });
    });

    const cards = this.container.querySelectorAll('.pokedex-card.seen, .pokedex-card.caught');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const pokemonId = parseInt(card.dataset.id);
        this.showPokemonDetail(pokemonId);
      });
    });
  }

  showPokemonDetail(pokemonId) {
    const pokemon = POKEMON_DATABASE.find(p => p.id === pokemonId);
    const entry = this.pokedexData[pokemonId];
    
    if (!pokemon || !entry) return;

    const spriteUrl = this.spriteService.getDefaultSpriteUrl(pokemonId);
    const typesBadges = pokemon.types.map(type => 
      `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
    ).join('');

    const overlay = document.createElement('div');
    overlay.className = 'pokedex-detail-overlay';
    overlay.innerHTML = `
      <div class="pokedex-detail-modal snes-container">
        <button class="close-btn" data-action="close">&times;</button>
        
        <div class="detail-header">
          <span class="detail-number">#${String(pokemonId).padStart(3, '0')}</span>
          <h2 class="detail-name">${pokemon.name}</h2>
          <div class="detail-types">${typesBadges}</div>
        </div>

        <div class="detail-sprite-area">
          <img src="${spriteUrl}" alt="${pokemon.name}" class="detail-sprite">
        </div>

        <div class="detail-stats-section">
          <div class="stat-row">
            <span class="stat-label">Times Encountered:</span>
            <span class="stat-value">${entry.timesEncountered}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Times Caught:</span>
            <span class="stat-value">${entry.timesCaught}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">First Seen:</span>
            <span class="stat-value">${entry.firstEncounteredAt ? new Date(entry.firstEncounteredAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          ${entry.firstCaughtAt ? `
          <div class="stat-row">
            <span class="stat-label">First Caught:</span>
            <span class="stat-value">${new Date(entry.firstCaughtAt).toLocaleDateString()}</span>
          </div>
          ` : ''}
        </div>

        <div class="detail-base-stats">
          <h3>Base Stats</h3>
          <div class="base-stat"><span>HP</span><div class="stat-bar"><div class="stat-fill" style="width: ${(pokemon.baseStats.hp / 255) * 100}%"></div></div><span>${pokemon.baseStats.hp}</span></div>
          <div class="base-stat"><span>Attack</span><div class="stat-bar"><div class="stat-fill atk" style="width: ${(pokemon.baseStats.attack / 255) * 100}%"></div></div><span>${pokemon.baseStats.attack}</span></div>
          <div class="base-stat"><span>Defense</span><div class="stat-bar"><div class="stat-fill def" style="width: ${(pokemon.baseStats.defense / 255) * 100}%"></div></div><span>${pokemon.baseStats.defense}</span></div>
          <div class="base-stat"><span>Sp.Atk</span><div class="stat-bar"><div class="stat-fill spa" style="width: ${(pokemon.baseStats.spAttack / 255) * 100}%"></div></div><span>${pokemon.baseStats.spAttack}</span></div>
          <div class="base-stat"><span>Sp.Def</span><div class="stat-bar"><div class="stat-fill spd" style="width: ${(pokemon.baseStats.spDefense / 255) * 100}%"></div></div><span>${pokemon.baseStats.spDefense}</span></div>
          <div class="base-stat"><span>Speed</span><div class="stat-bar"><div class="stat-fill spe" style="width: ${(pokemon.baseStats.speed / 255) * 100}%"></div></div><span>${pokemon.baseStats.speed}</span></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.dataset.action === 'close') {
        overlay.remove();
      }
    });
  }

  async refresh() {
    await this.loadPokedexData();
    this.render();
  }

  show() {
    this.container.style.display = 'block';
    this.refresh();
  }

  hide() {
    this.container.style.display = 'none';
  }
}

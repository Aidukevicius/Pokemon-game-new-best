
import { StorageService } from '../../shared/services/StorageService.js';
import { SpriteService } from '../../shared/services/SpriteService.js';
import { showPokemonDetail } from '../components/pokemon-detail-modal.js';

export class CollectionScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.storageService = new StorageService();
    this.spriteService = new SpriteService();
    this.caughtPokemon = [];
    this.sortBy = 'date';
  }

  async initialize() {
    console.log('[CollectionScreen] Initializing...');
    await this.loadCollection();
    this.render();
  }

  async loadCollection() {
    const collection = await this.storageService.get('pokemon_collection');
    this.caughtPokemon = collection || [];
    console.log('[CollectionScreen] Loaded collection:', this.caughtPokemon.length, 'Pokemon');
  }

  async render() {
    const stats = this.calculateStats();
    
    this.container.innerHTML = `
      <div class="collection-screen">
        <div class="snes-container collection-header">
          <h2 class="collection-title">My Collection</h2>
          <div class="collection-stats">
            <span class="stat-badge">Caught: ${stats.total}</span>
            <span class="stat-badge">Unique: ${stats.unique}</span>
          </div>
        </div>

        <div class="collection-controls">
          <select class="snes-select sort-select" id="sortSelect">
            <option value="date">Sort by Date</option>
            <option value="number">Sort by #</option>
            <option value="name">Sort by Name</option>
            <option value="level">Sort by Level</option>
          </select>
        </div>

        <div class="collection-grid" id="collectionGrid">
          ${this.caughtPokemon.length > 0 ? this.renderPokemonGrid() : this.renderEmptyState()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderPokemonGrid() {
    const sorted = this.sortCollection([...this.caughtPokemon]);
    
    return sorted.map(pokemon => {
      const spriteUrl = this.spriteService.getDefaultSpriteUrl(pokemon.id);
      const itemIndicator = pokemon.item ? '<span class="item-indicator" title="Holding item">◆</span>' : '';
      
      return `
        <div class="collection-card snes-container" data-catch-id="${pokemon.catchId || pokemon.db_id}">
          <div class="card-sprite">
            <img src="${spriteUrl}" alt="${pokemon.name}" class="pokemon-img">
            ${itemIndicator}
          </div>
          <div class="card-info">
            <span class="card-number">#${String(pokemon.id).padStart(3, '0')}</span>
            <h4 class="card-name">${pokemon.name}</h4>
            <div class="card-details">
              <span class="detail-badge">Lv.${pokemon.level}</span>
              ${pokemon.nature ? `<span class="nature-mini">${pokemon.nature}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3 class="empty-title">No Pokemon Caught Yet</h3>
        <p class="empty-text">Go catch some Pokemon to build your collection!</p>
      </div>
    `;
  }

  sortCollection(collection) {
    switch(this.sortBy) {
      case 'number':
        return collection.sort((a, b) => a.id - b.id);
      case 'name':
        return collection.sort((a, b) => a.name.localeCompare(b.name));
      case 'level':
        return collection.sort((a, b) => b.level - a.level);
      case 'date':
      default:
        return collection.sort((a, b) => (b.caughtAt || 0) - (a.caughtAt || 0));
    }
  }

  calculateStats() {
    const uniqueIds = new Set(this.caughtPokemon.map(p => p.id));
    return {
      total: this.caughtPokemon.length,
      unique: uniqueIds.size
    };
  }

  attachEventListeners() {
    const sortSelect = this.container.querySelector('#sortSelect');
    if (sortSelect) {
      sortSelect.value = this.sortBy;
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.updateGrid();
      });
    }

    const cards = this.container.querySelectorAll('.collection-card');
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const catchId = card.dataset.catchId;
        this.showPokemonDetail(catchId);
      });
    });
  }

  updateGrid() {
    const grid = this.container.querySelector('#collectionGrid');
    if (grid) {
      grid.innerHTML = this.renderPokemonGrid();
      this.attachEventListeners();
    }
  }

  showPokemonDetail(catchId) {
    const pokemon = this.caughtPokemon.find(p => 
      String(p.catchId) === String(catchId) || String(p.db_id) === String(catchId)
    );
    
    if (pokemon) {
      console.log('[CollectionScreen] Opening detail for:', pokemon.name);
      showPokemonDetail(pokemon);
    } else {
      console.warn('[CollectionScreen] Pokemon not found for catchId:', catchId);
    }
  }

  async refresh() {
    await this.loadCollection();
    this.updateGrid();
  }

  show() {
    this.container.style.display = 'block';
    this.refresh();
  }

  hide() {
    this.container.style.display = 'none';
  }
}

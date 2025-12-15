import { SpriteService } from '../../shared/services/SpriteService.js';
import { showPokemonDetail } from '../components/pokemon-detail-modal.js';

export class CollectionScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.spriteService = new SpriteService();
    this.caughtPokemon = [];
    this.partyDbIds = new Set();
    this.autoSelected = false;
    this.sortBy = 'date';
  }

  async initialize() {
    console.log('[CollectionScreen] Initializing...');
    await this.loadCollection();
    await this.loadParty();
    this.render();
  }

  async loadCollection() {
    try {
      const res = await fetch('/api/pokemon');
      this.caughtPokemon = await res.json();
      console.log('[CollectionScreen] Loaded collection:', this.caughtPokemon.length, 'Pokemon');
    } catch (error) {
      console.error('[CollectionScreen] Error loading collection:', error);
      this.caughtPokemon = [];
    }
  }

  async loadParty() {
    try {
      const res = await fetch('/api/party');
      const data = await res.json();
      this.partyDbIds = new Set(data.party_db_ids || data.party.map(p => p.db_id));
      this.autoSelected = data.auto_selected;
      console.log('[CollectionScreen] Party loaded:', this.partyDbIds.size, 'Pokemon, auto:', this.autoSelected);
    } catch (error) {
      console.error('[CollectionScreen] Error loading party:', error);
      this.partyDbIds = new Set();
      this.autoSelected = true;
    }
  }

  async render() {
    const stats = this.calculateStats();
    const partyCount = this.caughtPokemon.filter(p => p.in_party).length;
    
    this.container.innerHTML = `
      <div class="collection-screen">
        <div class="snes-container collection-header">
          <h2 class="collection-title">My Pokemon</h2>
          <div class="collection-stats">
            <span class="stat-badge">${stats.total} caught</span>
            <span class="stat-badge party-badge">${partyCount}/6 in party</span>
          </div>
        </div>

        <div class="party-info ${this.autoSelected ? 'auto-selected' : ''}">
          ${this.autoSelected 
            ? '<span class="party-hint">Top 6 highest level auto-selected. Click cards to pick your party.</span>'
            : '<span class="party-hint">Click cards to add/remove from party.</span>'
          }
        </div>

        <div class="collection-controls">
          <select class="snes-select sort-select" id="sortSelect">
            <option value="date">Sort by Date</option>
            <option value="number">Sort by #</option>
            <option value="name">Sort by Name</option>
            <option value="level">Sort by Level</option>
            <option value="party">Sort by Party</option>
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
      const isInParty = pokemon.in_party || (this.autoSelected && this.partyDbIds.has(pokemon.db_id));
      const partyClass = isInParty ? 'in-party' : '';
      const partyIndicator = isInParty ? '<span class="party-indicator" title="In Party">★</span>' : '';
      
      return `
        <div class="collection-card snes-container ${partyClass}" data-db-id="${pokemon.db_id}">
          <div class="card-sprite">
            <img src="${spriteUrl}" alt="${pokemon.name}" class="pokemon-img">
            ${itemIndicator}
            ${partyIndicator}
          </div>
          <div class="card-info">
            <span class="card-number">#${String(pokemon.id).padStart(3, '0')}</span>
            <h4 class="card-name">${pokemon.name}</h4>
            <div class="card-details">
              <span class="detail-badge">Lv.${pokemon.level}</span>
              ${isInParty ? '<span class="party-tag">PARTY</span>' : ''}
            </div>
          </div>
          <button class="party-toggle-btn ${isInParty ? 'remove' : 'add'}" data-db-id="${pokemon.db_id}" title="${isInParty ? 'Remove from party' : 'Add to party'}">
            ${isInParty ? '−' : '+'}
          </button>
        </div>
      `;
    }).join('');
  }

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3 class="empty-title">No Pokemon Caught Yet</h3>
        <p class="empty-text">Go catch some Pokemon!</p>
        <button class="snes-btn seed-btn" id="seedPokemonBtn">Add Test Pokemon</button>
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
      case 'party':
        return collection.sort((a, b) => {
          const aInParty = a.in_party || (this.autoSelected && this.partyDbIds.has(a.db_id));
          const bInParty = b.in_party || (this.autoSelected && this.partyDbIds.has(b.db_id));
          if (aInParty && !bInParty) return -1;
          if (!aInParty && bInParty) return 1;
          return b.level - a.level;
        });
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

    const seedBtn = this.container.querySelector('#seedPokemonBtn');
    if (seedBtn) {
      seedBtn.addEventListener('click', async () => {
        await this.seedPokemon();
      });
    }

    const cards = this.container.querySelectorAll('.collection-card');
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        if (e.target.closest('.party-toggle-btn')) return;
        const dbId = parseInt(card.dataset.dbId);
        this.showPokemonDetail(dbId);
      });
    });

    const partyBtns = this.container.querySelectorAll('.party-toggle-btn');
    partyBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const dbId = parseInt(btn.dataset.dbId);
        await this.toggleParty(dbId);
      });
    });
  }

  async toggleParty(dbId) {
    try {
      const res = await fetch(`/api/pokemon/${dbId}/party`, { method: 'POST' });
      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
        return;
      }
      
      await this.loadCollection();
      await this.loadParty();
      this.render();
    } catch (error) {
      console.error('[CollectionScreen] Error toggling party:', error);
    }
  }

  async seedPokemon() {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        await this.loadCollection();
        await this.loadParty();
        this.render();
      }
    } catch (error) {
      console.error('[CollectionScreen] Error seeding Pokemon:', error);
    }
  }

  updateGrid() {
    const grid = this.container.querySelector('#collectionGrid');
    if (grid) {
      grid.innerHTML = this.renderPokemonGrid();
      this.attachEventListeners();
    }
  }

  showPokemonDetail(dbId) {
    const pokemon = this.caughtPokemon.find(p => p.db_id === dbId);
    
    if (pokemon) {
      console.log('[CollectionScreen] Opening detail for:', pokemon.name);
      showPokemonDetail(pokemon, (updatedPokemon) => {
        const index = this.caughtPokemon.findIndex(p => p.db_id === updatedPokemon.db_id);
        if (index !== -1) {
          this.caughtPokemon[index] = updatedPokemon;
          this.updateGrid();
        }
      });
    } else {
      console.warn('[CollectionScreen] Pokemon not found for dbId:', dbId);
    }
  }

  async refresh() {
    await this.loadCollection();
    await this.loadParty();
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

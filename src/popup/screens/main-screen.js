import { StorageService } from '../../shared/services/StorageService.js';
import { SpriteService } from '../../shared/services/SpriteService.js';
import { showPokemonDetail } from '../components/pokemon-detail-modal.js';

export class MainScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.storageService = new StorageService();
    this.spriteService = new SpriteService();
    this.companionPokemon = null;
    this.healthInterval = null;
    this.pokemonCollection = [];
  }

  async initialize() {
    console.log('[MainScreen] Initializing...');
    await this.loadCompanionData();
    await this.loadCollection();
    console.log('[MainScreen] Companion data loaded:', this.companionPokemon);
    await this.render();
    console.log('[MainScreen] Render complete');
    this.startHealthDecay();
    console.log('[MainScreen] Health decay started');
  }

  async loadCompanionData() {
    const data = await this.storageService.get('companion');

    if (!data) {
      this.companionPokemon = {
        id: 25, // Pikachu
        name: 'Pikachu',
        level: 5,
        health: 100,
        maxHealth: 100,
        experience: 0,
        experienceToNext: 100,
        lastFed: Date.now(),
        lastInteraction: Date.now(),
        happiness: 100,
        nature: 'Hardy',
        item: null,
        evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 }
      };
      await this.storageService.set('companion', this.companionPokemon);
    } else {
      this.companionPokemon = data;
    }
  }

  async loadCollection() {
    const collection = await this.storageService.get('pokemon_collection');
    this.pokemonCollection = collection || [];
    
    // Load favorites separately
    const favorites = await this.storageService.get('favorite_pokemon');
    this.favoritePokemon = favorites || [];
  }

  async render() {
    const pokemonCount = this.getPokemonCount();
    const favoriteSlotsHTML = this.renderFavoriteSlots();
    console.log('[MainScreen] Favorite slots HTML:', favoriteSlotsHTML);

    this.container.innerHTML = `
      <div class="main-screen">
        <div class="snes-container companion-card">
          <div class="power-led" title="Power"></div>

          <div class="pokemon-display clickable" id="pokemonDisplay" data-action="view-companion" title="Click to view stats">
            ${this.render3DModel()}
          </div>

          <div class="pokemon-info">
            <h3 class="pokemon-name">${this.companionPokemon.name}</h3>
            <p class="pokemon-level">Level ${this.companionPokemon.level}</p>
          </div>
        </div>

        <div class="snes-container companion-stats">
          <div class="stat-row">
            <span class="stat-label">HEALTH</span>
            <div class="stat-bar health-bar">
              <div class="stat-fill ${this.getHealthColorClass()}" 
                   style="width: ${this.companionPokemon.health}%">
              </div>
              <span class="stat-value-overlay">${this.getHealthDisplay()}</span>
            </div>
          </div>

          <div class="stat-row">
            <span class="stat-label">EXP</span>
            <div class="stat-bar exp-bar">
              <div class="stat-fill exp-fill" 
                   style="width: ${this.getExpPercentage()}%">
              </div>
              <span class="stat-value-overlay">${this.getExpDisplay()}</span>
            </div>
          </div>

          <div class="stat-row happiness-row">
            <span class="stat-label">Mood</span>
            <span class="happiness-hearts">${this.renderHearts()}</span>
          </div>
        </div>

        <div class="snes-container pokemon-storage">
          <div class="storage-header">
            <h3 class="storage-title">Pokemon Storage</h3>
            <span class="storage-count">${pokemonCount}/151</span>
          </div>

          <div class="favorite-slots">
            ${favoriteSlotsHTML}
          </div>

          <button class="snes-button view-all-button" data-action="view-storage">
            <span class="button-text">View All Pokemon</span>
          </button>
        </div>

        <div class="status-message" id="statusMessage"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  render3DModel() {
    const spriteUrl = this.spriteService.getSpriteUrl(this.companionPokemon.id);
    const fallbackUrl = this.spriteService.getDefaultSpriteUrl(this.companionPokemon.id);

    return `
      <div class="model-container">
        <img 
          id="pokemonSprite"
          src="${spriteUrl}"
          alt="${this.companionPokemon.name}"
          class="pokemon-sprite high-quality"
          onerror="this.src='${fallbackUrl}';"
        />
      </div>
    `;
  }

  getHealthColorClass() {
    const health = this.companionPokemon.health;
    if (health > 70) return 'health-good';
    if (health > 30) return 'health-medium';
    return 'health-low';
  }

  getExpPercentage() {
    const totalForLevel = this.companionPokemon.experience + this.companionPokemon.experienceToNext;
    if (totalForLevel === 0) return 0;
    return Math.floor((this.companionPokemon.experience / totalForLevel) * 100);
  }

  getExpDisplay() {
    const expToNext = this.companionPokemon.experienceToNext || 0;
    return `${this.formatNumber(expToNext)} to next`;
  }

  getHealthDisplay() {
    const health = this.companionPokemon.health || 0;
    const maxHealth = this.companionPokemon.maxHealth || 100;
    return `${health}/${maxHealth}`;
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  renderHearts() {
    const happiness = this.companionPokemon.happiness;
    const fullHearts = Math.floor(happiness / 20);
    const emptyHearts = 5 - fullHearts;

    return '❤️'.repeat(fullHearts) + '🤍'.repeat(emptyHearts);
  }

  attachEventListeners() {
    const viewStorageBtn = this.container.querySelector('[data-action="view-storage"]');
    viewStorageBtn?.addEventListener('click', () => this.openStorage());

    const companionDisplay = this.container.querySelector('[data-action="view-companion"]');
    companionDisplay?.addEventListener('click', () => this.showCompanionDetail());

    const slots = this.container.querySelectorAll('.pokemon-slot.filled');
    slots.forEach(slot => {
      const pokemonId = slot.dataset.pokemonId;
      const dbId = slot.dataset.dbId;
      if (pokemonId || dbId) {
        slot.style.cursor = 'pointer';
        slot.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showSlotPokemonDetail(dbId, pokemonId);
        });
      }
    });
  }

  showCompanionDetail() {
    console.log('[MainScreen] Opening companion detail');
    showPokemonDetail(this.companionPokemon);
  }

  showSlotPokemonDetail(dbId, pokemonId) {
    // Check favorites first, then full collection
    let pokemon = this.favoritePokemon.find(p => 
      String(p.db_id) === String(dbId) || String(p.catchId) === String(dbId)
    );
    
    if (!pokemon) {
      pokemon = this.pokemonCollection.find(p => 
        String(p.db_id) === String(dbId) || String(p.catchId) === String(dbId)
      );
    }

    if (pokemon) {
      console.log('[MainScreen] Opening slot pokemon detail:', pokemon.name);
      showPokemonDetail(pokemon);
    } else {
      console.warn('[MainScreen] Pokemon not found for slot');
    }
  }

  getPokemonCount() {
    return this.pokemonCollection.length;
  }

  renderFavoriteSlots() {
    const favorites = this.favoritePokemon || [];

    let slotsHTML = '';
    for (let i = 0; i < 6; i++) {
      if (favorites[i]) {
        const pokemon = favorites[i];
        const spriteUrl = this.spriteService.getDefaultSpriteUrl(pokemon.id);
        const itemIndicator = pokemon.item ? '<span class="slot-item-indicator" title="Holding item">◆</span>' : '';
        slotsHTML += `
          <div class="pokemon-slot filled" 
               title="${pokemon.name} Lv.${pokemon.level}${pokemon.nature ? ' (' + pokemon.nature + ')' : ''}"
               data-pokemon-id="${pokemon.id}"
               data-db-id="${pokemon.db_id || pokemon.catchId}">
            <img src="${spriteUrl}" alt="${pokemon.name}" class="slot-sprite" />
            ${itemIndicator}
          </div>
        `;
      } else {
        slotsHTML += `
          <div class="pokemon-slot empty">
            <svg class="empty-pokeball-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke="#cbd5e1" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="3" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
              <path d="M 12 2 A 10 10 0 0 1 22 12" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
            </svg>
          </div>
        `;
      }
    }

    return slotsHTML;
  }

  async openStorage() {
    const { CollectionScreen } = await import('./collection-screen.js');
    const overlay = document.createElement('div');
    overlay.className = 'collection-overlay';
    overlay.innerHTML = `
      <div class="collection-modal">
        <button class="close-modal" data-action="close">✕</button>
        <div id="collectionContent"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const collectionContent = overlay.querySelector('#collectionContent');
    const collectionScreen = new CollectionScreen(collectionContent);
    await collectionScreen.initialize();
    collectionScreen.show();

    overlay.querySelector('.close-modal').addEventListener('click', () => {
      overlay.remove();
    });
  }

  async addExperience(amount) {
    this.companionPokemon.experience += amount;

    while (this.companionPokemon.experience >= this.companionPokemon.experienceToNext) {
      this.levelUp();
    }

    await this.saveCompanion();
    this.updateDisplay();
  }

  levelUp() {
    this.companionPokemon.level++;
    this.companionPokemon.experience -= this.companionPokemon.experienceToNext;
    this.companionPokemon.experienceToNext = Math.floor(this.companionPokemon.experienceToNext * 1.5);
    this.companionPokemon.maxHealth += 5;
    this.companionPokemon.health = this.companionPokemon.maxHealth;

    this.showMessage(`${this.companionPokemon.name} leveled up to ${this.companionPokemon.level}! 🎉`, 'success');
  }

  startHealthDecay() {
    this.healthInterval = setInterval(async () => {
      const timeSinceLastFed = Date.now() - this.companionPokemon.lastFed;
      const hoursWithoutFood = timeSinceLastFed / (1000 * 60 * 60);

      if (hoursWithoutFood > 1) {
        this.companionPokemon.health = Math.max(0, this.companionPokemon.health - 1);
        this.companionPokemon.happiness = Math.max(0, this.companionPokemon.happiness - 1);

        await this.saveCompanion();
        this.updateDisplay();
      }
    }, 60000);
  }

  updateDisplay() {
    const healthFill = this.container.querySelector('.health-bar .stat-fill');
    const expFill = this.container.querySelector('.exp-bar .stat-fill');
    const hearts = this.container.querySelector('.happiness-hearts');
    const levelText = this.container.querySelector('.pokemon-level');

    if (healthFill) {
      healthFill.style.width = `${this.companionPokemon.health}%`;
      healthFill.className = `stat-fill ${this.getHealthColorClass()}`;
      const healthOverlay = this.container.querySelector('.health-bar .stat-value-overlay');
      if (healthOverlay) {
        healthOverlay.textContent = this.getHealthDisplay();
      }
    }

    if (expFill) {
      expFill.style.width = `${this.getExpPercentage()}%`;
      const expOverlay = this.container.querySelector('.exp-bar .stat-value-overlay');
      if (expOverlay) {
        expOverlay.textContent = this.getExpDisplay();
      }
    }

    if (hearts) {
      hearts.innerHTML = this.renderHearts();
    }

    if (levelText) {
      levelText.textContent = `Level ${this.companionPokemon.level}`;
    }
  }

  showMessage(message, type = 'info') {
    const messageEl = this.container.querySelector('#statusMessage');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `status-message ${type}`;
      messageEl.style.display = 'block';

      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 3000);
    }
  }

  async saveCompanion() {
    try {
      await fetch('/api/companion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          health: this.companionPokemon.health,
          happiness: this.companionPokemon.happiness,
          last_fed: this.companionPokemon.lastFed ? new Date(this.companionPokemon.lastFed).toISOString() : null,
          last_interaction: this.companionPokemon.lastInteraction ? new Date(this.companionPokemon.lastInteraction).toISOString() : null
        })
      });
    } catch (error) {
      console.error('[MainScreen] Error saving companion:', error);
    }
  }

  async show() {
    console.log('[MainScreen] show() called');
    await this.loadCompanionData();
    await this.loadCollection();
    this.container.style.display = 'block';
    await this.render();
    console.log('[MainScreen] display updated with fresh data');
  }

  hide() {
    this.container.style.display = 'none';
  }

  destroy() {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
    }
  }
}
// MAIN SCREEN COMPONENT - Companion Pokemon Display
// Display user's main Pokemon with level, health, and interactions

import { StorageService } from '../../shared/services/StorageService.js';
import { SpriteService } from '../../shared/services/SpriteService.js';

export class MainScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.storageService = new StorageService();
    this.spriteService = new SpriteService();
    this.companionPokemon = null;
    this.healthInterval = null;
  }

  async initialize() {
    console.log('[MainScreen] Initializing...');
    await this.loadCompanionData();
    console.log('[MainScreen] Companion data loaded:', this.companionPokemon);
    await this.render();
    console.log('[MainScreen] Render complete');
    this.startHealthDecay();
    console.log('[MainScreen] Health decay started');
  }

  async loadCompanionData() {
    // Load companion Pokemon from storage
    const data = await this.storageService.get('companion');
    
    if (!data) {
      // Create default starter companion (Pikachu)
      this.companionPokemon = {
        id: 25,
        name: 'Pikachu',
        level: 1,
        health: 100,
        maxHealth: 100,
        experience: 0,
        experienceToNext: 100,
        lastFed: Date.now(),
        lastInteraction: Date.now(),
        happiness: 100
      };
      await this.storageService.set('companion', this.companionPokemon);
    } else {
      this.companionPokemon = data;
    }
  }

  async render() {
    const pokemonCount = await this.getPokemonCount();
    const favoriteSlotsHTML = await this.renderFavoriteSlots();
    console.log('[MainScreen] Favorite slots HTML:', favoriteSlotsHTML);
    
    this.container.innerHTML = `
      <div class="main-screen">
        <!-- Pokemon Display Card -->
        <div class="snes-container companion-card">
          <!-- Game Boy Power LED -->
          <div class="power-led" title="Power"></div>
          
          <!-- Pokemon 3D Model / Sprite -->
          <div class="pokemon-display" id="pokemonDisplay">
            ${this.render3DModel()}
          </div>

          <!-- Pokemon Info -->
          <div class="pokemon-info">
            <h3 class="pokemon-name">${this.companionPokemon.name}</h3>
            <p class="pokemon-level">Level ${this.companionPokemon.level}</p>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="snes-container companion-stats">
          <!-- Health Bar -->
          <div class="stat-row">
            <span class="stat-label">Health</span>
            <div class="stat-bar health-bar">
              <div class="stat-fill ${this.getHealthColorClass()}" 
                   style="width: ${this.companionPokemon.health}%">
                <span class="stat-value">${this.companionPokemon.health}%</span>
              </div>
            </div>
          </div>

          <!-- Experience Bar -->
          <div class="stat-row">
            <span class="stat-label">EXP</span>
            <div class="stat-bar exp-bar">
              <div class="stat-fill exp-fill" 
                   style="width: ${this.getExpPercentage()}%">
                <span class="stat-value">${this.companionPokemon.experience}/${this.companionPokemon.experienceToNext}</span>
              </div>
            </div>
          </div>

          <!-- Happiness Indicator -->
          <div class="stat-row happiness-row">
            <span class="stat-label">Mood</span>
            <span class="happiness-hearts">${this.renderHearts()}</span>
          </div>
        </div>

        <!-- Pokemon Storage Section -->
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

        <!-- Status Messages -->
        <div class="status-message" id="statusMessage"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  render3DModel() {
    const spriteUrl = this.spriteService.getSpriteUrl(this.companionPokemon.id);
    const animatedUrl = this.spriteService.getAnimatedSpriteUrl(this.companionPokemon.id);
    const fallbackUrl = this.spriteService.getDefaultSpriteUrl(this.companionPokemon.id);
    
    return `
      <div class="model-container">
        <img 
          id="pokemonSprite"
          src="${spriteUrl}"
          alt="${this.companionPokemon.name}"
          class="pokemon-sprite"
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
    return Math.floor((this.companionPokemon.experience / this.companionPokemon.experienceToNext) * 100);
  }

  renderHearts() {
    const happiness = this.companionPokemon.happiness;
    const fullHearts = Math.floor(happiness / 20); // 5 hearts max
    const emptyHearts = 5 - fullHearts;
    
    return '❤️'.repeat(fullHearts) + '🤍'.repeat(emptyHearts);
  }

  attachEventListeners() {
    const viewStorageBtn = this.container.querySelector('[data-action="view-storage"]');
    viewStorageBtn?.addEventListener('click', () => this.openStorage());
  }

  async getPokemonCount() {
    const collection = await this.storageService.get('pokemon_collection');
    return collection ? collection.length : 0;
  }

  async renderFavoriteSlots() {
    const collection = await this.storageService.get('pokemon_collection');
    const favorites = collection ? collection.slice(0, 6) : [];
    
    let slotsHTML = '';
    for (let i = 0; i < 6; i++) {
      if (favorites[i]) {
        const pokemon = favorites[i];
        const spriteUrl = this.spriteService.getDefaultSpriteUrl(pokemon.id);
        slotsHTML += `
          <div class="pokemon-slot filled" title="${pokemon.name} Lv.${pokemon.level}">
            <img src="${spriteUrl}" alt="${pokemon.name}" class="slot-sprite" />
            <span class="slot-name">${pokemon.name.slice(0, 3)}</span>
          </div>
        `;
      } else {
        slotsHTML += `
          <div class="pokemon-slot empty">
            <span class="empty-icon">?</span>
          </div>
        `;
      }
    }
    
    return slotsHTML;
  }

  async openStorage() {
    // Show collection as an overlay/modal
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
    // Called when catching Pokemon
    this.companionPokemon.experience += amount;

    // Check for level up
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
    // Health decreases slowly over time if not fed
    this.healthInterval = setInterval(async () => {
      const timeSinceLastFed = Date.now() - this.companionPokemon.lastFed;
      const hoursWithoutFood = timeSinceLastFed / (1000 * 60 * 60);

      // Decrease health by 1% per hour without food
      if (hoursWithoutFood > 1) {
        this.companionPokemon.health = Math.max(0, this.companionPokemon.health - 1);
        this.companionPokemon.happiness = Math.max(0, this.companionPokemon.happiness - 1);
        
        await this.saveCompanion();
        this.updateDisplay();
      }
    }, 60000); // Check every minute
  }

  updateDisplay() {
    // Re-render stats without full page refresh
    const healthFill = this.container.querySelector('.health-bar .stat-fill');
    const expFill = this.container.querySelector('.exp-bar .stat-fill');
    const hearts = this.container.querySelector('.happiness-hearts');
    const levelText = this.container.querySelector('.pokemon-level');

    if (healthFill) {
      healthFill.style.width = `${this.companionPokemon.health}%`;
      healthFill.className = `stat-fill ${this.getHealthColorClass()}`;
      healthFill.querySelector('.stat-value').textContent = `${this.companionPokemon.health}%`;
    }

    if (expFill) {
      expFill.style.width = `${this.getExpPercentage()}%`;
      expFill.querySelector('.stat-value').textContent = 
        `${this.companionPokemon.experience}/${this.companionPokemon.experienceToNext}`;
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
    await this.storageService.set('companion', this.companionPokemon);
  }

  show() {
    console.log('[MainScreen] show() called');
    console.log('[MainScreen] container:', this.container);
    this.container.style.display = 'block';
    console.log('[MainScreen] display set to block');
    this.updateDisplay();
    console.log('[MainScreen] display updated');
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

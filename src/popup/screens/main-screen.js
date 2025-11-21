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
    this.render();
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

  render() {
    this.container.innerHTML = `
      <div class="main-screen">
        <!-- Pokemon Display Card -->
        <div class="snes-container companion-card">
          <!-- Pokemon 3D Model / Sprite -->
          <div class="pokemon-display">
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

        <!-- Interaction Buttons -->
        <div class="interaction-buttons">
          <button class="snes-button feed-button" data-action="feed">
            <span class="button-icon">🍎</span>
            <span class="button-text">Feed</span>
          </button>
          <button class="snes-button play-button" data-action="play">
            <span class="button-icon">🎮</span>
            <span class="button-text">Play</span>
          </button>
          <button class="snes-button heal-button" data-action="heal">
            <span class="button-icon">💊</span>
            <span class="button-text">Heal</span>
          </button>
        </div>

        <!-- Status Messages -->
        <div class="status-message" id="statusMessage"></div>

        <!-- Info Footer -->
        <div class="snes-container companion-info">
          <p class="info-text">
            💡 Your companion gains XP when you catch Pokemon!
            Keep them healthy and happy for better bonuses.
          </p>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  render3DModel() {
    const modelUrl = this.spriteService.get3DModelUrl(this.companionPokemon.id);
    
    if (modelUrl) {
      // Use 3D animated sprite if available
      return `
        <div class="model-container">
          <img 
            id="pokemon3DSprite"
            src="${modelUrl}"
            alt="${this.companionPokemon.name}"
            class="pokemon-3d-sprite"
            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.companionPokemon.id}.png'; this.className='pokemon-sprite pixel-art';"
          />
        </div>
      `;
    } else {
      // Fallback to 2D sprite
      return `
        <div class="model-container">
          <img 
            id="pokemonSprite"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.companionPokemon.id}.png"
            alt="${this.companionPokemon.name}"
            class="pokemon-sprite pixel-art"
            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.companionPokemon.id}.png'"
          />
        </div>
      `;
    }
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
    const feedBtn = this.container.querySelector('[data-action="feed"]');
    const playBtn = this.container.querySelector('[data-action="play"]');
    const healBtn = this.container.querySelector('[data-action="heal"]');

    feedBtn?.addEventListener('click', () => this.feedPokemon());
    playBtn?.addEventListener('click', () => this.playWithPokemon());
    healBtn?.addEventListener('click', () => this.healPokemon());
  }

  async feedPokemon() {
    // Restore 20 health and 10 happiness
    this.companionPokemon.health = Math.min(100, this.companionPokemon.health + 20);
    this.companionPokemon.happiness = Math.min(100, this.companionPokemon.happiness + 10);
    this.companionPokemon.lastFed = Date.now();

    await this.saveCompanion();
    this.showMessage(`${this.companionPokemon.name} enjoyed the food! ❤️`, 'success');
    this.updateDisplay();
  }

  async playWithPokemon() {
    // Increase happiness, slight health decrease
    this.companionPokemon.happiness = Math.min(100, this.companionPokemon.happiness + 15);
    this.companionPokemon.health = Math.max(0, this.companionPokemon.health - 5);
    this.companionPokemon.lastInteraction = Date.now();

    await this.saveCompanion();
    this.showMessage(`${this.companionPokemon.name} is having fun! 🎮`, 'success');
    this.updateDisplay();
  }

  async healPokemon() {
    // Check if player has potions (future: check inventory)
    // For now, just heal
    this.companionPokemon.health = 100;
    
    await this.saveCompanion();
    this.showMessage(`${this.companionPokemon.name} is fully healed! 💊`, 'success');
    this.updateDisplay();
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

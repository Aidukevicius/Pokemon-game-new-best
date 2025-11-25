// Search/Encounter Screen - Show available Pokemon encounters
import { StorageService } from '../../shared/services/StorageService.js';
import { CatchService } from '../../shared/services/CatchService.js';
import { SpriteService } from '../../shared/services/SpriteService.js';

export class SearchScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.storage = new StorageService();
    this.catchService = new CatchService();
    this.spriteService = new SpriteService();
    this.currentEncounter = null;
  }

  async initialize() {
    await this.render();
  }

  async render() {
    // Check for available encounters
    const queue = await this.storage.get('encounterQueue') || [];
    
    if (queue.length === 0) {
      this.renderNoEncounters();
    } else {
      this.currentEncounter = queue[0];
      this.renderEncounter(this.currentEncounter);
    }
  }

  renderNoEncounters() {
    this.container.innerHTML = `
      <div class="search-screen">
        <div class="snes-container no-encounters">
          <h2>🔍 No Wild Pokemon</h2>
          <p class="info-text">Browse the web to encounter wild Pokemon!</p>
          <p class="hint-text">Visit <strong>3 different websites</strong> to trigger an encounter.</p>
          
          <div class="encounter-tips">
            <h3>Tips:</h3>
            <ul>
              <li>Keep browsing to find Pokemon</li>
              <li>Rarer Pokemon appear less frequently</li>
              <li>Stock up on Pokeballs in the Shop</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderEncounter(encounter) {
    const spriteUrl = this.spriteService.getSpriteUrl(encounter.pokemon.id);
    const catchRate = this.catchService.getCatchRatePercentage(encounter, 'pokeball');
    
    this.container.innerHTML = `
      <div class="search-screen encounter-screen">
        <!-- Wild Pokemon Appeared -->
        <div class="encounter-header">
          <h2>⚡ Wild ${encounter.pokemon.name} appeared!</h2>
          <span class="encounter-level">Lv. ${encounter.level}</span>
        </div>

        <!-- Pokemon Display -->
        <div class="snes-container encounter-display">
          <div class="pokemon-sprite-container">
            <img src="${spriteUrl}" 
                 alt="${encounter.pokemon.name}" 
                 class="encounter-sprite"
                 onerror="this.src='${this.spriteService.getDefaultSpriteUrl(encounter.pokemon.id)}';">
          </div>
          
          <!-- Pokemon Info -->
          <div class="encounter-info">
            <div class="info-row">
              <span class="label">Type:</span>
              <div class="types">
                ${encounter.pokemon.types.map(type => 
                  `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
                ).join('')}
              </div>
            </div>
            
            <div class="info-row">
              <span class="label">Nature:</span>
              <span class="value">${encounter.nature}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Rarity:</span>
              <span class="rarity-badge rarity-${encounter.pokemon.rarity}">${encounter.pokemon.rarity}</span>
            </div>
          </div>

          <!-- HP Bar -->
          <div class="hp-container">
            <div class="hp-bar">
              <div class="hp-fill" style="width: ${(encounter.currentHp / encounter.maxHp) * 100}%">
                <span class="hp-text">${encounter.currentHp} / ${encounter.maxHp} HP</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Preview -->
        <div class="snes-container stats-preview">
          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-name">HP</span>
              <span class="stat-value">${encounter.stats.hp}</span>
            </div>
            <div class="stat-item">
              <span class="stat-name">ATK</span>
              <span class="stat-value">${encounter.stats.attack}</span>
            </div>
            <div class="stat-item">
              <span class="stat-name">DEF</span>
              <span class="stat-value">${encounter.stats.defense}</span>
            </div>
            <div class="stat-item">
              <span class="stat-name">SP.A</span>
              <span class="stat-value">${encounter.stats.spAttack}</span>
            </div>
            <div class="stat-item">
              <span class="stat-name">SP.D</span>
              <span class="stat-value">${encounter.stats.spDefense}</span>
            </div>
            <div class="stat-item">
              <span class="stat-name">SPD</span>
              <span class="stat-value">${encounter.stats.speed}</span>
            </div>
          </div>
        </div>

        <!-- Catch Rate Indicator -->
        <div class="catch-rate-indicator">
          <span class="catch-label">Catch Rate:</span>
          <div class="catch-bar">
            <div class="catch-fill" style="width: ${catchRate}%"></div>
          </div>
          <span class="catch-percentage">${catchRate}%</span>
        </div>

        <!-- Action Buttons -->
        <div class="encounter-actions">
          <button class="snes-button catch-button" data-action="catch">
            <span class="button-icon">⚾</span>
            <span class="button-text">Throw Pokéball</span>
          </button>
          <button class="snes-button run-button" data-action="run">
            <span class="button-icon">🏃</span>
            <span class="button-text">Run Away</span>
          </button>
        </div>

        <!-- Status Message -->
        <div class="encounter-status" id="encounterStatus"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const catchBtn = this.container.querySelector('[data-action="catch"]');
    const runBtn = this.container.querySelector('[data-action="run"]');

    catchBtn?.addEventListener('click', () => this.attemptCatch());
    runBtn?.addEventListener('click', () => this.runAway());
  }

  async attemptCatch() {
    const statusEl = this.container.querySelector('#encounterStatus');
    const catchBtn = this.container.querySelector('[data-action="catch"]');
    
    catchBtn.disabled = true;
    statusEl.textContent = 'Throwing Pokéball...';
    statusEl.className = 'encounter-status';
    
    // Attempt catch
    const result = await this.catchService.attemptCatch(this.currentEncounter);
    
    if (result.success) {
      statusEl.textContent = `✨ ${result.message} +${result.coinReward} coins!`;
      statusEl.className = 'encounter-status success';
      
      // Clear encounter from queue
      await this.clearCurrentEncounter();
      
      // Reload after delay
      setTimeout(() => {
        this.render();
      }, 2000);
    } else {
      if (result.reason === 'no_pokeballs') {
        statusEl.textContent = `❌ ${result.message} Visit the Shop!`;
        statusEl.className = 'encounter-status error';
      } else {
        statusEl.textContent = `💨 ${result.message} Try again!`;
        statusEl.className = 'encounter-status fail';
      }
      catchBtn.disabled = false;
    }
  }

  async runAway() {
    const statusEl = this.container.querySelector('#encounterStatus');
    statusEl.textContent = '🏃 You ran away safely!';
    statusEl.className = 'encounter-status';
    
    await this.clearCurrentEncounter();
    
    setTimeout(() => {
      this.render();
    }, 1000);
  }

  async clearCurrentEncounter() {
    // Remove first encounter from queue
    chrome.runtime.sendMessage({ action: 'clearEncounter' });
  }

  show() {
    this.container.style.display = 'block';
    this.render();
  }

  hide() {
    this.container.style.display = 'none';
  }
}

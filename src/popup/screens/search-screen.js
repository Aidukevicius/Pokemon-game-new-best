import { StorageService } from '../../shared/services/StorageService.js';
import { CatchService } from '../../shared/services/CatchService.js';
import { SpriteService } from '../../shared/services/SpriteService.js';
import { EncounterService } from '../../shared/services/EncounterService.js';

export class SearchScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.storage = new StorageService();
    this.catchService = new CatchService();
    this.spriteService = new SpriteService();
    this.encounterService = new EncounterService();
    this.currentEncounter = null;
    this.isSearching = false;
  }

  async initialize() {
    console.log('[SearchScreen] Initializing...');
    await this.loadEncounterQueue();
    this.render();
  }

  async loadEncounterQueue() {
    this.encounterQueue = await this.storage.get('encounterQueue') || [];
  }

  render() {
    if (this.currentEncounter) {
      this.renderEncounter(this.currentEncounter);
    } else if (this.encounterQueue && this.encounterQueue.length > 0) {
      this.currentEncounter = this.encounterQueue[0];
      this.renderEncounter(this.currentEncounter);
    } else {
      this.renderSearchMode();
    }
  }

  renderSearchMode() {
    this.container.innerHTML = `
      <div class="search-screen">
        <div class="snes-container search-header">
          <h2 class="search-title">Pokemon Search</h2>
          <div class="search-status ${this.isSearching ? 'active' : ''}">
            ${this.isSearching ? '🔍 Searching...' : '⏸️ Paused'}
          </div>
        </div>

        <div class="search-content">
          <div class="search-toggle-section">
            <div class="toggle-info">
              <h3>${this.isSearching ? 'Searching for Pokemon!' : 'Start Searching'}</h3>
              <p class="toggle-desc">
                ${this.isSearching 
                  ? 'Wild Pokemon may appear as you browse!' 
                  : 'Enable search mode to find wild Pokemon while browsing the web.'}
              </p>
            </div>
            <button class="snes-btn toggle-search-btn ${this.isSearching ? 'active' : ''}" id="toggleSearchBtn">
              ${this.isSearching ? 'Stop Search' : 'Start Search'}
            </button>
          </div>

          <div class="encounter-tips-section">
            <h3>How it works:</h3>
            <ul class="tips-list">
              <li><span class="tip-icon">🌐</span> Browse different websites to find Pokemon</li>
              <li><span class="tip-icon">⚡</span> Website types affect which Pokemon appear</li>
              <li><span class="tip-icon">✨</span> Rare Pokemon are harder to find!</li>
              <li><span class="tip-icon">⚾</span> Use Pokeballs from the Shop to catch them</li>
            </ul>
          </div>

          <div class="test-encounter-section">
            <h3>Testing Mode</h3>
            <p class="test-desc">Trigger a test encounter to try the catching system:</p>
            <div class="test-buttons">
              <button class="snes-btn test-btn" id="testCommonBtn" data-rarity="common">Common</button>
              <button class="snes-btn test-btn" id="testUncommonBtn" data-rarity="uncommon">Uncommon</button>
              <button class="snes-btn test-btn" id="testRareBtn" data-rarity="rare">Rare</button>
              <button class="snes-btn test-btn legendary" id="testLegendaryBtn" data-rarity="legendary">Legendary</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachSearchListeners();
  }

  renderEncounter(encounter) {
    const spriteUrl = this.spriteService.getSpriteUrl(encounter.pokemon.id);
    const catchRate = this.catchService.getCatchRatePercentage(encounter, 'pokeball');
    
    this.container.innerHTML = `
      <div class="search-screen encounter-active">
        <div class="encounter-header">
          <h2>⚡ Wild ${encounter.pokemon.name} appeared!</h2>
          <span class="encounter-level">Lv. ${encounter.level}</span>
        </div>

        <div class="snes-container encounter-display">
          <div class="pokemon-sprite-container">
            <img src="${spriteUrl}" 
                 alt="${encounter.pokemon.name}" 
                 class="encounter-sprite"
                 onerror="this.src='${this.spriteService.getDefaultSpriteUrl(encounter.pokemon.id)}';">
          </div>
          
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

          <div class="hp-container">
            <div class="hp-bar">
              <div class="hp-fill" style="width: ${(encounter.currentHp / encounter.maxHp) * 100}%">
                <span class="hp-text">${encounter.currentHp} / ${encounter.maxHp} HP</span>
              </div>
            </div>
          </div>
        </div>

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

        <div class="catch-rate-indicator">
          <span class="catch-label">Catch Rate:</span>
          <div class="catch-bar">
            <div class="catch-fill" style="width: ${catchRate}%"></div>
          </div>
          <span class="catch-percentage">${catchRate}%</span>
        </div>

        <div class="encounter-actions">
          <button class="snes-btn catch-button" data-action="catch">
            <span class="button-icon">⚾</span>
            <span class="button-text">Throw Pokeball</span>
          </button>
          <button class="snes-btn run-button" data-action="run">
            <span class="button-icon">🏃</span>
            <span class="button-text">Run Away</span>
          </button>
        </div>

        <div class="encounter-status" id="encounterStatus"></div>
      </div>
    `;

    this.attachEncounterListeners();
  }

  attachSearchListeners() {
    const toggleBtn = this.container.querySelector('#toggleSearchBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleSearch());
    }

    const testBtns = this.container.querySelectorAll('.test-btn');
    testBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rarity = btn.dataset.rarity;
        this.triggerTestEncounter(rarity);
      });
    });
  }

  attachEncounterListeners() {
    const catchBtn = this.container.querySelector('[data-action="catch"]');
    const runBtn = this.container.querySelector('[data-action="run"]');

    catchBtn?.addEventListener('click', () => this.attemptCatch());
    runBtn?.addEventListener('click', () => this.runAway());
  }

  toggleSearch() {
    this.isSearching = !this.isSearching;
    this.storage.set('isSearching', this.isSearching);
    console.log('[SearchScreen] Search mode:', this.isSearching ? 'ON' : 'OFF');
    this.render();
  }

  async triggerTestEncounter(rarity = 'common') {
    console.log('[SearchScreen] Triggering test encounter:', rarity);
    
    const encounter = this.encounterService.generateEncounter('normal');
    
    if (rarity !== 'common') {
      const targetPokemon = this.getRandomPokemonByRarity(rarity);
      if (targetPokemon) {
        encounter.pokemon = targetPokemon;
        encounter.level = this.getRandomLevel(rarity);
        const stats = this.encounterService.calculateStatsOfficial(
          targetPokemon.baseStats, 
          encounter.ivs, 
          encounter.evs, 
          encounter.level, 
          encounter.nature
        );
        encounter.stats = stats;
        encounter.currentHp = stats.hp;
        encounter.maxHp = stats.hp;
      }
    }
    
    this.currentEncounter = encounter;
    this.render();
  }

  getRandomPokemonByRarity(rarity) {
    const { POKEMON_DATABASE } = this.getPokemonDatabase();
    const filtered = POKEMON_DATABASE.filter(p => p.rarity === rarity);
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  getRandomLevel(rarity) {
    switch (rarity) {
      case 'common': return Math.floor(Math.random() * 30) + 1;
      case 'uncommon': return Math.floor(Math.random() * 35) + 10;
      case 'rare': return Math.floor(Math.random() * 40) + 20;
      case 'legendary': return Math.floor(Math.random() * 20) + 50;
      default: return 10;
    }
  }

  getPokemonDatabase() {
    return {
      POKEMON_DATABASE: [
        { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], baseStats: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45 }, catchRate: 45, rarity: 'uncommon' },
        { id: 4, name: 'Charmander', types: ['Fire'], baseStats: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 }, catchRate: 45, rarity: 'uncommon' },
        { id: 7, name: 'Squirtle', types: ['Water'], baseStats: { hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43 }, catchRate: 45, rarity: 'uncommon' },
        { id: 10, name: 'Caterpie', types: ['Bug'], baseStats: { hp: 45, attack: 30, defense: 35, spAttack: 20, spDefense: 20, speed: 45 }, catchRate: 255, rarity: 'common' },
        { id: 16, name: 'Pidgey', types: ['Normal', 'Flying'], baseStats: { hp: 40, attack: 45, defense: 40, spAttack: 35, spDefense: 35, speed: 56 }, catchRate: 255, rarity: 'common' },
        { id: 19, name: 'Rattata', types: ['Normal'], baseStats: { hp: 30, attack: 56, defense: 35, spAttack: 25, spDefense: 35, speed: 72 }, catchRate: 255, rarity: 'common' },
        { id: 25, name: 'Pikachu', types: ['Electric'], baseStats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 }, catchRate: 190, rarity: 'uncommon' },
        { id: 39, name: 'Jigglypuff', types: ['Normal', 'Fairy'], baseStats: { hp: 115, attack: 45, defense: 20, spAttack: 45, spDefense: 25, speed: 20 }, catchRate: 170, rarity: 'uncommon' },
        { id: 52, name: 'Meowth', types: ['Normal'], baseStats: { hp: 40, attack: 45, defense: 35, spAttack: 40, spDefense: 40, speed: 90 }, catchRate: 255, rarity: 'common' },
        { id: 94, name: 'Gengar', types: ['Ghost', 'Poison'], baseStats: { hp: 60, attack: 65, defense: 60, spAttack: 130, spDefense: 75, speed: 110 }, catchRate: 45, rarity: 'rare' },
        { id: 129, name: 'Magikarp', types: ['Water'], baseStats: { hp: 20, attack: 10, defense: 55, spAttack: 15, spDefense: 20, speed: 80 }, catchRate: 255, rarity: 'common' },
        { id: 133, name: 'Eevee', types: ['Normal'], baseStats: { hp: 55, attack: 55, defense: 50, spAttack: 45, spDefense: 65, speed: 55 }, catchRate: 45, rarity: 'rare' },
        { id: 143, name: 'Snorlax', types: ['Normal'], baseStats: { hp: 160, attack: 110, defense: 65, spAttack: 65, spDefense: 110, speed: 30 }, catchRate: 25, rarity: 'rare' },
        { id: 149, name: 'Dragonite', types: ['Dragon', 'Flying'], baseStats: { hp: 91, attack: 134, defense: 95, spAttack: 100, spDefense: 100, speed: 80 }, catchRate: 45, rarity: 'rare' },
        { id: 150, name: 'Mewtwo', types: ['Psychic'], baseStats: { hp: 106, attack: 110, defense: 90, spAttack: 154, spDefense: 90, speed: 130 }, catchRate: 3, rarity: 'legendary' },
        { id: 151, name: 'Mew', types: ['Psychic'], baseStats: { hp: 100, attack: 100, defense: 100, spAttack: 100, spDefense: 100, speed: 100 }, catchRate: 45, rarity: 'legendary' },
        { id: 144, name: 'Articuno', types: ['Ice', 'Flying'], baseStats: { hp: 90, attack: 85, defense: 100, spAttack: 95, spDefense: 125, speed: 85 }, catchRate: 3, rarity: 'legendary' },
        { id: 145, name: 'Zapdos', types: ['Electric', 'Flying'], baseStats: { hp: 90, attack: 90, defense: 85, spAttack: 125, spDefense: 90, speed: 100 }, catchRate: 3, rarity: 'legendary' },
        { id: 146, name: 'Moltres', types: ['Fire', 'Flying'], baseStats: { hp: 90, attack: 100, defense: 90, spAttack: 125, spDefense: 85, speed: 90 }, catchRate: 3, rarity: 'legendary' }
      ]
    };
  }

  async attemptCatch() {
    const statusEl = this.container.querySelector('#encounterStatus');
    const catchBtn = this.container.querySelector('[data-action="catch"]');
    
    if (!this.currentEncounter) return;
    
    catchBtn.disabled = true;
    statusEl.textContent = 'Throwing Pokeball...';
    statusEl.className = 'encounter-status throwing';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = await this.catchService.attemptCatch(this.currentEncounter);
    
    if (result.success) {
      statusEl.innerHTML = `<span class="success-icon">✨</span> ${result.message} <span class="coin-reward">+${result.coinReward} coins!</span>`;
      statusEl.className = 'encounter-status success';
      
      await this.saveCaughtPokemonToServer(this.currentEncounter);
      
      setTimeout(() => {
        this.currentEncounter = null;
        this.render();
      }, 2500);
    } else {
      if (result.reason === 'no_pokeballs') {
        statusEl.innerHTML = `<span class="error-icon">❌</span> ${result.message}`;
        statusEl.className = 'encounter-status error';
      } else {
        statusEl.innerHTML = `<span class="escape-icon">💨</span> ${result.message}`;
        statusEl.className = 'encounter-status escaped';
        catchBtn.disabled = false;
      }
    }
  }

  async saveCaughtPokemonToServer(encounter) {
    try {
      const pokemonData = {
        id: encounter.pokemon.id,
        name: encounter.pokemon.name,
        level: encounter.level,
        nature: encounter.nature,
        caughtAt: new Date().toISOString(),
        ivs: encounter.ivs,
        evs: encounter.evs
      };
      
      await this.storage.addPokemon(pokemonData);
      console.log('[SearchScreen] Pokemon saved to collection');
    } catch (error) {
      console.error('[SearchScreen] Error saving pokemon:', error);
    }
  }

  async runAway() {
    const statusEl = this.container.querySelector('#encounterStatus');
    statusEl.textContent = '🏃 You ran away safely!';
    statusEl.className = 'encounter-status escaped';
    
    setTimeout(() => {
      this.currentEncounter = null;
      this.render();
    }, 1000);
  }

  show() {
    this.container.style.display = 'block';
    this.loadEncounterQueue().then(() => this.render());
  }

  hide() {
    this.container.style.display = 'none';
  }
}

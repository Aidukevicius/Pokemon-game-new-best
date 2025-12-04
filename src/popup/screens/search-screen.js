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
    this.companion = null;
    this.battleLog = [];
  }

  async initialize() {
    console.log('[SearchScreen] Initializing...');
    await this.loadCompanion();
    await this.loadEncounterQueue();
    this.render();
  }

  async loadCompanion() {
    try {
      this.companion = await this.storage.get('companion');
      console.log('[SearchScreen] Companion loaded:', this.companion?.name);
    } catch (error) {
      console.error('[SearchScreen] Error loading companion:', error);
    }
  }

  async loadEncounterQueue() {
    this.encounterQueue = await this.storage.get('encounterQueue') || [];
  }

  render() {
    if (this.currentEncounter) {
      this.renderBattleEncounter(this.currentEncounter);
    } else if (this.encounterQueue && this.encounterQueue.length > 0) {
      this.currentEncounter = this.encounterQueue[0];
      this.renderBattleEncounter(this.currentEncounter);
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
              <li><span class="tip-icon">⚔️</span> Battle wild Pokemon to weaken them</li>
              <li><span class="tip-icon">❤️</span> Lower HP = Higher catch rate!</li>
              <li><span class="tip-icon">⚡</span> Your companion fights for you</li>
              <li><span class="tip-icon">⚾</span> Throw Pokeballs when HP is low</li>
            </ul>
          </div>

          <div class="test-encounter-section">
            <h3>Testing Mode</h3>
            <p class="test-desc">Trigger a test encounter to battle and catch:</p>
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

  renderBattleEncounter(encounter) {
    const spriteUrl = this.spriteService.getSpriteUrl(encounter.pokemon.id);
    const hpPercent = (encounter.currentHp / encounter.maxHp) * 100;
    const companionHpPercent = this.companion ? (this.companion.health / 100) * 100 : 100;
    
    const moves = this.getCompanionMoves();
    const enemyTypes = encounter.pokemon.types || ['Normal'];
    
    this.container.innerHTML = `
      <div class="search-screen battle-mode">
        <div class="battle-field-large">
          <div class="enemy-pokemon-large">
            <div class="pokemon-info-plate">
              <div class="name-level">
                <span class="poke-name">${encounter.pokemon.name}</span>
                <span class="poke-level">Lv.${encounter.level}</span>
              </div>
              <div class="hp-bar-container">
                <div class="hp-label">HP</div>
                <div class="hp-bar">
                  <div class="hp-fill ${hpPercent < 20 ? 'critical' : hpPercent < 50 ? 'warning' : ''}" 
                       style="width: ${hpPercent}%"></div>
                </div>
                <span class="hp-text">${encounter.currentHp}/${encounter.maxHp}</span>
              </div>
            </div>
            <div class="pokemon-sprite-large">
              <img src="${spriteUrl}" 
                   alt="${encounter.pokemon.name}" 
                   class="battle-sprite-lg enemy"
                   id="enemySprite"
                   onerror="this.src='${this.spriteService.getDefaultSpriteUrl(encounter.pokemon.id)}';">
            </div>
            <div class="pokemon-types">
              ${enemyTypes.map(type => `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`).join('')}
            </div>
          </div>

          <div class="ally-pokemon-large">
            <div class="pokemon-sprite-large ally-sprite-lg">
              <img src="${this.spriteService.getDefaultSpriteUrl(this.companion?.id || 25)}" 
                   alt="${this.companion?.name || 'Pikachu'}" 
                   class="battle-sprite-lg ally"
                   id="allySprite">
            </div>
            <div class="pokemon-info-plate ally-plate">
              <div class="name-level">
                <span class="poke-name">${this.companion?.name || 'Pikachu'}</span>
                <span class="poke-level">Lv.${this.companion?.level || 1}</span>
              </div>
              <div class="hp-bar-container ally-hp">
                <div class="hp-label">HP</div>
                <div class="hp-bar">
                  <div class="hp-fill ${companionHpPercent < 20 ? 'critical' : companionHpPercent < 50 ? 'warning' : ''}" 
                       style="width: ${companionHpPercent}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="battle-menu-compact">
          <div class="moves-grid-compact">
            ${moves.map((move, i) => `
              <button class="move-btn-compact" data-move="${i}" data-power="${move.power}" data-type="${move.type}" title="${move.desc}">
                <span class="move-name">${move.name}</span>
                <span class="move-power">PWR ${move.power}</span>
              </button>
            `).join('')}
          </div>
          
          <div class="actions-row">
            <button class="action-btn-sm catch-btn-sm" data-action="catch">
              <span class="btn-icon">⚾</span>
              <span>CATCH</span>
            </button>
            <button class="action-btn-sm run-btn-sm" data-action="run">
              <span class="btn-icon">🏃</span>
              <span>RUN</span>
            </button>
          </div>
        </div>

        <div class="attack-animation-layer" id="attackAnimationLayer"></div>
      </div>
    `;

    this.attachBattleListeners();
  }

  getCompanionMoves() {
    const companionType = this.getCompanionType();
    
    const movesByType = {
      'Electric': [
        { name: 'Thunderbolt', type: 'Electric', power: 90, desc: 'A strong electric bolt. May paralyze.' },
        { name: 'Quick Attack', type: 'Normal', power: 40, desc: 'Always strikes first.' },
        { name: 'Thunder Wave', type: 'Electric', power: 30, desc: 'Paralyzes the target.' },
        { name: 'Slam', type: 'Normal', power: 80, desc: 'Slams with full body force.' }
      ],
      'Fire': [
        { name: 'Flamethrower', type: 'Fire', power: 90, desc: 'Scorching flames. May burn.' },
        { name: 'Ember', type: 'Fire', power: 40, desc: 'Small flames. May burn.' },
        { name: 'Scratch', type: 'Normal', power: 40, desc: 'Scratches with sharp claws.' },
        { name: 'Fire Spin', type: 'Fire', power: 35, desc: 'Traps foe in a fire vortex.' }
      ],
      'Water': [
        { name: 'Water Gun', type: 'Water', power: 40, desc: 'Squirts water at the foe.' },
        { name: 'Bubble', type: 'Water', power: 40, desc: 'Bubbles may lower Speed.' },
        { name: 'Tackle', type: 'Normal', power: 40, desc: 'Charges and tackles.' },
        { name: 'Hydro Pump', type: 'Water', power: 110, desc: 'Powerful water blast!' }
      ],
      'Grass': [
        { name: 'Vine Whip', type: 'Grass', power: 45, desc: 'Whips with vines.' },
        { name: 'Razor Leaf', type: 'Grass', power: 55, desc: 'Sharp leaves. High crit.' },
        { name: 'Tackle', type: 'Normal', power: 40, desc: 'Charges and tackles.' },
        { name: 'Solar Beam', type: 'Grass', power: 120, desc: 'Absorbs light, then attacks!' }
      ],
      'Normal': [
        { name: 'Tackle', type: 'Normal', power: 40, desc: 'Charges and tackles.' },
        { name: 'Quick Attack', type: 'Normal', power: 40, desc: 'Always strikes first.' },
        { name: 'Slam', type: 'Normal', power: 80, desc: 'Slams with full body force.' },
        { name: 'Hyper Beam', type: 'Normal', power: 150, desc: 'Devastating beam! Must recharge.' }
      ]
    };

    return movesByType[companionType] || movesByType['Normal'];
  }

  getCompanionType() {
    const pokemonTypes = {
      25: 'Electric', 26: 'Electric',
      1: 'Grass', 2: 'Grass', 3: 'Grass',
      4: 'Fire', 5: 'Fire', 6: 'Fire',
      7: 'Water', 8: 'Water', 9: 'Water'
    };
    return pokemonTypes[this.companion?.id] || 'Normal';
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

  attachBattleListeners() {
    const moveBtns = this.container.querySelectorAll('.move-btn-compact');
    moveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const moveIndex = parseInt(btn.dataset.move);
        const power = parseInt(btn.dataset.power);
        const type = btn.dataset.type;
        this.executeMove(moveIndex, power, type);
      });
    });

    const catchBtn = this.container.querySelector('[data-action="catch"]');
    const runBtn = this.container.querySelector('[data-action="run"]');

    catchBtn?.addEventListener('click', () => this.attemptCatch());
    runBtn?.addEventListener('click', () => this.runAway());
  }

  async executeMove(moveIndex, power, type) {
    if (!this.currentEncounter) return;

    const moves = this.getCompanionMoves();
    const move = moves[moveIndex];
    
    this.disableButtons(true);

    const damage = this.calculateDamage(power, this.companion?.level || 10, type);
    
    await this.animateAttack('ally');
    await this.playMoveAnimation(move.type, 'enemy');
    await this.animateDamage('enemy');
    
    this.currentEncounter.currentHp = Math.max(0, this.currentEncounter.currentHp - damage);
    
    if (this.currentEncounter.currentHp <= 0) {
      await this.delay(500);
      this.battleLog.push(`Wild ${this.currentEncounter.pokemon.name} fainted!`);
      this.updateBattleLog();
      await this.delay(1500);
      this.currentEncounter = null;
      this.battleLog = [];
      this.render();
      return;
    }

    await this.delay(800);
    await this.enemyTurn();
    
    this.render();
  }

  async enemyTurn() {
    if (!this.currentEncounter || !this.companion) return;

    const enemyMoves = ['Tackle', 'Quick Attack', 'Scratch', 'Bite'];
    const enemyMove = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
    const enemyPower = 30 + Math.floor(Math.random() * 30);
    
    this.battleLog.push(`Wild ${this.currentEncounter.pokemon.name} used ${enemyMove}!`);
    this.updateBattleLog();
    
    await this.animateAttack('enemy');
    await this.animateDamage('ally');
    
    const damage = this.calculateDamage(enemyPower, this.currentEncounter.level, 'Normal');
    const newHealth = Math.max(0, (this.companion.health || 100) - Math.floor(damage / 3));
    
    this.companion.health = newHealth;
    await this.storage.set('companion', this.companion);
    
    await this.delay(300);
    this.battleLog.push(`Your ${this.companion.name} took ${Math.floor(damage / 3)} damage!`);
    this.updateBattleLog();
    
    if (newHealth <= 0) {
      await this.delay(500);
      this.battleLog.push(`${this.companion.name} fainted! The wild Pokemon fled.`);
      this.updateBattleLog();
      await this.delay(1500);
      this.companion.health = 100;
      await this.storage.set('companion', this.companion);
      this.currentEncounter = null;
      this.battleLog = [];
      this.render();
    }
    
    this.disableButtons(false);
  }

  calculateDamage(power, level, type) {
    const baseDamage = Math.floor((((2 * level / 5 + 2) * power * 50) / 50) / 50) + 2;
    const randomFactor = 0.85 + Math.random() * 0.15;
    const stab = this.getTypeBonus(type) ? 1.5 : 1;
    return Math.floor(baseDamage * randomFactor * stab);
  }

  getTypeBonus(moveType) {
    const companionType = this.getCompanionType();
    return moveType === companionType;
  }

  async animateAttack(who) {
    const spriteId = who === 'ally' ? 'allySprite' : 'enemySprite';
    const sprite = this.container.querySelector(`#${spriteId}`);
    if (sprite) {
      sprite.classList.add('attacking');
      await this.delay(200);
      sprite.classList.remove('attacking');
    }
  }

  async animateDamage(who) {
    const spriteId = who === 'ally' ? 'allySprite' : 'enemySprite';
    const sprite = this.container.querySelector(`#${spriteId}`);
    if (sprite) {
      sprite.classList.add('damaged');
      await this.delay(300);
      sprite.classList.remove('damaged');
    }
  }

  async playMoveAnimation(moveType, target) {
    const animationLayer = this.container.querySelector('#attackAnimationLayer');
    if (!animationLayer) return;

    const animationClass = this.getAnimationClass(moveType);
    animationLayer.innerHTML = `<div class="move-effect ${animationClass}"></div>`;
    
    await this.delay(600);
    animationLayer.innerHTML = '';
  }

  getAnimationClass(moveType) {
    const animations = {
      'Electric': 'electric-effect',
      'Fire': 'fire-effect',
      'Water': 'water-effect',
      'Grass': 'grass-effect',
      'Normal': 'normal-effect',
      'Psychic': 'psychic-effect',
      'Ice': 'ice-effect',
      'Dragon': 'dragon-effect',
      'Ghost': 'ghost-effect',
      'Fighting': 'fighting-effect'
    };
    return animations[moveType] || 'normal-effect';
  }

  updateBattleLog() {
    const logBox = this.container.querySelector('#battleLog');
    if (logBox) {
      const lastMsg = this.battleLog[this.battleLog.length - 1] || '';
      logBox.innerHTML = `<p class="log-text">${lastMsg}</p>`;
    }
  }

  disableButtons(disabled) {
    const buttons = this.container.querySelectorAll('.move-btn-compact, .action-btn-sm');
    buttons.forEach(btn => btn.disabled = disabled);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  toggleSearch() {
    this.isSearching = !this.isSearching;
    this.storage.set('isSearching', this.isSearching);
    console.log('[SearchScreen] Search mode:', this.isSearching ? 'ON' : 'OFF');
    this.render();
  }

  async triggerTestEncounter(rarity = 'common') {
    console.log('[SearchScreen] Triggering test encounter:', rarity);
    
    await this.loadCompanion();
    
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
    
    this.battleLog = [`A wild ${encounter.pokemon.name} appeared!`];
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
    const statusEl = this.container.querySelector('#battleLog');
    
    if (!this.currentEncounter) return;
    
    this.disableButtons(true);
    
    this.battleLog.push('You threw a Pokeball!');
    this.updateBattleLog();
    
    await this.delay(1000);
    
    const result = await this.catchService.attemptCatch(this.currentEncounter);
    
    if (result.success) {
      this.battleLog.push(`Gotcha! ${this.currentEncounter.pokemon.name} was caught!`);
      this.updateBattleLog();
      
      await this.saveCaughtPokemonToServer(this.currentEncounter);
      
      await this.delay(2000);
      this.currentEncounter = null;
      this.battleLog = [];
      this.render();
    } else {
      if (result.reason === 'no_pokeballs') {
        this.battleLog.push(`You don't have any Pokeballs!`);
      } else {
        this.battleLog.push(`Oh no! ${this.currentEncounter.pokemon.name} broke free!`);
      }
      this.updateBattleLog();
      this.disableButtons(false);
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
    this.battleLog.push('Got away safely!');
    this.updateBattleLog();
    
    await this.delay(1000);
    this.currentEncounter = null;
    this.battleLog = [];
    this.render();
  }

  show() {
    this.container.style.display = 'block';
    this.loadCompanion().then(() => {
      this.loadEncounterQueue().then(() => this.render());
    });
  }

  hide() {
    this.container.style.display = 'none';
  }
}

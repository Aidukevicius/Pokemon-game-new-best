import { StorageService } from '../../shared/services/StorageService.js';
import { CatchService } from '../../shared/services/CatchService.js';
import { SpriteService } from '../../shared/services/SpriteService.js';
import { EncounterService } from '../../shared/services/EncounterService.js';
import { MoveService } from '../../shared/services/MoveService.js';
import { BattleService } from '../../shared/services/BattleService.js';
import { getPokemonById } from '../../shared/data/pokemon-database.js';

export class SearchScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.storage = new StorageService();
    this.catchService = new CatchService();
    this.spriteService = new SpriteService();
    this.encounterService = new EncounterService();
    this.moveService = new MoveService();
    this.battleService = new BattleService();
    this.currentEncounter = null;
    this.isSearching = false;
    this.companion = null;
    this.companionMoves = null;
    this.companionStats = null;
    this.battleLog = [];
  }

  async initialize() {
    console.log('[SearchScreen] Initializing...');
    await this.loadCompanion();
    await this.loadCompanionMoves();
    await this.loadEncounterQueue();
    this.render();
  }

  async loadCompanionMoves() {
    if (this.companion?.id) {
      try {
        const moves = await this.moveService.getPokemonMoves(this.companion.id);
        if (moves && moves.length > 0) {
          this.companionMoves = moves;
          console.log('[SearchScreen] Loaded real moves from PokeAPI:', moves.map(m => m.name));
        } else {
          this.companionMoves = this.moveService.getDefaultMovesForType(this.getCompanionType());
        }
      } catch (error) {
        console.error('[SearchScreen] Error loading moves:', error);
        this.companionMoves = this.moveService.getDefaultMovesForType(this.getCompanionType());
      }
    } else {
      this.companionMoves = this.moveService.getDefaultMovesForType('Electric');
    }
  }

  async loadCompanion() {
    try {
      this.companion = await this.storage.get('companion');
      if (this.companion) {
        this.companionStats = this.battleService.calculateCompanionStats(this.companion);
        this.companion.stats = this.companionStats;
        this.companion.types = this.getCompanionTypes();
      }
      console.log('[SearchScreen] Companion loaded:', this.companion?.name, 'Stats:', this.companionStats);
    } catch (error) {
      console.error('[SearchScreen] Error loading companion:', error);
    }
  }

  getCompanionTypes() {
    if (!this.companion?.id) return ['Normal'];
    const pokemonData = getPokemonById(this.companion.id);
    if (pokemonData && pokemonData.types) {
      return pokemonData.types;
    }
    return ['Normal'];
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
                <span class="hp-text">${Math.round(this.companion?.health || 100)}/${this.companionStats?.hp || 100}</span>
              </div>
            </div>
          </div>

        </div>

        <div class="effectiveness-overlay" id="effectivenessOverlay"></div>

        <div class="battle-log-box" id="battleLog">
          <p class="log-text"></p>
        </div>

        <div class="battle-menu-pokemon">
          <div class="moves-grid-2x2">
            ${moves.map((move, i) => {
              const power = move.power ?? 0;
              const acc = move.accuracy ?? 100;
              const isStatusMove = move.damageClass === 'status' || move.isStatus;
              let powerText;
              if (isStatusMove) {
                powerText = 'Status Move';
              } else if (power === 0) {
                powerText = 'Fixed Damage';
              } else {
                powerText = `Power: ${power}`;
              }
              const accText = `Acc: ${acc}%`;
              const tooltip = `${powerText} | ${accText}`;
              return `
              <button class="move-btn-pokemon type-bg-${move.type.toLowerCase()}" data-move="${i}" data-power="${power}" data-type="${move.type}" data-accuracy="${acc}" data-status="${isStatusMove ? 'true' : 'false'}" data-damage-class="${move.damageClass}" title="${tooltip}">
                <span class="move-name-pokemon">${move.name}</span>
                <span class="move-pp">PP ${move.pp ?? 15}/${move.pp ?? 15}</span>
              </button>
            `;}).join('')}
          </div>

          <div class="actions-row-pokemon">
            <button class="action-btn-pokemon catch-pokemon" data-action="catch">
              <span>CATCH</span>
            </button>
            <button class="action-btn-pokemon run-pokemon" data-action="run">
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
    if (this.companionMoves && this.companionMoves.length > 0) {
      return this.companionMoves.map(move => ({
        name: move.name,
        apiName: move.apiName || move.name.toLowerCase().replace(/\s+/g, '-'),
        type: move.type,
        power: move.power,
        pp: move.pp ?? 15,
        accuracy: move.accuracy ?? 100,
        desc: move.effect || 'Attacks the target.',
        damageClass: move.damageClass || 'physical',
        isStatus: move.damageClass === 'status'
      }));
    }

    return this.moveService.getDefaultMovesForType(this.getCompanionType());
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
    const moveBtns = this.container.querySelectorAll('.move-btn-pokemon');
    moveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const moveIndex = parseInt(btn.dataset.move);
        const power = parseInt(btn.dataset.power) || 0;
        const type = btn.dataset.type;
        const accuracy = parseInt(btn.dataset.accuracy) || 100;
        const isStatus = btn.dataset.status === 'true';
        this.executeMove(moveIndex, power, type, accuracy, isStatus);
      });
    });

    const catchBtn = this.container.querySelector('[data-action="catch"]');
    const runBtn = this.container.querySelector('[data-action="run"]');

    catchBtn?.addEventListener('click', () => this.attemptCatch());
    runBtn?.addEventListener('click', () => this.runAway());
  }

  async executeMove(moveIndex, power, type, accuracy = 100, isStatus = false) {
    if (!this.currentEncounter) return;

    const moves = this.getCompanionMoves();
    const move = moves[moveIndex];

    this.disableButtons(true);

    const hitRoll = Math.random() * 100;
    const moveHit = hitRoll < accuracy;

    this.battleLog.push(`${this.companion?.name || 'Pikachu'} used ${move.name}!`);
    this.updateBattleLog();

    await this.animateAttack('ally');
    await this.playMoveAnimation(move.type, 'enemy');

    if (!moveHit) {
      this.battleLog.push(`Attack missed! ${this.currentEncounter.pokemon.name} avoided it!`);
      this.updateBattleLog();
      await this.delay(1500);
      await this.enemyTurn();
      this.render();
      return;
    }

    if (isStatus) {
      const statusEffects = this.getStatusEffect(move.name);
      this.battleLog.push(statusEffects);
      this.updateBattleLog();
      await this.delay(1500);
      await this.enemyTurn();
      this.render();
      return;
    }

    const attacker = {
      level: this.companion?.level || 10,
      stats: this.companionStats || { attack: 50, spAttack: 50 },
      types: this.companion?.types || ['Normal'],
      pokemon: { types: this.companion?.types || ['Normal'] }
    };

    const defender = {
      stats: this.currentEncounter.stats || { defense: 50, spDefense: 50 },
      types: this.currentEncounter.pokemon?.types || ['Normal'],
      pokemon: this.currentEncounter.pokemon,
      currentHp: this.currentEncounter.currentHp
    };

    const moveData = {
      ...move,
      power: power || move.power,
      type: type || move.type,
      damageClass: move.damageClass || 'physical'
    };

    const result = this.battleService.calculateDamage(attacker, defender, moveData);

    await this.showEffectivenessOverlay(result, move.name);

    if (result.missed) {
      this.battleLog.push(`${this.companion.name}'s attack missed!`);
      this.updateBattleLog();
      await this.delay(300);
      await this.enemyTurn();
      if (this.currentEncounter) {
        this.disableButtons(false);
        this.render();
      }
      return;
    }

    this.currentEncounter.currentHp = Math.max(0, this.currentEncounter.currentHp - result.damage);

    this.updateBattleLog();
    this.render();

    if (this.currentEncounter.currentHp === 0) {
      this.disableButtons(true);
      await this.delay(2000);
      this.battleLog.push(`Wild ${this.currentEncounter.pokemon.name} fainted!`);
      this.updateBattleLog();
      await this.delay(2000);
      this.battleLog.push('You won the battle!');
      this.updateBattleLog();
      await this.delay(2500);
      this.currentEncounter = null;
      this.battleLog = [];
      this.render();
      return;
    }

    await this.animateDamage('enemy');

    let damageMsg = '';
    if (result.critical) damageMsg += 'Critical hit! ';
    if (result.effectiveness > 1) damageMsg += "Super effective! ";
    else if (result.effectiveness < 1 && result.effectiveness > 0) damageMsg += "Not very effective... ";
    else if (result.effectiveness === 0) damageMsg += "No effect! ";
    damageMsg += `Dealt ${result.damage} damage!`;
    if (result.stab) damageMsg += ' (STAB)';
    this.battleLog.push(damageMsg);
    this.updateBattleLog();

    await this.delay(1500);
    await this.enemyTurn();

    if (this.currentEncounter) {
      this.disableButtons(false);
      this.render();
    }
  }

  async enemyTurn() {
    if (!this.currentEncounter || !this.companion) return;

    const enemyMove = this.battleService.selectWildPokemonMove(
      this.currentEncounter.pokemon,
      this.currentEncounter.level
    );

    console.log('[SearchScreen] Enemy using move:', enemyMove.name, 'Power:', enemyMove.power, 'Type:', enemyMove.type);

    this.battleLog.push(`Wild ${this.currentEncounter.pokemon.name} used ${enemyMove.name}!`);
    this.updateBattleLog();

    await this.animateAttack('enemy');
    await this.playMoveAnimation(enemyMove.type, 'ally');

    const attacker = {
      level: this.currentEncounter.level,
      stats: this.currentEncounter.stats || { attack: 50, spAttack: 50 },
      types: this.currentEncounter.pokemon?.types || ['Normal'],
      pokemon: this.currentEncounter.pokemon
    };

    const defender = {
      stats: this.companionStats || { defense: 50, spDefense: 50 },
      types: this.companion?.types || ['Normal'],
      pokemon: { types: this.companion?.types || ['Normal'] },
      currentHp: this.companion.health || 100
    };

    console.log('[SearchScreen] Attacker stats:', attacker.stats, 'Level:', attacker.level);
    console.log('[SearchScreen] Defender stats:', defender.stats);

    const result = this.battleService.calculateDamage(attacker, defender, enemyMove);

    console.log('[SearchScreen] Damage result:', result);

    if (result.missed) {
      this.battleLog.push(`${this.currentEncounter.pokemon.name}'s attack missed!`);
      this.updateBattleLog();
      await this.delay(1200);
      return;
    }

    await this.animateDamage('ally');

    const maxHp = this.companionStats?.hp || 100;
    const damagePercent = Math.floor((result.damage / maxHp) * 100);
    const actualDamage = Math.max(1, Math.min(damagePercent, this.companion.health || 100));
    let companionHp = Math.max(0, (this.companion.health || 100) - actualDamage);
    await this.storage.set('companionHp', companionHp);

    this.updateHpDisplay('ally', companionHp, 100);

    let damageMsg = '';
    if (result.critical) damageMsg += 'Critical hit! ';
    if (result.effectiveness > 1) damageMsg += "Super effective! ";
    else if (result.effectiveness < 1 && result.effectiveness > 0) damageMsg += "Not very effective... ";
    else if (result.effectiveness === 0) damageMsg += "No effect! ";
    damageMsg += `${this.companion.name} took ${actualDamage} damage!`;
    this.battleLog.push(damageMsg);
    this.updateBattleLog();

    await this.delay(1500);

    if (companionHp === 0) {
      this.disableButtons(true);
      await this.delay(2000);
      this.battleLog.push(`${this.companion.name} fainted!`);
      this.updateBattleLog();
      await this.delay(2000);
      this.battleLog.push('You lost the battle...');
      this.updateBattleLog();
      await this.delay(2500);
      this.currentEncounter = null;
      this.battleLog = [];
      this.render();
    } else {
      this.disableButtons(false);
    }
  }

  calculateDamage(power, level, type) {
    const baseDamage = Math.floor((((2 * level / 5 + 2) * power * 50) / 50) / 50) + 2;
    const randomFactor = 0.85 + Math.random() * 0.15;
    const stab = this.getTypeBonus(type) ? 1.5 : 1;
    return Math.floor(baseDamage * randomFactor * stab);
  }

  calculateMovesDamage(move, level, type, power) {
    const fixedDamageMoves = {
      'dragon-rage': 40,
      'sonic-boom': 20,
      'seismic-toss': level,
      'night-shade': level,
      'psywave': Math.floor(level * (0.5 + Math.random())),
      'super-fang': Math.floor((this.currentEncounter?.currentHp || 50) / 2)
    };

    const apiName = move.apiName || move.name.toLowerCase().replace(/\s+/g, '-');
    if (fixedDamageMoves[apiName] !== undefined) {
      return fixedDamageMoves[apiName];
    }

    if (power === 0 || power === null || power === undefined) {
      return 20;
    }

    return this.calculateDamage(power, level, type);
  }

  getTypeBonus(moveType) {
    const companionType = this.getCompanionType();
    return moveType === companionType;
  }

  getStatusEffect(moveName) {
    const statusMessages = {
      'thunder-wave': 'The target was paralyzed!',
      'thunder wave': 'The target was paralyzed!',
      'hypnosis': 'The target fell asleep!',
      'sleep-powder': 'The target fell asleep!',
      'sleep powder': 'The target fell asleep!',
      'stun-spore': 'The target was paralyzed!',
      'stun spore': 'The target was paralyzed!',
      'poison-powder': 'The target was poisoned!',
      'poison powder': 'The target was poisoned!',
      'toxic': 'The target was badly poisoned!',
      'will-o-wisp': 'The target was burned!',
      'confuse-ray': 'The target was confused!',
      'confuse ray': 'The target was confused!',
      'supersonic': 'The target was confused!',
      'growl': 'The target\'s Attack fell!',
      'leer': 'The target\'s Defense fell!',
      'tail-whip': 'The target\'s Defense fell!',
      'tail whip': 'The target\'s Defense fell!',
      'sand-attack': 'The target\'s accuracy fell!',
      'sand attack': 'The target\'s accuracy fell!',
      'smokescreen': 'The target\'s accuracy fell!',
      'flash': 'The target\'s accuracy fell!',
      'swords-dance': 'Attack sharply rose!',
      'swords dance': 'Attack sharply rose!',
      'agility': 'Speed sharply rose!',
      'amnesia': 'Sp. Def sharply rose!',
      'defense-curl': 'Defense rose!',
      'defense curl': 'Defense rose!',
      'harden': 'Defense rose!',
      'withdraw': 'Defense rose!',
      'double-team': 'Evasiveness rose!',
      'double team': 'Evasiveness rose!',
      'recover': 'HP was restored!',
      'rest': 'HP was fully restored. Fell asleep!',
      'leech-seed': 'A seed was planted!',
      'leech seed': 'A seed was planted!',
      'substitute': 'A substitute was created!',
      'reflect': 'Reflect raised Defense!',
      'light-screen': 'Light Screen raised Sp. Def!',
      'light screen': 'Light Screen raised Sp. Def!',
      'spore': 'The target fell asleep!',
      'sing': 'The target fell asleep!',
      'lovely-kiss': 'The target fell asleep!',
      'lovely kiss': 'The target fell asleep!',
      'glare': 'The target was paralyzed!'
    };

    const normalizedName = moveName.toLowerCase();
    return statusMessages[normalizedName] || 'But nothing happened...';
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

  updateHpDisplay(target, currentHp, maxHp) {
    const hpPercent = Math.max(0, (currentHp / maxHp) * 100);
    const isAlly = target === 'ally';

    const plate = this.container.querySelector(isAlly ? '.ally-plate' : '.enemy-pokemon-large .pokemon-info-plate');
    if (!plate) return;

    const hpFill = plate.querySelector('.hp-fill');
    const hpText = plate.querySelector('.hp-text');

    if (hpFill) {
      hpFill.style.width = `${hpPercent}%`;
      hpFill.classList.remove('critical', 'warning');
      if (hpPercent < 20) {
        hpFill.classList.add('critical');
      } else if (hpPercent < 50) {
        hpFill.classList.add('warning');
      }
    }

    if (hpText) {
      hpText.textContent = `${Math.round(currentHp)}/${Math.round(maxHp)}`;
    }
  }

  disableButtons(disabled) {
    const buttons = this.container.querySelectorAll('.move-btn-pokemon, .action-btn-pokemon');
    buttons.forEach(btn => btn.disabled = disabled);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async showEffectivenessOverlay(result, moveName) {
    const overlay = this.container.querySelector('#effectivenessOverlay');
    if (!overlay) {
      console.log('[SearchScreen] Overlay not found!');
      return;
    }

    const messages = [];

    if (result.missed) {
      console.log('[SearchScreen] Move missed! Showing overlay');
      messages.push({ text: 'It missed!', class: 'missed-msg' });
    }

    if (result.critical) {
      messages.push({ text: 'Critical hit!', class: 'critical-msg' });
    }

    if (result.effectiveness !== undefined && result.effectiveness !== 1) {
      let overlayClass = 'normal-effectiveness';
      let text = '';
      if (result.effectiveness === 0) {
        overlayClass = 'immune-effectiveness';
        text = "It doesn't affect...";
      } else if (result.effectiveness >= 2) {
        overlayClass = 'super-effectiveness';
        text = "It's super effective!";
      } else if (result.effectiveness > 1) {
        overlayClass = 'super-effectiveness';
        text = "It's super effective!";
      } else if (result.effectiveness < 1) {
        overlayClass = 'weak-effectiveness';
        text = "It's not very effective...";
      }
      if (text) {
        messages.push({ text, class: overlayClass });
      }
    }

    if (messages.length === 0) return;

    for (const msg of messages) {
      overlay.innerHTML = `<div class="effectiveness-message ${msg.class}">${msg.text}</div>`;
      overlay.classList.add('active');
      await this.delay(500);
      overlay.classList.remove('active');
      await this.delay(100);
    }

    overlay.innerHTML = '';
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

    await this.delay(1500);

    const result = await this.catchService.attemptCatch(this.currentEncounter);

    if (result.success) {
      this.battleLog.push(`Gotcha! ${this.currentEncounter.pokemon.name} was caught!`);
      this.updateBattleLog();

      await this.saveCaughtPokemonToServer(this.currentEncounter);

      await this.delay(2500);
      this.currentEncounter = null;
      this.battleLog = [];
      this.render();
    } else {
      if (result.reason === 'no_pokeballs') {
        this.battleLog.push(`You don't have any Pokeballs!`);
        this.updateBattleLog();
        await this.delay(1500);
      } else {
        this.battleLog.push(`Oh no! ${this.currentEncounter.pokemon.name} broke free!`);
        this.updateBattleLog();
        await this.delay(1500);
        
        await this.enemyTurn();
        
        if (this.currentEncounter) {
          this.render();
        }
      }
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
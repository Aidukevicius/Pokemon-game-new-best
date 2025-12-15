function getApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return '';
}

export class BattleServiceAPI {
  constructor() {
    this.apiAvailable = true;
    this.typeChart = this.initTypeChart();
    this.priorityMoves = this.initPriorityMoves();
  }

  initPriorityMoves() {
    return {
      'quick-attack': 1, 'Quick Attack': 1,
      'mach-punch': 1, 'Mach Punch': 1,
      'bullet-punch': 1, 'Bullet Punch': 1,
      'ice-shard': 1, 'Ice Shard': 1,
      'aqua-jet': 1, 'Aqua Jet': 1,
      'shadow-sneak': 1, 'Shadow Sneak': 1,
      'sucker-punch': 1, 'Sucker Punch': 1,
      'extreme-speed': 2, 'Extreme Speed': 2,
      'fake-out': 3, 'Fake Out': 3,
      'protect': 4, 'Protect': 4,
      'detect': 4, 'Detect': 4
    };
  }

  getMovePriority(move) {
    const moveName = move.name || move.apiName || '';
    return this.priorityMoves[moveName] || move.priority || 0;
  }

  determineTurnOrder(companion, enemy, companionMove, enemyMove) {
    const companionPriority = this.getMovePriority(companionMove);
    const enemyPriority = this.getMovePriority(enemyMove);
    
    if (companionPriority !== enemyPriority) {
      return companionPriority > enemyPriority ? 'companion' : 'enemy';
    }
    
    const companionSpeed = companion.stats?.speed || companion.speed || 50;
    const enemySpeed = enemy.stats?.speed || enemy.speed || 50;
    
    if (companionSpeed !== enemySpeed) {
      return companionSpeed > enemySpeed ? 'companion' : 'enemy';
    }
    
    return Math.random() < 0.5 ? 'companion' : 'enemy';
  }

  initTypeChart() {
    return {
      Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
      Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
      Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
      Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
      Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
      Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
      Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
      Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
      Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
      Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
      Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
      Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
      Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
      Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
      Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
      Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
      Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
      Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 }
    };
  }

  getTypeEffectiveness(moveType, defenderTypes) {
    let multiplier = 1;
    const moveTypeNorm = this.normalizeType(moveType);
    
    for (const defType of defenderTypes) {
      const defTypeNorm = this.normalizeType(defType);
      const effectiveness = this.typeChart[moveTypeNorm]?.[defTypeNorm];
      if (effectiveness !== undefined) {
        multiplier *= effectiveness;
      }
    }
    return multiplier;
  }

  normalizeType(type) {
    if (!type) return 'Normal';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  getEffectivenessMessage(multiplier) {
    if (multiplier === 0) return { text: "It doesn't affect the target...", level: 'immune' };
    if (multiplier < 0.5) return { text: "It's barely effective...", level: 'weak' };
    if (multiplier < 1) return { text: "It's not very effective...", level: 'weak' };
    if (multiplier > 2) return { text: "It's extremely effective!", level: 'super' };
    if (multiplier > 1) return { text: "It's super effective!", level: 'super' };
    return { text: '', level: 'normal' };
  }

  async calculateDamageAPI(attacker, defender, move) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/calculate-damage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attacker: {
            name: attacker.pokemon?.name || attacker.name,
            level: attacker.level || 50,
            nature: attacker.nature || 'Hardy',
            evs: attacker.evs || { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
            ivs: attacker.ivs || { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
            item: attacker.item
          },
          defender: {
            name: defender.pokemon?.name || defender.name,
            level: defender.level || 50,
            nature: defender.nature || 'Hardy',
            evs: defender.evs || { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
            ivs: defender.ivs || { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
            item: defender.item
          },
          move: { name: move.apiName || move.name }
        })
      });

      if (!response.ok) throw new Error('API request failed');
      
      const result = await response.json();
      if (result.success) {
        const defenderTypes = defender.pokemon?.types || defender.types || ['Normal'];
        const moveType = result.moveType || move.type;
        const effectiveness = this.getTypeEffectiveness(moveType, defenderTypes);
        
        return {
          damage: result.damage,
          effectiveness: effectiveness,
          critical: Math.random() < 0.0625,
          stab: false,
          missed: false,
          effectivenessMessage: this.getEffectivenessMessage(effectiveness)
        };
      }
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] API call failed, using fallback:', error.message);
      return this.calculateDamageFallback(attacker, defender, move);
    }
  }

  calculateDamage(attacker, defender, move) {
    const accuracy = move.accuracy ?? 100;
    const hitRoll = Math.random() * 100;
    
    if (hitRoll > accuracy) {
      return {
        damage: 0,
        effectiveness: 1,
        critical: false,
        stab: false,
        missed: true,
        effectivenessMessage: { text: '', level: 'normal' }
      };
    }

    return this.calculateDamageFallback(attacker, defender, move);
  }

  calculateDamageFallback(attacker, defender, move) {
    if (move.power === 0 || move.power === null || move.power === undefined) {
      return this.handleFixedDamageMove(move, attacker.level, defender.currentHp);
    }

    const level = attacker.level || 50;
    const power = move.power || 50;
    
    const isPhysical = (move.damageClass === 'physical');
    const attackStat = isPhysical ? 
      (attacker.stats?.attack || attacker.stats?.Attack || 50) : 
      (attacker.stats?.spAttack || attacker.stats?.['special-attack'] || 50);
    const defenseStat = isPhysical ? 
      (defender.stats?.defense || defender.stats?.Defense || 50) : 
      (defender.stats?.spDefense || defender.stats?.['special-defense'] || 50);

    const baseDamage = Math.floor(
      ((((2 * level) / 5 + 2) * power * (attackStat / defenseStat)) / 50) + 2
    );

    const attackerTypes = attacker.pokemon?.types || attacker.types || ['Normal'];
    const stab = attackerTypes.some(t => 
      this.normalizeType(t) === this.normalizeType(move.type)
    ) ? 1.5 : 1;

    const defenderTypes = defender.pokemon?.types || defender.types || ['Normal'];
    const typeEffectiveness = this.getTypeEffectiveness(move.type, defenderTypes);

    const critical = Math.random() < 0.0625 ? 1.5 : 1;
    const randomFactor = 0.85 + (Math.random() * 0.15);

    let finalDamage = Math.floor(baseDamage * stab * typeEffectiveness * critical * randomFactor);
    finalDamage = Math.max(1, finalDamage);

    if (typeEffectiveness === 0) {
      finalDamage = 0;
    }

    return {
      damage: finalDamage,
      effectiveness: typeEffectiveness,
      critical: critical > 1,
      stab: stab > 1,
      missed: false,
      effectivenessMessage: this.getEffectivenessMessage(typeEffectiveness)
    };
  }

  handleFixedDamageMove(move, level, currentHp) {
    const moveName = (move.apiName || move.name || '').toLowerCase().replace(/\s+/g, '-');
    
    const fixedDamageMoves = {
      'dragon-rage': 40,
      'sonic-boom': 20,
      'seismic-toss': level,
      'night-shade': level,
      'psywave': Math.floor(level * (0.5 + Math.random())),
      'super-fang': Math.floor(currentHp / 2),
      'endeavor': currentHp - 1
    };

    const damage = fixedDamageMoves[moveName] ?? 20;
    
    return {
      damage: Math.max(1, damage),
      effectiveness: 1,
      critical: false,
      stab: false,
      effectivenessMessage: { text: '', level: 'normal' }
    };
  }

  async calculateCompanionStatsAPI(companion) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/calculate-stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companion.name || 'Pikachu',
          level: companion.level || 50,
          nature: companion.nature || 'Hardy',
          evs: companion.evs || { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
          ivs: companion.ivs || { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 }
        })
      });

      if (!response.ok) throw new Error('API request failed');
      
      const result = await response.json();
      if (result.success) {
        return result.stats;
      }
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] Stats API call failed, using fallback:', error.message);
      return this.calculateCompanionStats(companion);
    }
  }

  calculateCompanionStats(companion) {
    const pokemonBaseStats = this.getBaseStats(companion.id || companion.pokemon?.id);
    const level = companion.level || 1;
    
    const ivs = companion.ivs || { hp: 15, attack: 15, defense: 15, spAttack: 15, spDefense: 15, speed: 15 };
    const evs = companion.evs || { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
    const nature = companion.nature || 'Hardy';

    return {
      hp: this.calculateHP(pokemonBaseStats.hp, level, evs.hp, ivs.hp),
      attack: this.calculateStat(pokemonBaseStats.attack, level, evs.attack, ivs.attack, this.getNatureModifier(nature, 'attack')),
      defense: this.calculateStat(pokemonBaseStats.defense, level, evs.defense, ivs.defense, this.getNatureModifier(nature, 'defense')),
      spAttack: this.calculateStat(pokemonBaseStats.spAttack, level, evs.spAttack, ivs.spAttack, this.getNatureModifier(nature, 'spAttack')),
      spDefense: this.calculateStat(pokemonBaseStats.spDefense, level, evs.spDefense, ivs.spDefense, this.getNatureModifier(nature, 'spDefense')),
      speed: this.calculateStat(pokemonBaseStats.speed, level, evs.speed, ivs.speed, this.getNatureModifier(nature, 'speed'))
    };
  }

  calculateHP(base, level, ev, iv) {
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  }

  calculateStat(base, level, ev, iv, natureMod) {
    const stat = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
    return Math.floor(stat * natureMod);
  }

  getNatureModifier(nature, stat) {
    const modifiers = {
      Lonely: { attack: 1.1, defense: 0.9 },
      Brave: { attack: 1.1, speed: 0.9 },
      Adamant: { attack: 1.1, spAttack: 0.9 },
      Naughty: { attack: 1.1, spDefense: 0.9 },
      Bold: { defense: 1.1, attack: 0.9 },
      Relaxed: { defense: 1.1, speed: 0.9 },
      Impish: { defense: 1.1, spAttack: 0.9 },
      Lax: { defense: 1.1, spDefense: 0.9 },
      Timid: { speed: 1.1, attack: 0.9 },
      Hasty: { speed: 1.1, defense: 0.9 },
      Jolly: { speed: 1.1, spAttack: 0.9 },
      Naive: { speed: 1.1, spDefense: 0.9 },
      Modest: { spAttack: 1.1, attack: 0.9 },
      Mild: { spAttack: 1.1, defense: 0.9 },
      Quiet: { spAttack: 1.1, speed: 0.9 },
      Rash: { spAttack: 1.1, spDefense: 0.9 },
      Calm: { spDefense: 1.1, attack: 0.9 },
      Gentle: { spDefense: 1.1, defense: 0.9 },
      Sassy: { spDefense: 1.1, speed: 0.9 },
      Careful: { spDefense: 1.1, spAttack: 0.9 }
    };

    return modifiers[nature]?.[stat] || 1.0;
  }

  getBaseStats(pokemonId) {
    const baseStatsMap = {
      1: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45 },
      4: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 },
      7: { hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43 },
      25: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 },
      26: { hp: 60, attack: 90, defense: 55, spAttack: 90, spDefense: 80, speed: 110 },
      133: { hp: 55, attack: 55, defense: 50, spAttack: 45, spDefense: 65, speed: 55 },
      143: { hp: 160, attack: 110, defense: 65, spAttack: 65, spDefense: 110, speed: 30 },
      149: { hp: 91, attack: 134, defense: 95, spAttack: 100, spDefense: 100, speed: 80 },
      150: { hp: 106, attack: 110, defense: 90, spAttack: 154, spDefense: 90, speed: 130 },
      151: { hp: 100, attack: 100, defense: 100, spAttack: 100, spDefense: 100, speed: 100 }
    };

    return baseStatsMap[pokemonId] || { hp: 50, attack: 50, defense: 50, spAttack: 50, spDefense: 50, speed: 50 };
  }

  getWildPokemonMoves(pokemon, level) {
    const types = pokemon.types || ['Normal'];
    const movePool = this.getMovePoolForTypes(types);
    const scaledPower = Math.min(100, 30 + Math.floor(level * 1.2));
    
    return movePool.map(move => ({
      ...move,
      power: move.power ? Math.min(move.power, scaledPower + 20) : move.power
    }));
  }

  getMovePoolForTypes(types) {
    const primaryType = types[0] || 'Normal';
    const typeMoves = {
      Normal: [
        { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, damageClass: 'physical' },
        { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100, damageClass: 'physical' },
        { name: 'Body Slam', type: 'Normal', power: 85, accuracy: 100, damageClass: 'physical' },
        { name: 'Hyper Beam', type: 'Normal', power: 150, accuracy: 90, damageClass: 'special' }
      ],
      Fire: [
        { name: 'Ember', type: 'Fire', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Flame Wheel', type: 'Fire', power: 60, accuracy: 100, damageClass: 'physical' },
        { name: 'Flamethrower', type: 'Fire', power: 90, accuracy: 100, damageClass: 'special' },
        { name: 'Fire Blast', type: 'Fire', power: 110, accuracy: 85, damageClass: 'special' }
      ],
      Water: [
        { name: 'Water Gun', type: 'Water', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Bubble Beam', type: 'Water', power: 65, accuracy: 100, damageClass: 'special' },
        { name: 'Surf', type: 'Water', power: 90, accuracy: 100, damageClass: 'special' },
        { name: 'Hydro Pump', type: 'Water', power: 110, accuracy: 80, damageClass: 'special' }
      ],
      Electric: [
        { name: 'Thunder Shock', type: 'Electric', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Spark', type: 'Electric', power: 65, accuracy: 100, damageClass: 'physical' },
        { name: 'Thunderbolt', type: 'Electric', power: 90, accuracy: 100, damageClass: 'special' },
        { name: 'Thunder', type: 'Electric', power: 110, accuracy: 70, damageClass: 'special' }
      ],
      Grass: [
        { name: 'Vine Whip', type: 'Grass', power: 45, accuracy: 100, damageClass: 'physical' },
        { name: 'Razor Leaf', type: 'Grass', power: 55, accuracy: 95, damageClass: 'physical' },
        { name: 'Magical Leaf', type: 'Grass', power: 60, accuracy: 100, damageClass: 'special' },
        { name: 'Solar Beam', type: 'Grass', power: 120, accuracy: 100, damageClass: 'special' }
      ],
      Psychic: [
        { name: 'Confusion', type: 'Psychic', power: 50, accuracy: 100, damageClass: 'special' },
        { name: 'Psybeam', type: 'Psychic', power: 65, accuracy: 100, damageClass: 'special' },
        { name: 'Psychic', type: 'Psychic', power: 90, accuracy: 100, damageClass: 'special' },
        { name: 'Psyshock', type: 'Psychic', power: 80, accuracy: 100, damageClass: 'special' }
      ],
      Fighting: [
        { name: 'Karate Chop', type: 'Fighting', power: 50, accuracy: 100, damageClass: 'physical' },
        { name: 'Low Kick', type: 'Fighting', power: 50, accuracy: 100, damageClass: 'physical' },
        { name: 'Cross Chop', type: 'Fighting', power: 100, accuracy: 80, damageClass: 'physical' },
        { name: 'Close Combat', type: 'Fighting', power: 120, accuracy: 100, damageClass: 'physical' }
      ],
      Rock: [
        { name: 'Rock Throw', type: 'Rock', power: 50, accuracy: 90, damageClass: 'physical' },
        { name: 'Rock Slide', type: 'Rock', power: 75, accuracy: 90, damageClass: 'physical' },
        { name: 'Stone Edge', type: 'Rock', power: 100, accuracy: 80, damageClass: 'physical' },
        { name: 'Power Gem', type: 'Rock', power: 80, accuracy: 100, damageClass: 'special' }
      ],
      Ground: [
        { name: 'Mud Slap', type: 'Ground', power: 20, accuracy: 100, damageClass: 'special' },
        { name: 'Dig', type: 'Ground', power: 80, accuracy: 100, damageClass: 'physical' },
        { name: 'Earthquake', type: 'Ground', power: 100, accuracy: 100, damageClass: 'physical' },
        { name: 'Earth Power', type: 'Ground', power: 90, accuracy: 100, damageClass: 'special' }
      ],
      Flying: [
        { name: 'Gust', type: 'Flying', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Wing Attack', type: 'Flying', power: 60, accuracy: 100, damageClass: 'physical' },
        { name: 'Aerial Ace', type: 'Flying', power: 60, accuracy: 100, damageClass: 'physical' },
        { name: 'Air Slash', type: 'Flying', power: 75, accuracy: 95, damageClass: 'special' }
      ],
      Poison: [
        { name: 'Poison Sting', type: 'Poison', power: 15, accuracy: 100, damageClass: 'physical' },
        { name: 'Acid', type: 'Poison', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Sludge', type: 'Poison', power: 65, accuracy: 100, damageClass: 'special' },
        { name: 'Sludge Bomb', type: 'Poison', power: 90, accuracy: 100, damageClass: 'special' }
      ],
      Bug: [
        { name: 'Bug Bite', type: 'Bug', power: 60, accuracy: 100, damageClass: 'physical' },
        { name: 'X-Scissor', type: 'Bug', power: 80, accuracy: 100, damageClass: 'physical' },
        { name: 'Signal Beam', type: 'Bug', power: 75, accuracy: 100, damageClass: 'special' },
        { name: 'Bug Buzz', type: 'Bug', power: 90, accuracy: 100, damageClass: 'special' }
      ],
      Ghost: [
        { name: 'Lick', type: 'Ghost', power: 30, accuracy: 100, damageClass: 'physical' },
        { name: 'Shadow Punch', type: 'Ghost', power: 60, accuracy: 100, damageClass: 'physical' },
        { name: 'Shadow Ball', type: 'Ghost', power: 80, accuracy: 100, damageClass: 'special' },
        { name: 'Hex', type: 'Ghost', power: 65, accuracy: 100, damageClass: 'special' }
      ],
      Ice: [
        { name: 'Powder Snow', type: 'Ice', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Ice Shard', type: 'Ice', power: 40, accuracy: 100, damageClass: 'physical' },
        { name: 'Ice Beam', type: 'Ice', power: 90, accuracy: 100, damageClass: 'special' },
        { name: 'Blizzard', type: 'Ice', power: 110, accuracy: 70, damageClass: 'special' }
      ],
      Dragon: [
        { name: 'Dragon Rage', type: 'Dragon', power: 0, accuracy: 100, damageClass: 'special' },
        { name: 'Dragon Claw', type: 'Dragon', power: 80, accuracy: 100, damageClass: 'physical' },
        { name: 'Dragon Pulse', type: 'Dragon', power: 85, accuracy: 100, damageClass: 'special' },
        { name: 'Outrage', type: 'Dragon', power: 120, accuracy: 100, damageClass: 'physical' }
      ],
      Dark: [
        { name: 'Bite', type: 'Dark', power: 60, accuracy: 100, damageClass: 'physical' },
        { name: 'Crunch', type: 'Dark', power: 80, accuracy: 100, damageClass: 'physical' },
        { name: 'Dark Pulse', type: 'Dark', power: 80, accuracy: 100, damageClass: 'special' },
        { name: 'Night Slash', type: 'Dark', power: 70, accuracy: 100, damageClass: 'physical' }
      ],
      Steel: [
        { name: 'Metal Claw', type: 'Steel', power: 50, accuracy: 95, damageClass: 'physical' },
        { name: 'Iron Head', type: 'Steel', power: 80, accuracy: 100, damageClass: 'physical' },
        { name: 'Flash Cannon', type: 'Steel', power: 80, accuracy: 100, damageClass: 'special' },
        { name: 'Meteor Mash', type: 'Steel', power: 90, accuracy: 90, damageClass: 'physical' }
      ],
      Fairy: [
        { name: 'Fairy Wind', type: 'Fairy', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Draining Kiss', type: 'Fairy', power: 50, accuracy: 100, damageClass: 'special' },
        { name: 'Dazzling Gleam', type: 'Fairy', power: 80, accuracy: 100, damageClass: 'special' },
        { name: 'Moonblast', type: 'Fairy', power: 95, accuracy: 100, damageClass: 'special' }
      ]
    };

    return typeMoves[primaryType] || typeMoves.Normal;
  }

  selectWildPokemonMove(pokemon, level) {
    const moves = this.getWildPokemonMoves(pokemon, level);
    const validMoves = moves.filter(m => {
      const minLevel = m.power > 80 ? 25 : m.power > 50 ? 10 : 1;
      return level >= minLevel;
    });

    if (validMoves.length === 0) return moves[0];

    const weights = validMoves.map(m => {
      if (m.power > 80) return 0.3;
      if (m.power > 50) return 0.5;
      return 0.7;
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < validMoves.length; i++) {
      random -= weights[i];
      if (random <= 0) return validMoves[i];
    }

    return validMoves[0];
  }

  // ============================================
  // STAT STAGE MODIFIERS (with API fallback)
  // ============================================

  initStatStages() {
    return { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
  }

  async initStatStagesAPI() {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/init-stat-stages`);
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return result.stages;
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] initStatStages API failed, using fallback:', error.message);
      return this.initStatStages();
    }
  }

  getStatStageMultiplier(stage) {
    const clampedStage = Math.max(-6, Math.min(6, stage));
    if (clampedStage >= 0) {
      return (2 + clampedStage) / 2;
    }
    return 2 / (2 - clampedStage);
  }

  async getStatStageMultiplierAPI(stage) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/stat-stage-multiplier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return result.multiplier;
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] getStatStageMultiplier API failed, using fallback:', error.message);
      return this.getStatStageMultiplier(stage);
    }
  }

  getAccuracyEvasionMultiplier(stage) {
    const clampedStage = Math.max(-6, Math.min(6, stage));
    if (clampedStage >= 0) {
      return (3 + clampedStage) / 3;
    }
    return 3 / (3 - clampedStage);
  }

  async getAccuracyEvasionMultiplierAPI(stage) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/accuracy-evasion-multiplier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return result.multiplier;
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] getAccuracyEvasionMultiplier API failed, using fallback:', error.message);
      return this.getAccuracyEvasionMultiplier(stage);
    }
  }

  applyStatStageChange(currentStages, stat, change) {
    const newStage = Math.max(-6, Math.min(6, (currentStages[stat] || 0) + change));
    const oldStage = currentStages[stat] || 0;
    currentStages[stat] = newStage;
    
    let message = '';
    const actualChange = newStage - oldStage;
    
    if (actualChange === 0) {
      message = `${stat.charAt(0).toUpperCase() + stat.slice(1)} won't go any ${change > 0 ? 'higher' : 'lower'}!`;
    } else if (Math.abs(actualChange) >= 3) {
      message = `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${actualChange > 0 ? 'rose drastically' : 'severely fell'}!`;
    } else if (Math.abs(actualChange) >= 2) {
      message = `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${actualChange > 0 ? 'sharply rose' : 'harshly fell'}!`;
    } else {
      message = `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${actualChange > 0 ? 'rose' : 'fell'}!`;
    }
    
    return { stages: currentStages, message, changed: actualChange !== 0 };
  }

  async applyStatStageChangeAPI(currentStages, stat, change) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/apply-stat-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStages, stat, change })
      });
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return { stages: result.stages, message: result.message, changed: result.changed };
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] applyStatStageChange API failed, using fallback:', error.message);
      return this.applyStatStageChange(currentStages, stat, change);
    }
  }

  getStatMoveEffects(moveName) {
    const statMoves = {
      'swords-dance': { target: 'self', stat: 'attack', change: 2 },
      'Swords Dance': { target: 'self', stat: 'attack', change: 2 },
      'dragon-dance': { target: 'self', stats: [{ stat: 'attack', change: 1 }, { stat: 'speed', change: 1 }] },
      'Dragon Dance': { target: 'self', stats: [{ stat: 'attack', change: 1 }, { stat: 'speed', change: 1 }] },
      'calm-mind': { target: 'self', stats: [{ stat: 'spAttack', change: 1 }, { stat: 'spDefense', change: 1 }] },
      'Calm Mind': { target: 'self', stats: [{ stat: 'spAttack', change: 1 }, { stat: 'spDefense', change: 1 }] },
      'nasty-plot': { target: 'self', stat: 'spAttack', change: 2 },
      'Nasty Plot': { target: 'self', stat: 'spAttack', change: 2 },
      'agility': { target: 'self', stat: 'speed', change: 2 },
      'Agility': { target: 'self', stat: 'speed', change: 2 },
      'growl': { target: 'enemy', stat: 'attack', change: -1 },
      'Growl': { target: 'enemy', stat: 'attack', change: -1 },
      'leer': { target: 'enemy', stat: 'defense', change: -1 },
      'Leer': { target: 'enemy', stat: 'defense', change: -1 },
      'tail-whip': { target: 'enemy', stat: 'defense', change: -1 },
      'Tail Whip': { target: 'enemy', stat: 'defense', change: -1 },
      'sand-attack': { target: 'enemy', stat: 'accuracy', change: -1 },
      'Sand Attack': { target: 'enemy', stat: 'accuracy', change: -1 },
      'double-team': { target: 'self', stat: 'evasion', change: 1 },
      'Double Team': { target: 'self', stat: 'evasion', change: 1 },
      'screech': { target: 'enemy', stat: 'defense', change: -2 },
      'Screech': { target: 'enemy', stat: 'defense', change: -2 },
      'charm': { target: 'enemy', stat: 'attack', change: -2 },
      'Charm': { target: 'enemy', stat: 'attack', change: -2 }
    };
    return statMoves[moveName] || statMoves[moveName.toLowerCase().replace(/\s+/g, '-')] || null;
  }

  async getStatMoveEffectsAPI(moveName) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/get-stat-move-effects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moveName })
      });
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return result.effects;
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] getStatMoveEffects API failed, using fallback:', error.message);
      return this.getStatMoveEffects(moveName);
    }
  }

  // ============================================
  // STATUS EFFECTS SYSTEM (with API fallback)
  // ============================================

  applyStatusEffect(target, status) {
    const statusEffects = {
      'paralysis': {
        name: 'paralysis',
        speedMultiplier: 0.5,
        skipTurnChance: 0.25,
        message: 'is paralyzed! It may not be able to move!'
      },
      'burn': {
        name: 'burn',
        attackMultiplier: 0.5,
        endTurnDamagePercent: 0.0625,
        message: 'was burned!'
      },
      'poison': {
        name: 'poison',
        endTurnDamagePercent: 0.125,
        message: 'was poisoned!'
      },
      'badly-poisoned': {
        name: 'badly-poisoned',
        endTurnDamageMultiplier: true,
        baseDamagePercent: 0.0625,
        message: 'was badly poisoned!'
      },
      'sleep': {
        name: 'sleep',
        skipTurn: true,
        turnsRemaining: Math.floor(Math.random() * 3) + 1,
        message: 'fell asleep!'
      },
      'freeze': {
        name: 'freeze',
        skipTurn: true,
        thawChance: 0.2,
        message: 'was frozen solid!'
      },
      'confusion': {
        name: 'confusion',
        hitSelfChance: 0.33,
        turnsRemaining: Math.floor(Math.random() * 4) + 1,
        message: 'became confused!'
      }
    };
    return statusEffects[status] || null;
  }

  async applyStatusEffectAPI(target, status) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/get-status-effect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return result.effect;
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] applyStatusEffect API failed, using fallback:', error.message);
      return this.applyStatusEffect(target, status);
    }
  }

  getStatusMoveEffects(moveName) {
    const statusMoves = {
      'thunder-wave': { status: 'paralysis', accuracy: 90 },
      'Thunder Wave': { status: 'paralysis', accuracy: 90 },
      'stun-spore': { status: 'paralysis', accuracy: 75 },
      'Stun Spore': { status: 'paralysis', accuracy: 75 },
      'will-o-wisp': { status: 'burn', accuracy: 85 },
      'Will-O-Wisp': { status: 'burn', accuracy: 85 },
      'poison-powder': { status: 'poison', accuracy: 75 },
      'Poison Powder': { status: 'poison', accuracy: 75 },
      'toxic': { status: 'badly-poisoned', accuracy: 90 },
      'Toxic': { status: 'badly-poisoned', accuracy: 90 },
      'sleep-powder': { status: 'sleep', accuracy: 75 },
      'Sleep Powder': { status: 'sleep', accuracy: 75 },
      'hypnosis': { status: 'sleep', accuracy: 60 },
      'Hypnosis': { status: 'sleep', accuracy: 60 },
      'confuse-ray': { status: 'confusion', accuracy: 100 },
      'Confuse Ray': { status: 'confusion', accuracy: 100 }
    };
    return statusMoves[moveName] || statusMoves[moveName.toLowerCase().replace(/\s+/g, '-')] || null;
  }

  async getStatusMoveEffectsAPI(moveName) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/get-status-move-effects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moveName })
      });
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return result.effects;
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] getStatusMoveEffects API failed, using fallback:', error.message);
      return this.getStatusMoveEffects(moveName);
    }
  }

  processStatusEffectOnTurn(status, maxHp, turnCount = 1) {
    const result = { canMove: true, damage: 0, message: '', cured: false };
    
    if (!status) return result;
    
    switch (status.name) {
      case 'paralysis':
        if (Math.random() < status.skipTurnChance) {
          result.canMove = false;
          result.message = 'is paralyzed! It can\'t move!';
        }
        break;
        
      case 'burn':
        result.damage = Math.floor(maxHp * status.endTurnDamagePercent);
        result.message = 'is hurt by its burn!';
        break;
        
      case 'poison':
        result.damage = Math.floor(maxHp * status.endTurnDamagePercent);
        result.message = 'is hurt by poison!';
        break;
        
      case 'badly-poisoned':
        result.damage = Math.floor(maxHp * status.baseDamagePercent * turnCount);
        result.message = 'is hurt by poison!';
        break;
        
      case 'sleep':
        if (status.turnsRemaining <= 0) {
          result.cured = true;
          result.message = 'woke up!';
        } else {
          result.canMove = false;
          result.message = 'is fast asleep.';
          status.turnsRemaining--;
        }
        break;
        
      case 'freeze':
        if (Math.random() < status.thawChance) {
          result.cured = true;
          result.message = 'thawed out!';
        } else {
          result.canMove = false;
          result.message = 'is frozen solid!';
        }
        break;
        
      case 'confusion':
        if (status.turnsRemaining <= 0) {
          result.cured = true;
          result.message = 'snapped out of confusion!';
        } else {
          status.turnsRemaining--;
          if (Math.random() < status.hitSelfChance) {
            result.canMove = false;
            result.damage = Math.floor(maxHp * 0.1);
            result.message = 'hurt itself in its confusion!';
          }
        }
        break;
    }
    
    return result;
  }

  async processStatusEffectOnTurnAPI(status, maxHp, turnCount = 1) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/process-status-on-turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, maxHp, turnCount })
      });
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return result.result;
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] processStatusEffectOnTurn API failed, using fallback:', error.message);
      return this.processStatusEffectOnTurn(status, maxHp, turnCount);
    }
  }

  applyStatusModifiersToDamage(damage, attacker, move, status) {
    let modifiedDamage = damage;
    if (status?.name === 'burn' && move.damageClass === 'physical') {
      modifiedDamage = Math.floor(modifiedDamage * 0.5);
    }
    return modifiedDamage;
  }

  applyStatusModifiersToSpeed(speed, status) {
    if (status?.name === 'paralysis') {
      return Math.floor(speed * 0.5);
    }
    return speed;
  }

  calculateAccuracyWithStages(baseAccuracy, attackerAccuracyStage, defenderEvasionStage) {
    const accuracyMultiplier = this.getAccuracyEvasionMultiplier(attackerAccuracyStage);
    const evasionMultiplier = this.getAccuracyEvasionMultiplier(defenderEvasionStage);
    const finalAccuracy = baseAccuracy * (accuracyMultiplier / evasionMultiplier);
    return Math.min(100, Math.max(0, finalAccuracy));
  }

  async calculateAccuracyWithStagesAPI(baseAccuracy, attackerAccuracyStage, defenderEvasionStage) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/battle/calculate-accuracy-with-stages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseAccuracy, attackerAccuracyStage, defenderEvasionStage })
      });
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      if (result.success) return result.accuracy;
      throw new Error(result.error);
    } catch (error) {
      console.warn('[BattleServiceAPI] calculateAccuracyWithStages API failed, using fallback:', error.message);
      return this.calculateAccuracyWithStages(baseAccuracy, attackerAccuracyStage, defenderEvasionStage);
    }
  }
}

export { BattleServiceAPI as BattleService };

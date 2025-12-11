export class BattleService {
  constructor() {
    this.typeChart = this.initTypeChart();
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
    const normalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return normalized;
  }

  getEffectivenessMessage(multiplier) {
    if (multiplier === 0) return { text: "It doesn't affect the target...", level: 'immune' };
    if (multiplier < 0.5) return { text: "It's barely effective...", level: 'weak' };
    if (multiplier < 1) return { text: "It's not very effective...", level: 'weak' };
    if (multiplier > 2) return { text: "It's extremely effective!", level: 'super' };
    if (multiplier > 1) return { text: "It's super effective!", level: 'super' };
    return { text: '', level: 'normal' };
  }

  calculateDamage(attacker, defender, move) {
    const accuracy = move.accuracy ?? 100;
    const hitRoll = Math.random() * 100;
    
    console.log('[BattleService] calculateDamage called:', {
      move: move.name,
      power: move.power,
      type: move.type,
      damageClass: move.damageClass,
      accuracy: accuracy,
      hitRoll: hitRoll
    });
    
    if (hitRoll > accuracy) {
      console.log('[BattleService] Attack missed!');
      return {
        damage: 0,
        effectiveness: 1,
        critical: false,
        stab: false,
        missed: true,
        effectivenessMessage: { text: '', level: 'normal' }
      };
    }

    if (move.power === 0 || move.power === null || move.power === undefined) {
      console.log('[BattleService] Fixed damage move detected');
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
    
    console.log('[BattleService] Stats used - Attack:', attackStat, 'Defense:', defenseStat, 'isPhysical:', isPhysical);

    const baseDamage = Math.floor(
      ((((2 * level) / 5 + 2) * power * (attackStat / defenseStat)) / 50) + 2
    );

    const attackerTypes = attacker.pokemon?.types || attacker.types || ['Normal'];
    const stab = attackerTypes.some(t => 
      this.normalizeType(t) === this.normalizeType(move.type)
    ) ? 1.5 : 1;

    const defenderTypes = defender.pokemon?.types || defender.types || ['Normal'];
    const typeEffectiveness = this.getTypeEffectiveness(move.type, defenderTypes);

    const critical = Math.random() < 0.0625 ? 2.0 : 1;

    const randomFactor = 0.85 + (Math.random() * 0.15);

    let finalDamage = Math.floor(baseDamage * stab * typeEffectiveness * critical * randomFactor);
    finalDamage = Math.max(1, finalDamage);

    if (typeEffectiveness === 0) {
      finalDamage = 0;
    }

    console.log('[BattleService] Final damage:', finalDamage, 'Base:', baseDamage, 'STAB:', stab, 'Effectiveness:', typeEffectiveness, 'Critical:', critical);

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

  getWildPokemonMoves(pokemon, level) {
    const types = pokemon.types || ['Normal'];
    const primaryType = types[0];
    const secondaryType = types[1];

    const movePool = this.getMovePoolForTypes(types);
    
    const scaledPower = Math.min(100, 30 + Math.floor(level * 1.2));
    
    return movePool.map(move => ({
      ...move,
      power: move.power ? Math.min(move.power, scaledPower + 20) : move.power
    }));
  }

  getMovePoolForTypes(types) {
    const primaryType = types[0] || 'Normal';
    const secondaryType = types[1];

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
      Ice: [
        { name: 'Powder Snow', type: 'Ice', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Ice Shard', type: 'Ice', power: 40, accuracy: 100, damageClass: 'physical' },
        { name: 'Ice Beam', type: 'Ice', power: 90, accuracy: 100, damageClass: 'special' },
        { name: 'Blizzard', type: 'Ice', power: 110, accuracy: 70, damageClass: 'special' }
      ],
      Fighting: [
        { name: 'Karate Chop', type: 'Fighting', power: 50, accuracy: 100, damageClass: 'physical' },
        { name: 'Low Kick', type: 'Fighting', power: 50, accuracy: 100, damageClass: 'physical' },
        { name: 'Cross Chop', type: 'Fighting', power: 100, accuracy: 80, damageClass: 'physical' },
        { name: 'Close Combat', type: 'Fighting', power: 120, accuracy: 100, damageClass: 'physical' }
      ],
      Poison: [
        { name: 'Poison Sting', type: 'Poison', power: 15, accuracy: 100, damageClass: 'physical' },
        { name: 'Acid', type: 'Poison', power: 40, accuracy: 100, damageClass: 'special' },
        { name: 'Sludge', type: 'Poison', power: 65, accuracy: 100, damageClass: 'special' },
        { name: 'Sludge Bomb', type: 'Poison', power: 90, accuracy: 100, damageClass: 'special' }
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
      Psychic: [
        { name: 'Confusion', type: 'Psychic', power: 50, accuracy: 100, damageClass: 'special' },
        { name: 'Psybeam', type: 'Psychic', power: 65, accuracy: 100, damageClass: 'special' },
        { name: 'Psychic', type: 'Psychic', power: 90, accuracy: 100, damageClass: 'special' },
        { name: 'Psyshock', type: 'Psychic', power: 80, accuracy: 100, damageClass: 'special' }
      ],
      Bug: [
        { name: 'Bug Bite', type: 'Bug', power: 60, accuracy: 100, damageClass: 'physical' },
        { name: 'X-Scissor', type: 'Bug', power: 80, accuracy: 100, damageClass: 'physical' },
        { name: 'Signal Beam', type: 'Bug', power: 75, accuracy: 100, damageClass: 'special' },
        { name: 'Bug Buzz', type: 'Bug', power: 90, accuracy: 100, damageClass: 'special' }
      ],
      Rock: [
        { name: 'Rock Throw', type: 'Rock', power: 50, accuracy: 90, damageClass: 'physical' },
        { name: 'Rock Slide', type: 'Rock', power: 75, accuracy: 90, damageClass: 'physical' },
        { name: 'Stone Edge', type: 'Rock', power: 100, accuracy: 80, damageClass: 'physical' },
        { name: 'Power Gem', type: 'Rock', power: 80, accuracy: 100, damageClass: 'special' }
      ],
      Ghost: [
        { name: 'Lick', type: 'Ghost', power: 30, accuracy: 100, damageClass: 'physical' },
        { name: 'Shadow Punch', type: 'Ghost', power: 60, accuracy: 100, damageClass: 'physical' },
        { name: 'Shadow Ball', type: 'Ghost', power: 80, accuracy: 100, damageClass: 'special' },
        { name: 'Hex', type: 'Ghost', power: 65, accuracy: 100, damageClass: 'special' }
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

    const moves = [...(typeMoves[primaryType] || typeMoves.Normal)];
    
    if (secondaryType && typeMoves[secondaryType]) {
      const secondaryMoves = typeMoves[secondaryType];
      moves.splice(2, 1, secondaryMoves[Math.floor(Math.random() * secondaryMoves.length)]);
    }

    return moves.slice(0, 4);
  }

  selectWildPokemonMove(pokemon, level) {
    const moves = this.getWildPokemonMoves(pokemon, level);
    
    const validMoves = moves.filter(m => {
      const minLevel = m.power > 80 ? 25 : m.power > 50 ? 10 : 1;
      return level >= minLevel;
    });

    if (validMoves.length === 0) return moves[0];

    const weights = validMoves.map(m => {
      let weight = 1;
      if (m.power > 80) weight = 0.3;
      else if (m.power > 50) weight = 0.5;
      else weight = 0.7;
      return weight;
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < validMoves.length; i++) {
      random -= weights[i];
      if (random <= 0) return validMoves[i];
    }

    return validMoves[0];
  }

  calculateCompanionStats(companion) {
    // Always recalculate stats using level, EVs, IVs, and nature - never use cached stats
    const pokemonBaseStats = this.getBaseStats(companion.id || companion.pokemon?.id);
    const level = companion.level || 1;
    
    const ivs = companion.ivs || { hp: 15, attack: 15, defense: 15, spAttack: 15, spDefense: 15, speed: 15 };
    const evs = companion.evs || { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
    const nature = companion.nature || 'Hardy';

    console.log('[BattleService] Calculating stats for:', companion.name, 'Level:', level, 'EVs:', evs, 'IVs:', ivs, 'Nature:', nature);

    const calculatedStats = {
      hp: this.calculateHP(pokemonBaseStats.hp, level, evs.hp, ivs.hp),
      attack: this.calculateStat(pokemonBaseStats.attack, level, evs.attack, ivs.attack, this.getNatureModifier(nature, 'attack')),
      defense: this.calculateStat(pokemonBaseStats.defense, level, evs.defense, ivs.defense, this.getNatureModifier(nature, 'defense')),
      spAttack: this.calculateStat(pokemonBaseStats.spAttack, level, evs.spAttack, ivs.spAttack, this.getNatureModifier(nature, 'spAttack')),
      spDefense: this.calculateStat(pokemonBaseStats.spDefense, level, evs.spDefense, ivs.spDefense, this.getNatureModifier(nature, 'spDefense')),
      speed: this.calculateStat(pokemonBaseStats.speed, level, evs.speed, ivs.speed, this.getNatureModifier(nature, 'speed'))
    };

    console.log('[BattleService] Calculated stats:', calculatedStats);
    return calculatedStats;
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
      2: { hp: 60, attack: 62, defense: 63, spAttack: 80, spDefense: 80, speed: 60 },
      3: { hp: 80, attack: 82, defense: 83, spAttack: 100, spDefense: 100, speed: 80 },
      4: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 },
      5: { hp: 58, attack: 64, defense: 58, spAttack: 80, spDefense: 65, speed: 80 },
      6: { hp: 78, attack: 84, defense: 78, spAttack: 109, spDefense: 85, speed: 100 },
      7: { hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43 },
      8: { hp: 59, attack: 63, defense: 80, spAttack: 65, spDefense: 80, speed: 58 },
      9: { hp: 79, attack: 83, defense: 100, spAttack: 85, spDefense: 105, speed: 78 },
      10: { hp: 45, attack: 30, defense: 35, spAttack: 20, spDefense: 20, speed: 45 },
      13: { hp: 40, attack: 35, defense: 30, spAttack: 20, spDefense: 20, speed: 50 },
      16: { hp: 40, attack: 45, defense: 40, spAttack: 35, spDefense: 35, speed: 56 },
      19: { hp: 30, attack: 56, defense: 35, spAttack: 25, spDefense: 35, speed: 72 },
      21: { hp: 40, attack: 60, defense: 30, spAttack: 31, spDefense: 31, speed: 70 },
      23: { hp: 35, attack: 60, defense: 44, spAttack: 40, spDefense: 54, speed: 55 },
      25: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 },
      26: { hp: 60, attack: 90, defense: 55, spAttack: 90, spDefense: 80, speed: 110 },
      27: { hp: 50, attack: 75, defense: 85, spAttack: 20, spDefense: 30, speed: 40 },
      29: { hp: 55, attack: 47, defense: 52, spAttack: 40, spDefense: 40, speed: 41 },
      32: { hp: 46, attack: 57, defense: 40, spAttack: 40, spDefense: 40, speed: 50 },
      35: { hp: 70, attack: 45, defense: 48, spAttack: 60, spDefense: 65, speed: 35 },
      37: { hp: 38, attack: 41, defense: 40, spAttack: 50, spDefense: 65, speed: 65 },
      39: { hp: 115, attack: 45, defense: 20, spAttack: 45, spDefense: 25, speed: 20 },
      41: { hp: 40, attack: 45, defense: 35, spAttack: 30, spDefense: 40, speed: 55 },
      43: { hp: 45, attack: 50, defense: 55, spAttack: 75, spDefense: 65, speed: 30 },
      46: { hp: 35, attack: 70, defense: 55, spAttack: 45, spDefense: 55, speed: 25 },
      48: { hp: 60, attack: 55, defense: 50, spAttack: 40, spDefense: 55, speed: 45 },
      50: { hp: 10, attack: 55, defense: 25, spAttack: 35, spDefense: 45, speed: 95 },
      52: { hp: 40, attack: 45, defense: 35, spAttack: 40, spDefense: 40, speed: 90 },
      54: { hp: 50, attack: 52, defense: 48, spAttack: 65, spDefense: 50, speed: 55 },
      56: { hp: 40, attack: 80, defense: 35, spAttack: 35, spDefense: 45, speed: 70 },
      58: { hp: 55, attack: 70, defense: 45, spAttack: 70, spDefense: 50, speed: 60 },
      60: { hp: 40, attack: 50, defense: 40, spAttack: 40, spDefense: 40, speed: 90 },
      63: { hp: 25, attack: 20, defense: 15, spAttack: 105, spDefense: 55, speed: 90 },
      66: { hp: 70, attack: 80, defense: 50, spAttack: 35, spDefense: 35, speed: 35 },
      69: { hp: 50, attack: 75, defense: 35, spAttack: 70, spDefense: 30, speed: 40 },
      72: { hp: 40, attack: 40, defense: 35, spAttack: 50, spDefense: 100, speed: 70 },
      74: { hp: 40, attack: 80, defense: 100, spAttack: 30, spDefense: 30, speed: 20 },
      77: { hp: 50, attack: 85, defense: 55, spAttack: 65, spDefense: 65, speed: 90 },
      79: { hp: 90, attack: 65, defense: 65, spAttack: 40, spDefense: 40, speed: 15 },
      81: { hp: 25, attack: 35, defense: 70, spAttack: 95, spDefense: 55, speed: 45 },
      84: { hp: 35, attack: 85, defense: 45, spAttack: 35, spDefense: 35, speed: 75 },
      86: { hp: 65, attack: 45, defense: 55, spAttack: 45, spDefense: 70, speed: 45 },
      88: { hp: 80, attack: 80, defense: 50, spAttack: 40, spDefense: 50, speed: 25 },
      90: { hp: 30, attack: 65, defense: 100, spAttack: 45, spDefense: 25, speed: 40 },
      92: { hp: 30, attack: 35, defense: 30, spAttack: 100, spDefense: 35, speed: 80 },
      93: { hp: 45, attack: 50, defense: 45, spAttack: 115, spDefense: 55, speed: 95 },
      94: { hp: 60, attack: 65, defense: 60, spAttack: 130, spDefense: 75, speed: 110 },
      95: { hp: 35, attack: 45, defense: 160, spAttack: 30, spDefense: 45, speed: 70 },
      96: { hp: 60, attack: 48, defense: 45, spAttack: 43, spDefense: 90, speed: 42 },
      98: { hp: 30, attack: 105, defense: 90, spAttack: 25, spDefense: 25, speed: 50 },
      100: { hp: 40, attack: 30, defense: 50, spAttack: 55, spDefense: 55, speed: 100 },
      102: { hp: 60, attack: 40, defense: 80, spAttack: 60, spDefense: 45, speed: 40 },
      104: { hp: 50, attack: 50, defense: 95, spAttack: 40, spDefense: 50, speed: 35 },
      108: { hp: 90, attack: 55, defense: 75, spAttack: 60, spDefense: 75, speed: 30 },
      109: { hp: 40, attack: 65, defense: 95, spAttack: 60, spDefense: 45, speed: 35 },
      111: { hp: 80, attack: 85, defense: 95, spAttack: 30, spDefense: 30, speed: 25 },
      114: { hp: 65, attack: 55, defense: 115, spAttack: 100, spDefense: 40, speed: 60 },
      115: { hp: 105, attack: 95, defense: 80, spAttack: 40, spDefense: 80, speed: 90 },
      116: { hp: 30, attack: 40, defense: 70, spAttack: 70, spDefense: 25, speed: 60 },
      118: { hp: 45, attack: 67, defense: 60, spAttack: 35, spDefense: 50, speed: 63 },
      120: { hp: 30, attack: 45, defense: 55, spAttack: 70, spDefense: 55, speed: 85 },
      123: { hp: 70, attack: 110, defense: 80, spAttack: 55, spDefense: 80, speed: 105 },
      127: { hp: 65, attack: 125, defense: 100, spAttack: 55, spDefense: 70, speed: 85 },
      128: { hp: 75, attack: 100, defense: 95, spAttack: 40, spDefense: 70, speed: 110 },
      129: { hp: 20, attack: 10, defense: 55, spAttack: 15, spDefense: 20, speed: 80 },
      130: { hp: 95, attack: 125, defense: 79, spAttack: 60, spDefense: 100, speed: 81 },
      131: { hp: 130, attack: 85, defense: 80, spAttack: 85, spDefense: 95, speed: 60 },
      133: { hp: 55, attack: 55, defense: 50, spAttack: 45, spDefense: 65, speed: 55 },
      137: { hp: 65, attack: 60, defense: 70, spAttack: 85, spDefense: 75, speed: 40 },
      138: { hp: 35, attack: 40, defense: 100, spAttack: 90, spDefense: 55, speed: 35 },
      140: { hp: 30, attack: 80, defense: 90, spAttack: 55, spDefense: 45, speed: 55 },
      142: { hp: 80, attack: 105, defense: 65, spAttack: 60, spDefense: 75, speed: 130 },
      143: { hp: 160, attack: 110, defense: 65, spAttack: 65, spDefense: 110, speed: 30 },
      144: { hp: 90, attack: 85, defense: 100, spAttack: 95, spDefense: 125, speed: 85 },
      145: { hp: 90, attack: 90, defense: 85, spAttack: 125, spDefense: 90, speed: 100 },
      146: { hp: 90, attack: 100, defense: 90, spAttack: 125, spDefense: 85, speed: 90 },
      147: { hp: 41, attack: 64, defense: 45, spAttack: 50, spDefense: 50, speed: 50 },
      148: { hp: 61, attack: 84, defense: 65, spAttack: 70, spDefense: 70, speed: 70 },
      149: { hp: 91, attack: 134, defense: 95, spAttack: 100, spDefense: 100, speed: 80 },
      150: { hp: 106, attack: 110, defense: 90, spAttack: 154, spDefense: 90, speed: 130 },
      151: { hp: 100, attack: 100, defense: 100, spAttack: 100, spDefense: 100, speed: 100 }
    };

    return baseStatsMap[pokemonId] || { hp: 50, attack: 50, defense: 50, spAttack: 50, spDefense: 50, speed: 50 };
  }
}

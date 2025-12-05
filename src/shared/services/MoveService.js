export class MoveService {
  constructor() {
    this.baseUrl = 'https://pokeapi.co/api/v2';
    this.moveCache = new Map();
    this.pokemonMovesCache = new Map();
  }

  async getMove(moveName) {
    const cacheKey = moveName.toLowerCase().replace(/\s+/g, '-');
    
    if (this.moveCache.has(cacheKey)) {
      return this.moveCache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}/move/${cacheKey}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      const move = {
        id: data.id,
        name: this.formatMoveName(data.name),
        apiName: data.name,
        type: this.capitalize(data.type.name),
        power: data.power,
        accuracy: data.accuracy ?? 100,
        pp: data.pp ?? 10,
        damageClass: data.damage_class.name,
        priority: data.priority ?? 0,
        effectChance: data.effect_chance,
        effect: data.effect_entries.find(e => e.language.name === 'en')?.short_effect || '',
        meta: data.meta ? {
          ailment: data.meta.ailment?.name,
          ailmentChance: data.meta.ailment_chance,
          critRate: data.meta.crit_rate,
          drain: data.meta.drain,
          flinchChance: data.meta.flinch_chance,
          healing: data.meta.healing,
          statChance: data.meta.stat_chance
        } : null
      };
      
      this.moveCache.set(cacheKey, move);
      return move;
    } catch (error) {
      console.error(`[MoveService] Error fetching move ${moveName}:`, error);
      return null;
    }
  }

  async getPokemonMoves(pokemonId) {
    if (this.pokemonMovesCache.has(pokemonId)) {
      return this.pokemonMovesCache.get(pokemonId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/pokemon/${pokemonId}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      
      const levelUpMoves = data.moves
        .filter(m => m.version_group_details.some(v => 
          v.move_learn_method.name === 'level-up' && 
          v.level_learned_at <= 50
        ))
        .slice(0, 20);
      
      const movePromises = levelUpMoves.map(m => this.getMove(m.move.name));
      const moves = await Promise.all(movePromises);
      
      const damagingMoves = moves.filter(m => m !== null && m.damageClass !== 'status');
      const statusMoves = moves.filter(m => m !== null && m.damageClass === 'status');
      
      damagingMoves.sort((a, b) => (b.power ?? 0) - (a.power ?? 0));
      const topMoves = damagingMoves.slice(0, 4);
      
      if (topMoves.length < 4) {
        topMoves.push(...statusMoves.slice(0, 4 - topMoves.length));
      }
      
      this.pokemonMovesCache.set(pokemonId, topMoves);
      return topMoves;
    } catch (error) {
      console.error(`[MoveService] Error fetching Pokemon moves for ${pokemonId}:`, error);
      return [];
    }
  }

  async getPokemonAbilities(pokemonId) {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon/${pokemonId}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      const abilityPromises = data.abilities.map(async (a) => {
        const abilityResponse = await fetch(a.ability.url);
        const abilityData = await abilityResponse.json();
        return {
          name: this.formatMoveName(a.ability.name),
          isHidden: a.is_hidden,
          effect: abilityData.effect_entries.find(e => e.language.name === 'en')?.short_effect || ''
        };
      });
      
      return Promise.all(abilityPromises);
    } catch (error) {
      console.error(`[MoveService] Error fetching abilities for ${pokemonId}:`, error);
      return [];
    }
  }

  getDefaultMovesForType(type) {
    const movesByType = {
      'Electric': [
        { name: 'Thunderbolt', type: 'Electric', power: 90, accuracy: 100, pp: 15, effect: 'May paralyze target.' },
        { name: 'Thunder Wave', type: 'Electric', power: 0, accuracy: 90, pp: 20, effect: 'Paralyzes the target.' },
        { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100, pp: 30, effect: 'Always strikes first.' },
        { name: 'Thunder', type: 'Electric', power: 110, accuracy: 70, pp: 10, effect: 'May paralyze. High power but low accuracy.' }
      ],
      'Fire': [
        { name: 'Flamethrower', type: 'Fire', power: 90, accuracy: 100, pp: 15, effect: 'May burn the target.' },
        { name: 'Ember', type: 'Fire', power: 40, accuracy: 100, pp: 25, effect: 'May burn the target.' },
        { name: 'Fire Spin', type: 'Fire', power: 35, accuracy: 85, pp: 15, effect: 'Traps foe for 4-5 turns.' },
        { name: 'Scratch', type: 'Normal', power: 40, accuracy: 100, pp: 35, effect: 'Scratches with sharp claws.' }
      ],
      'Water': [
        { name: 'Surf', type: 'Water', power: 90, accuracy: 100, pp: 15, effect: 'Hits all adjacent Pokemon.' },
        { name: 'Water Gun', type: 'Water', power: 40, accuracy: 100, pp: 25, effect: 'Squirts water at the foe.' },
        { name: 'Bubble Beam', type: 'Water', power: 65, accuracy: 100, pp: 20, effect: 'May lower Speed.' },
        { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, pp: 35, effect: 'Charges and tackles.' }
      ],
      'Grass': [
        { name: 'Razor Leaf', type: 'Grass', power: 55, accuracy: 95, pp: 25, effect: 'High critical hit ratio.' },
        { name: 'Vine Whip', type: 'Grass', power: 45, accuracy: 100, pp: 25, effect: 'Whips with vines.' },
        { name: 'Leech Seed', type: 'Grass', power: 0, accuracy: 90, pp: 10, effect: 'Drains HP each turn.' },
        { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, pp: 35, effect: 'Charges and tackles.' }
      ],
      'Normal': [
        { name: 'Hyper Beam', type: 'Normal', power: 150, accuracy: 90, pp: 5, effect: 'Must recharge next turn.' },
        { name: 'Body Slam', type: 'Normal', power: 85, accuracy: 100, pp: 15, effect: 'May paralyze.' },
        { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100, pp: 30, effect: 'Always strikes first.' },
        { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, pp: 35, effect: 'Charges and tackles.' }
      ],
      'Psychic': [
        { name: 'Psychic', type: 'Psychic', power: 90, accuracy: 100, pp: 10, effect: 'May lower Sp. Def.' },
        { name: 'Psybeam', type: 'Psychic', power: 65, accuracy: 100, pp: 20, effect: 'May confuse.' },
        { name: 'Confusion', type: 'Psychic', power: 50, accuracy: 100, pp: 25, effect: 'May confuse.' },
        { name: 'Swift', type: 'Normal', power: 60, accuracy: 100, pp: 20, effect: 'Never misses.' }
      ],
      'Ghost': [
        { name: 'Shadow Ball', type: 'Ghost', power: 80, accuracy: 100, pp: 15, effect: 'May lower Sp. Def.' },
        { name: 'Lick', type: 'Ghost', power: 30, accuracy: 100, pp: 30, effect: 'May paralyze.' },
        { name: 'Night Shade', type: 'Ghost', power: 0, accuracy: 100, pp: 15, effect: 'Deals damage equal to level.' },
        { name: 'Hypnosis', type: 'Psychic', power: 0, accuracy: 60, pp: 20, effect: 'Puts foe to sleep.' }
      ],
      'Dragon': [
        { name: 'Dragon Claw', type: 'Dragon', power: 80, accuracy: 100, pp: 15, effect: 'Slashes with sharp claws.' },
        { name: 'Dragon Rage', type: 'Dragon', power: 0, accuracy: 100, pp: 10, effect: 'Always deals 40 damage.' },
        { name: 'Outrage', type: 'Dragon', power: 120, accuracy: 100, pp: 10, effect: 'Attacks 2-3 turns, then confuses.' },
        { name: 'Slam', type: 'Normal', power: 80, accuracy: 75, pp: 20, effect: 'Slams with body.' }
      ],
      'Ice': [
        { name: 'Ice Beam', type: 'Ice', power: 90, accuracy: 100, pp: 10, effect: 'May freeze target.' },
        { name: 'Blizzard', type: 'Ice', power: 110, accuracy: 70, pp: 5, effect: 'May freeze. Hits all foes.' },
        { name: 'Ice Shard', type: 'Ice', power: 40, accuracy: 100, pp: 30, effect: 'Always strikes first.' },
        { name: 'Peck', type: 'Flying', power: 35, accuracy: 100, pp: 35, effect: 'Jabs with sharp beak.' }
      ],
      'Flying': [
        { name: 'Aerial Ace', type: 'Flying', power: 60, accuracy: 100, pp: 20, effect: 'Never misses.' },
        { name: 'Wing Attack', type: 'Flying', power: 60, accuracy: 100, pp: 35, effect: 'Strikes with wings.' },
        { name: 'Gust', type: 'Flying', power: 40, accuracy: 100, pp: 35, effect: 'Whips up a gust of wind.' },
        { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100, pp: 30, effect: 'Always strikes first.' }
      ]
    };

    return movesByType[type] || movesByType['Normal'];
  }

  formatMoveName(name) {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

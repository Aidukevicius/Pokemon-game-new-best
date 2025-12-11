// Encounter Service - Handles Pokemon encounter generation
import { POKEMON_DATABASE, RARITY_WEIGHTS, getPokemonByRarity } from '../data/pokemon-database.js';
import { getRandomInt, weightedRandomChoice } from '../utils/random.js';
import { calculateHP, calculateStat, generateRandomIVs, getDefaultEVs, getNatureModifier } from '../utils/stats.js';

export class EncounterService {
  constructor() {
    this.encounterHistory = [];
  }

  /**
   * Generate a new Pokemon encounter based on rarity weights and companion level
   * Uses Pokemon game logic for opponent level scaling
   * @param {string} siteCategory - Website category to bias encounters (e.g., 'electric', 'water', 'normal')
   * @param {number} companionLevel - Current companion Pokemon level (default 1)
   * @returns {Object} Encounter object with Pokemon, level, and IVs
   */
  generateEncounter(siteCategory = 'normal', companionLevel = 1) {
    // Select rarity tier based on weights
    const rarities = Object.keys(RARITY_WEIGHTS);
    const weights = Object.values(RARITY_WEIGHTS);
    const selectedRarity = weightedRandomChoice(rarities, weights);
    
    // Get all Pokemon of selected rarity
    let pokemonOfRarity = getPokemonByRarity(selectedRarity);
    
    // Bias encounters based on website category (70% chance of matching type)
    const shouldBiasType = Math.random() < 0.7;
    if (shouldBiasType && siteCategory !== 'normal') {
      // Filter Pokemon that match the site category type
      const typedPokemon = pokemonOfRarity.filter(p => 
        p.types.some(type => type.toLowerCase() === siteCategory.toLowerCase())
      );
      
      // Use typed Pokemon if available, otherwise use full pool
      if (typedPokemon.length > 0) {
        pokemonOfRarity = typedPokemon;
      }
    }
    
    // Weighted selection within rarity based on encounter rates
    const encounterWeights = pokemonOfRarity.map(p => p.encounterRate);
    const selectedIndex = weightedRandomChoice(
      pokemonOfRarity.map((_, i) => i),
      encounterWeights
    );
    
    const pokemon = pokemonOfRarity[selectedIndex];
    
    // Calculate opponent level based on companion level (Pokemon game style)
    const level = this.calculateOpponentLevel(companionLevel, selectedRarity);
    
    // Generate random IVs (Individual Values - 0-31 for each stat)
    const ivs = generateRandomIVs();
    
    // Wild Pokemon start with 0 EVs
    const evs = getDefaultEVs();
    
    // Generate random nature
    const natures = [
      'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
      'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
      'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
      'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
      'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
    ];
    const nature = natures[getRandomInt(0, natures.length - 1)];
    
    // Calculate actual stats using official Pokemon formula (Base Stats + IVs + EVs + Nature)
    const stats = this.calculateStatsOfficial(pokemon.baseStats, ivs, evs, level, nature);
    
    const encounter = {
      pokemon: {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        baseStats: pokemon.baseStats,
        catchRate: pokemon.catchRate,
        rarity: pokemon.rarity
      },
      level,
      ivs,
      evs,
      nature,
      stats,
      currentHp: stats.hp,
      maxHp: stats.hp,
      timestamp: Date.now()
    };
    
    this.encounterHistory.push(encounter);
    return encounter;
  }

  /**
   * Calculate actual stats using official Pokemon formula (Gen 3+)
   * HP: floor(((2 * Base + IV + floor(EV/4)) * Level) / 100) + Level + 10
   * Other: floor((floor(((2 * Base + IV + floor(EV/4)) * Level) / 100) + 5) * Nature)
   */
  calculateStatsOfficial(baseStats, ivs, evs, level, nature) {
    return {
      hp: calculateHP(baseStats.hp, level, evs.hp, ivs.hp),
      attack: calculateStat(baseStats.attack, level, evs.attack, ivs.attack, getNatureModifier(nature, 'attack')),
      defense: calculateStat(baseStats.defense, level, evs.defense, ivs.defense, getNatureModifier(nature, 'defense')),
      spAttack: calculateStat(baseStats.spAttack, level, evs.spAttack, ivs.spAttack, getNatureModifier(nature, 'spAttack')),
      spDefense: calculateStat(baseStats.spDefense, level, evs.spDefense, ivs.spDefense, getNatureModifier(nature, 'spDefense')),
      speed: calculateStat(baseStats.speed, level, evs.speed, ivs.speed, getNatureModifier(nature, 'speed'))
    };
  }

  /**
   * Calculate opponent level based on companion level - Pokemon game style scaling
   * Wild Pokemon levels scale with your Pokemon's level, with variance based on rarity
   * This mimics how routes in Pokemon games have level ranges relative to game progression
   * @param {number} companionLevel - Player's companion level
   * @param {string} rarity - Pokemon rarity tier
   * @returns {number} Opponent level
   */
  calculateOpponentLevel(companionLevel, rarity) {
    const level = Math.max(1, companionLevel);
    
    // Define level variance based on rarity
    // Common: within -2 to +3 of player level (slightly easier encounters)
    // Uncommon: within -1 to +5 of player level
    // Rare: within +2 to +8 of player level (challenging)
    // Legendary: within +5 to +15 of player level (very challenging)
    let minOffset, maxOffset;
    
    switch (rarity) {
      case 'common':
        minOffset = -2;
        maxOffset = 3;
        break;
      case 'uncommon':
        minOffset = -1;
        maxOffset = 5;
        break;
      case 'rare':
        minOffset = 2;
        maxOffset = 8;
        break;
      case 'legendary':
        minOffset = 5;
        maxOffset = 15;
        break;
      default:
        minOffset = -2;
        maxOffset = 3;
    }
    
    // Calculate level range
    const minLevel = Math.max(1, level + minOffset);
    const maxLevel = Math.min(100, level + maxOffset);
    
    // Random level within the range
    const opponentLevel = getRandomInt(minLevel, maxLevel);
    
    console.log(`[EncounterService] Generating ${rarity} opponent: companion level ${level}, opponent level ${opponentLevel} (range: ${minLevel}-${maxLevel})`);
    
    return opponentLevel;
  }

  getMaxLevelForRarity(rarity, companionLevel = 1) {
    const level = Math.max(1, companionLevel);
    switch (rarity) {
      case 'common': return Math.min(100, level + 3);
      case 'uncommon': return Math.min(100, level + 5);
      case 'rare': return Math.min(100, level + 8);
      case 'legendary': return Math.min(100, level + 15);
      default: return Math.min(100, level + 3);
    }
  }

  getMinLevelForRarity(rarity, companionLevel = 1) {
    const level = Math.max(1, companionLevel);
    switch (rarity) {
      case 'common': return Math.max(1, level - 2);
      case 'uncommon': return Math.max(1, level - 1);
      case 'rare': return Math.max(1, level + 2);
      case 'legendary': return Math.max(1, level + 5);
      default: return Math.max(1, level - 2);
    }
  }

  getEncounterHistory() {
    return this.encounterHistory;
  }
}

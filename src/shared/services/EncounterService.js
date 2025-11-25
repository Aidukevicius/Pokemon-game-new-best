// Encounter Service - Handles Pokemon encounter generation
import { POKEMON_DATABASE, RARITY_WEIGHTS, getPokemonByRarity } from '../data/pokemon-database.js';
import { getRandomInt, weightedRandomChoice } from '../utils/random.js';

export class EncounterService {
  constructor() {
    this.encounterHistory = [];
  }

  /**
   * Generate a new Pokemon encounter based on rarity weights
   * @param {string} siteCategory - Website category to bias encounters (e.g., 'electric', 'water', 'normal')
   * @returns {Object} Encounter object with Pokemon, level, and IVs
   */
  generateEncounter(siteCategory = 'normal') {
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
    
    // Generate random level (1-50 for common, up to 70 for legendary)
    const maxLevel = this.getMaxLevelForRarity(selectedRarity);
    const minLevel = selectedRarity === 'legendary' ? 50 : 1;
    const level = getRandomInt(minLevel, maxLevel);
    
    // Generate random IVs (Individual Values - 0-31 for each stat)
    const ivs = {
      hp: getRandomInt(0, 31),
      attack: getRandomInt(0, 31),
      defense: getRandomInt(0, 31),
      spAttack: getRandomInt(0, 31),
      spDefense: getRandomInt(0, 31),
      speed: getRandomInt(0, 31)
    };
    
    // Generate random nature
    const natures = [
      'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
      'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
      'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
      'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
      'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
    ];
    const nature = natures[getRandomInt(0, natures.length - 1)];
    
    // Calculate actual stats based on base stats, IVs, and level
    const stats = this.calculateStats(pokemon.baseStats, ivs, level);
    
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
   * Calculate actual stats from base stats, IVs, and level
   * Using Gen 1 stat calculation formula
   */
  calculateStats(baseStats, ivs, level) {
    const calculateStat = (base, iv, level, isHp = false) => {
      if (isHp) {
        // HP formula: ((Base + IV) * 2 * Level / 100) + Level + 10
        return Math.floor(((base + iv) * 2 * level / 100) + level + 10);
      } else {
        // Other stats: ((Base + IV) * 2 * Level / 100) + 5
        return Math.floor(((base + iv) * 2 * level / 100) + 5);
      }
    };

    return {
      hp: calculateStat(baseStats.hp, ivs.hp, level, true),
      attack: calculateStat(baseStats.attack, ivs.attack, level),
      defense: calculateStat(baseStats.defense, ivs.defense, level),
      spAttack: calculateStat(baseStats.spAttack, ivs.spAttack, level),
      spDefense: calculateStat(baseStats.spDefense, ivs.spDefense, level),
      speed: calculateStat(baseStats.speed, ivs.speed, level)
    };
  }

  getMaxLevelForRarity(rarity) {
    switch (rarity) {
      case 'common': return 30;
      case 'uncommon': return 45;
      case 'rare': return 60;
      case 'legendary': return 70;
      default: return 30;
    }
  }

  getEncounterHistory() {
    return this.encounterHistory;
  }
}

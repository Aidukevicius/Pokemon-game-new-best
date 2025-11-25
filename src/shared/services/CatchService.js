// Catch Service - Handles Pokemon catching mechanics
import { StorageService } from './StorageService.js';
import { getRandomInt } from '../utils/random.js';

export class CatchService {
  constructor() {
    this.storage = new StorageService();
  }

  /**
   * Attempt to catch a Pokemon using Gen 1 catch rate formula
   * @param {Object} encounter - The encounter object with Pokemon data
   * @param {string} ballType - Type of Pokeball used (default: 'pokeball')
   * @returns {Object} Result of catch attempt
   */
  async attemptCatch(encounter, ballType = 'pokeball') {
    // Check if player has Pokeballs
    const inventory = await this.storage.get('inventory') || { pokeballs: 5, greatballs: 0, ultraballs: 0 };
    const ballCount = inventory[ballType + 's'] || 0;
    
    if (ballCount <= 0) {
      return {
        success: false,
        reason: 'no_pokeballs',
        message: `You don't have any ${ballType}s!`
      };
    }

    // Use one Pokeball
    inventory[ballType + 's']--;
    await this.storage.set('inventory', inventory);

    // Calculate catch rate using Gen 1 formula
    const catchSuccess = this.calculateCatchSuccess(encounter, ballType);
    
    if (catchSuccess) {
      // Pokemon caught!
      await this.saveCaughtPokemon(encounter);
      
      // Award coins for catching
      const coinReward = this.calculateCoinReward(encounter.pokemon.rarity);
      const playerData = await this.storage.get('playerData') || { coins: 0 };
      playerData.coins = (playerData.coins || 0) + coinReward;
      await this.storage.set('playerData', playerData);
      
      return {
        success: true,
        pokemon: encounter,
        message: `${encounter.pokemon.name} was caught!`,
        coinReward,
        ballsRemaining: inventory[ballType + 's']
      };
    } else {
      // Pokemon escaped
      return {
        success: false,
        reason: 'escaped',
        message: `${encounter.pokemon.name} broke free!`,
        catchRate: this.getCatchRatePercentage(encounter, ballType),
        ballsRemaining: inventory[ballType + 's']
      };
    }
  }

  /**
   * Calculate catch success using Gen 1 formula
   * Formula: Success if random(0-255) < catchRate
   * catchRate = ((3 * maxHP - 2 * currentHP) * rate * ballBonus) / (3 * maxHP)
   */
  calculateCatchSuccess(encounter, ballType) {
    const { pokemon, currentHp, maxHp } = encounter;
    
    // Ball bonus multiplier
    const ballBonus = {
      pokeball: 1.0,
      greatball: 1.5,
      ultraball: 2.0
    }[ballType] || 1.0;
    
    // Gen 1 catch rate formula
    const numerator = (3 * maxHp - 2 * currentHp) * pokemon.catchRate * ballBonus;
    const denominator = 3 * maxHp;
    const catchRate = Math.floor(numerator / denominator);
    
    // Clamp between 1 and 255
    const finalRate = Math.max(1, Math.min(255, catchRate));
    
    // Roll 0-255, success if less than catch rate
    const roll = getRandomInt(0, 255);
    
    return roll < finalRate;
  }

  /**
   * Get catch rate as percentage for display
   */
  getCatchRatePercentage(encounter, ballType = 'pokeball') {
    const { pokemon, currentHp, maxHp } = encounter;
    const ballBonus = { pokeball: 1.0, greatball: 1.5, ultraball: 2.0 }[ballType] || 1.0;
    
    const numerator = (3 * maxHp - 2 * currentHp) * pokemon.catchRate * ballBonus;
    const denominator = 3 * maxHp;
    const catchRate = Math.floor(numerator / denominator);
    const finalRate = Math.max(1, Math.min(255, catchRate));
    
    return Math.round((finalRate / 255) * 100);
  }

  /**
   * Save caught Pokemon to player's collection
   */
  async saveCaughtPokemon(encounter) {
    const collection = await this.storage.get('pokemonCollection') || [];
    
    const caughtPokemon = {
      ...encounter,
      caughtAt: Date.now(),
      id: `${encounter.pokemon.id}-${Date.now()}` // Unique ID for this catch
    };
    
    collection.push(caughtPokemon);
    await this.storage.set('pokemonCollection', collection);
    
    // Update Pokedex (unique Pokemon seen/caught)
    const pokedex = await this.storage.get('pokedex') || {};
    pokedex[encounter.pokemon.id] = {
      id: encounter.pokemon.id,
      name: encounter.pokemon.name,
      caught: true,
      timesEncountered: (pokedex[encounter.pokemon.id]?.timesEncountered || 0) + 1,
      timesCaught: (pokedex[encounter.pokemon.id]?.timesCaught || 0) + 1,
      firstCaughtAt: pokedex[encounter.pokemon.id]?.firstCaughtAt || Date.now()
    };
    await this.storage.set('pokedex', pokedex);
  }

  /**
   * Calculate coin reward based on rarity
   */
  calculateCoinReward(rarity) {
    const rewards = {
      common: 10,
      uncommon: 25,
      rare: 50,
      legendary: 200
    };
    return rewards[rarity] || 10;
  }

  /**
   * Get current Pokeball count
   */
  async getPokeballCount(ballType = 'pokeball') {
    const inventory = await this.storage.get('inventory') || { pokeballs: 5 };
    return inventory[ballType + 's'] || 0;
  }

  /**
   * Get total Pokemon caught
   */
  async getTotalCaught() {
    const collection = await this.storage.get('pokemonCollection') || [];
    return collection.length;
  }
}

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
  async attemptCatch(encounter, ballType = 'poke-ball', serverInventory = null) {
    let ballsRemaining = 0;
    
    // If serverInventory provided, we're using server-side items
    if (serverInventory) {
      const ball = serverInventory.find(item => item.itemId === ballType);
      if (!ball || ball.quantity <= 0) {
        return {
          success: false,
          reason: 'no_pokeballs',
          message: `You don't have any ${this.getBallDisplayName(ballType)}s!`
        };
      }
      ballsRemaining = ball.quantity - 1;
    } else {
      // Fall back to local storage
      const inventory = await this.storage.get('inventory') || { 'poke-ball': 5 };
      const ballCount = inventory[ballType] || 0;
      
      if (ballCount <= 0) {
        return {
          success: false,
          reason: 'no_pokeballs',
          message: `You don't have any ${this.getBallDisplayName(ballType)}s!`
        };
      }
      inventory[ballType]--;
      ballsRemaining = inventory[ballType];
      await this.storage.set('inventory', inventory);
    }

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
        ballsRemaining
      };
    } else {
      // Pokemon escaped
      return {
        success: false,
        reason: 'escaped',
        message: `${encounter.pokemon.name} broke free!`,
        catchRate: this.getCatchRatePercentage(encounter, ballType),
        ballsRemaining
      };
    }
  }

  /**
   * Calculate catch success using Gen 1 formula
   * Formula: Success if random(0-255) < catchRate
   * catchRate = ((3 * maxHP - 2 * currentHP) * rate * ballBonus) / (3 * maxHP)
   */
  calculateCatchSuccess(encounter, ballType) {
    // Master Ball always catches
    if (ballType === 'master-ball') {
      return true;
    }
    
    const { pokemon, currentHp, maxHp } = encounter;
    
    // Ball bonus multiplier
    const ballBonus = {
      'poke-ball': 1.0,
      'great-ball': 1.5,
      'ultra-ball': 2.0
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
  getCatchRatePercentage(encounter, ballType = 'poke-ball') {
    if (ballType === 'master-ball') return 100;
    
    const { pokemon, currentHp, maxHp } = encounter;
    const ballBonus = { 'poke-ball': 1.0, 'great-ball': 1.5, 'ultra-ball': 2.0 }[ballType] || 1.0;
    
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
   * Get ball display name
   */
  getBallDisplayName(ballType) {
    const names = {
      'poke-ball': 'Poke Ball',
      'great-ball': 'Great Ball',
      'ultra-ball': 'Ultra Ball',
      'master-ball': 'Master Ball'
    };
    return names[ballType] || ballType;
  }

  /**
   * Get current Pokeball count
   */
  async getPokeballCount(ballType = 'poke-ball') {
    const inventory = await this.storage.get('inventory') || { 'poke-ball': 5 };
    return inventory[ballType] || 0;
  }

  /**
   * Get total Pokemon caught
   */
  async getTotalCaught() {
    const collection = await this.storage.get('pokemonCollection') || [];
    return collection.length;
  }
}

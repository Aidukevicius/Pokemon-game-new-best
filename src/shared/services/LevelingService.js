// Pokemon Leveling and EV System - Gen 3+ mechanics
// Experience formula based on official Pokemon games

export class LevelingService {
  constructor() {
    this.MAX_LEVEL = 100;
    this.MAX_TOTAL_EVS = 510;
    this.MAX_SINGLE_EV = 252;
  }

  // Gen 5+ experience formula for gaining XP
  calculateExperienceGain(defeatedPokemon, companionLevel, isWild = true) {
    const baseExp = defeatedPokemon.baseExp || this.getBaseExperience(defeatedPokemon.id);
    const defeatedLevel = defeatedPokemon.level || 5;
    
    // Scaled formula based on Pokemon games
    // EXP = (a * b * L) / (5 * s) * ((2L + 10)^2.5 / (L + Lp + 10)^2.5) + 1
    // Simplified version for our game
    const a = isWild ? 1 : 1.5; // Wild vs trainer battle
    const b = baseExp;
    const L = defeatedLevel;
    const Lp = companionLevel;
    
    // Scaling factor based on level difference
    const scaleFactor = Math.pow((2 * L + 10), 2.5) / Math.pow((L + Lp + 10), 2.5);
    
    let exp = Math.floor((a * b * L) / 5 * scaleFactor) + 1;
    
    // Minimum 1 EXP, maximum reasonable cap
    exp = Math.max(1, Math.min(exp, 10000));
    
    return exp;
  }

  // Experience needed for each level (Medium Fast growth rate)
  getExperienceForLevel(level) {
    if (level <= 1) return 0;
    if (level > 100) return this.getExperienceForLevel(100);
    
    // Medium Fast growth rate formula: n^3
    return Math.floor(Math.pow(level, 3));
  }

  // Get total experience needed to reach a level
  getTotalExperienceForLevel(level) {
    return this.getExperienceForLevel(level);
  }

  // Calculate new level from total experience
  getLevelFromExperience(totalExp) {
    for (let level = 100; level >= 1; level--) {
      if (totalExp >= this.getExperienceForLevel(level)) {
        return level;
      }
    }
    return 1;
  }

  // Check if leveling up and return new level info
  checkLevelUp(currentLevel, currentExp, expGained) {
    const newTotalExp = currentExp + expGained;
    const newLevel = this.getLevelFromExperience(newTotalExp);
    
    const levelsGained = newLevel - currentLevel;
    const expToNextLevel = this.getExperienceForLevel(newLevel + 1) - newTotalExp;
    
    return {
      levelsGained,
      newLevel: Math.min(newLevel, this.MAX_LEVEL),
      newTotalExp,
      expToNextLevel: Math.max(0, expToNextLevel),
      expForNextLevel: this.getExperienceForLevel(newLevel + 1) - this.getExperienceForLevel(newLevel),
      didLevelUp: levelsGained > 0
    };
  }

  // Get EV yield for a Pokemon (what EVs they give when defeated)
  getEVYield(pokemonId) {
    // Official Gen 1 Pokemon EV yields
    const evYields = {
      // Bulbasaur line - SpAtk
      1: { spAttack: 1 },
      2: { spAttack: 1, spDefense: 1 },
      3: { spAttack: 2, spDefense: 1 },
      // Charmander line - Speed/SpAtk
      4: { speed: 1 },
      5: { speed: 1, spAttack: 1 },
      6: { spAttack: 3 },
      // Squirtle line - Defense
      7: { defense: 1 },
      8: { defense: 1, spDefense: 1 },
      9: { spDefense: 3 },
      // Caterpie line - HP
      10: { hp: 1 },
      11: { defense: 2 },
      12: { spAttack: 2, spDefense: 1 },
      // Weedle line - Speed
      13: { speed: 1 },
      14: { defense: 2 },
      15: { attack: 2, spDefense: 1 },
      // Pidgey line - Speed
      16: { speed: 1 },
      17: { speed: 2 },
      18: { speed: 3 },
      // Rattata line - Speed
      19: { speed: 1 },
      20: { speed: 2 },
      // Spearow line - Speed
      21: { speed: 1 },
      22: { speed: 2 },
      // Ekans line - Attack
      23: { attack: 1 },
      24: { attack: 2 },
      // Pikachu line - Speed
      25: { speed: 2 },
      26: { speed: 3 },
      // Sandshrew line - Defense
      27: { defense: 1 },
      28: { defense: 2 },
      // Nidoran lines
      29: { hp: 1 },
      30: { hp: 2 },
      31: { hp: 3 },
      32: { attack: 1 },
      33: { attack: 2 },
      34: { attack: 3 },
      // Clefairy line - HP
      35: { hp: 2 },
      36: { hp: 3 },
      // Vulpix line - Speed
      37: { speed: 1 },
      38: { spDefense: 1, speed: 1 },
      // Jigglypuff line - HP
      39: { hp: 2 },
      40: { hp: 3 },
      // Zubat line - Speed
      41: { speed: 1 },
      42: { speed: 2 },
      // Oddish line - SpAtk
      43: { spAttack: 1 },
      44: { spAttack: 2 },
      45: { spAttack: 3 },
      // Paras line - Attack
      46: { attack: 1 },
      47: { attack: 2, defense: 1 },
      // Venonat line - SpDef
      48: { spDefense: 1 },
      49: { speed: 1, spAttack: 1 },
      // Diglett line - Speed
      50: { speed: 1 },
      51: { speed: 2 },
      // Meowth line - Speed
      52: { speed: 1 },
      53: { speed: 2 },
      // Psyduck line - SpAtk
      54: { spAttack: 1 },
      55: { spAttack: 2 },
      // Mankey line - Attack
      56: { attack: 1 },
      57: { attack: 2 },
      // Growlithe line - Attack
      58: { attack: 1 },
      59: { attack: 2 },
      // Poliwag line - Speed
      60: { speed: 1 },
      61: { speed: 2 },
      62: { defense: 3 },
      // Abra line - SpAtk
      63: { spAttack: 1 },
      64: { spAttack: 2 },
      65: { spAttack: 3 },
      // Machop line - Attack
      66: { attack: 1 },
      67: { attack: 2 },
      68: { attack: 3 },
      // Bellsprout line - Attack
      69: { attack: 1 },
      70: { attack: 2 },
      71: { attack: 3 },
      // Tentacool line - SpDef
      72: { spDefense: 1 },
      73: { spDefense: 2 },
      // Geodude line - Defense
      74: { defense: 1 },
      75: { defense: 2 },
      76: { defense: 3 },
      // Ponyta line - Speed
      77: { speed: 1 },
      78: { speed: 2 },
      // Slowpoke line - HP
      79: { hp: 1 },
      80: { defense: 2 },
      // Magnemite line - SpAtk
      81: { spAttack: 1 },
      82: { spAttack: 2 },
      // Farfetch'd
      83: { attack: 1 },
      // Doduo line - Attack
      84: { attack: 1 },
      85: { attack: 2 },
      // Seel line - SpDef
      86: { spDefense: 1 },
      87: { spDefense: 2 },
      // Grimer line - HP
      88: { hp: 1 },
      89: { hp: 1, attack: 1 },
      // Shellder line - Defense
      90: { defense: 1 },
      91: { defense: 2 },
      // Gastly line - SpAtk
      92: { spAttack: 1 },
      93: { spAttack: 2 },
      94: { spAttack: 3 },
      // Onix - Defense
      95: { defense: 1 },
      // Drowzee line - SpDef
      96: { spDefense: 1 },
      97: { spDefense: 2 },
      // Krabby line - Attack
      98: { attack: 1 },
      99: { attack: 2 },
      // Voltorb line - Speed
      100: { speed: 1 },
      101: { speed: 2 },
      // Exeggcute line - Defense
      102: { defense: 1 },
      103: { spAttack: 2 },
      // Cubone line - Defense
      104: { defense: 1 },
      105: { defense: 2 },
      // Hitmonlee/Hitmonchan
      106: { attack: 2 },
      107: { spDefense: 2 },
      // Lickitung - HP
      108: { hp: 2 },
      // Koffing line - Defense
      109: { defense: 1 },
      110: { defense: 2 },
      // Rhyhorn line - Defense
      111: { defense: 1 },
      112: { attack: 2 },
      // Chansey - HP
      113: { hp: 2 },
      // Tangela - Defense
      114: { defense: 1 },
      // Kangaskhan - HP
      115: { hp: 2 },
      // Horsea line - SpAtk
      116: { spAttack: 1 },
      117: { attack: 1, spAttack: 1 },
      // Goldeen line - Attack
      118: { attack: 1 },
      119: { attack: 2 },
      // Staryu line - Speed
      120: { speed: 1 },
      121: { speed: 2 },
      // Mr. Mime - SpDef
      122: { spDefense: 2 },
      // Scyther - Attack
      123: { attack: 1 },
      // Jynx - SpAtk
      124: { spAttack: 2 },
      // Electabuzz - Speed
      125: { speed: 2 },
      // Magmar - SpAtk
      126: { spAttack: 2 },
      // Pinsir - Attack
      127: { attack: 2 },
      // Tauros - Attack/Speed
      128: { attack: 1, speed: 1 },
      // Magikarp - Speed
      129: { speed: 1 },
      // Gyarados - Attack
      130: { attack: 2 },
      // Lapras - HP
      131: { hp: 2 },
      // Ditto - HP
      132: { hp: 1 },
      // Eevee - SpDef
      133: { spDefense: 1 },
      134: { hp: 2 }, // Vaporeon
      135: { speed: 2 }, // Jolteon
      136: { attack: 2 }, // Flareon
      // Porygon - SpAtk
      137: { spAttack: 1 },
      // Omanyte line - Defense
      138: { defense: 1 },
      139: { defense: 2 },
      // Kabuto line - Attack
      140: { attack: 1 },
      141: { attack: 2 },
      // Aerodactyl - Speed
      142: { speed: 2 },
      // Snorlax - HP
      143: { hp: 2 },
      // Articuno - SpDef
      144: { spDefense: 3 },
      // Zapdos - SpAtk
      145: { spAttack: 3 },
      // Moltres - SpAtk
      146: { spAttack: 3 },
      // Dratini line - Attack
      147: { attack: 1 },
      148: { attack: 2 },
      149: { attack: 3 },
      // Mewtwo - SpAtk
      150: { spAttack: 3 },
      // Mew - HP
      151: { hp: 3 }
    };

    return evYields[pokemonId] || { hp: 1 }; // Default to 1 HP EV
  }

  // Get base experience for a Pokemon
  getBaseExperience(pokemonId) {
    // Official base experience values
    const baseExp = {
      1: 64, 2: 142, 3: 236,
      4: 62, 5: 142, 6: 240,
      7: 63, 8: 142, 9: 239,
      10: 39, 11: 72, 12: 178,
      13: 39, 14: 72, 15: 178,
      16: 50, 17: 122, 18: 216,
      19: 51, 20: 145,
      21: 52, 22: 155,
      23: 58, 24: 157,
      25: 112, 26: 218,
      27: 60, 28: 158,
      29: 55, 30: 128, 31: 227,
      32: 55, 33: 128, 34: 227,
      35: 113, 36: 217,
      37: 60, 38: 177,
      39: 95, 40: 196,
      41: 49, 42: 159,
      43: 64, 44: 138, 45: 221,
      46: 57, 47: 142,
      48: 61, 49: 158,
      50: 53, 51: 149,
      52: 58, 53: 154,
      54: 64, 55: 175,
      56: 61, 57: 159,
      58: 70, 59: 194,
      60: 60, 61: 135, 62: 230,
      63: 62, 64: 140, 65: 225,
      66: 61, 67: 142, 68: 227,
      69: 60, 70: 137, 71: 221,
      72: 67, 73: 180,
      74: 60, 75: 137, 76: 223,
      77: 82, 78: 175,
      79: 63, 80: 172,
      81: 65, 82: 163,
      83: 132,
      84: 62, 85: 165,
      86: 65, 87: 166,
      88: 65, 89: 175,
      90: 61, 91: 184,
      92: 62, 93: 142, 94: 225,
      95: 77,
      96: 66, 97: 169,
      98: 65, 99: 166,
      100: 66, 101: 172,
      102: 65, 103: 186,
      104: 64, 105: 149,
      106: 159, 107: 159,
      108: 77,
      109: 68, 110: 172,
      111: 69, 112: 170,
      113: 395,
      114: 87,
      115: 172,
      116: 59, 117: 149,
      118: 64, 119: 158,
      120: 68, 121: 182,
      122: 161,
      123: 100,
      124: 159,
      125: 172,
      126: 173,
      127: 175,
      128: 172,
      129: 40, 130: 189,
      131: 187,
      132: 101,
      133: 65, 134: 184, 135: 184, 136: 184,
      137: 79,
      138: 71, 139: 173,
      140: 71, 141: 173,
      142: 180,
      143: 189,
      144: 261, 145: 261, 146: 261,
      147: 60, 148: 147, 149: 270,
      150: 306,
      151: 270
    };

    return baseExp[pokemonId] || 50; // Default base exp
  }

  // Apply EVs to companion, respecting limits
  applyEVs(currentEVs, evYield) {
    const newEVs = { ...currentEVs };
    
    // Calculate current total EVs
    let currentTotal = Object.values(newEVs).reduce((sum, val) => sum + val, 0);
    
    for (const [stat, amount] of Object.entries(evYield)) {
      if (currentTotal >= this.MAX_TOTAL_EVS) break;
      
      const currentStatEV = newEVs[stat] || 0;
      const roomInStat = this.MAX_SINGLE_EV - currentStatEV;
      const roomInTotal = this.MAX_TOTAL_EVS - currentTotal;
      
      const actualGain = Math.min(amount, roomInStat, roomInTotal);
      
      if (actualGain > 0) {
        newEVs[stat] = currentStatEV + actualGain;
        currentTotal += actualGain;
      }
    }
    
    return newEVs;
  }

  // Format EV gains for display
  formatEVGains(evYield) {
    const statNames = {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      spAttack: 'Sp. Atk',
      spDefense: 'Sp. Def',
      speed: 'Speed'
    };

    return Object.entries(evYield)
      .map(([stat, amount]) => `+${amount} ${statNames[stat] || stat}`)
      .join(', ');
  }
}

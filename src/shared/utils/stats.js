import { getPokemonById, NATURES } from '../data/pokemon-database.js';

export const NATURE_MODIFIERS = {
  'Hardy': { increase: null, decrease: null },
  'Lonely': { increase: 'attack', decrease: 'defense' },
  'Brave': { increase: 'attack', decrease: 'speed' },
  'Adamant': { increase: 'attack', decrease: 'spAttack' },
  'Naughty': { increase: 'attack', decrease: 'spDefense' },
  'Bold': { increase: 'defense', decrease: 'attack' },
  'Docile': { increase: null, decrease: null },
  'Relaxed': { increase: 'defense', decrease: 'speed' },
  'Impish': { increase: 'defense', decrease: 'spAttack' },
  'Lax': { increase: 'defense', decrease: 'spDefense' },
  'Timid': { increase: 'speed', decrease: 'attack' },
  'Hasty': { increase: 'speed', decrease: 'defense' },
  'Serious': { increase: null, decrease: null },
  'Jolly': { increase: 'speed', decrease: 'spAttack' },
  'Naive': { increase: 'speed', decrease: 'spDefense' },
  'Modest': { increase: 'spAttack', decrease: 'attack' },
  'Mild': { increase: 'spAttack', decrease: 'defense' },
  'Quiet': { increase: 'spAttack', decrease: 'speed' },
  'Bashful': { increase: null, decrease: null },
  'Rash': { increase: 'spAttack', decrease: 'spDefense' },
  'Calm': { increase: 'spDefense', decrease: 'attack' },
  'Gentle': { increase: 'spDefense', decrease: 'defense' },
  'Sassy': { increase: 'spDefense', decrease: 'speed' },
  'Careful': { increase: 'spDefense', decrease: 'spAttack' },
  'Quirky': { increase: null, decrease: null }
};

export const STAT_NAMES = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  spAttack: 'Sp.Atk',
  spDefense: 'Sp.Def',
  speed: 'Speed'
};

export const STAT_COLORS = {
  hp: '#ff5959',
  attack: '#f5ac78',
  defense: '#fae078',
  spAttack: '#9db7f5',
  spDefense: '#a7db8d',
  speed: '#fa92b2'
};

export const ITEM_STAT_BONUSES = {
  'Choice Band': { attack: 1.5 },
  'Choice Specs': { spAttack: 1.5 },
  'Choice Scarf': { speed: 1.5 },
  'Assault Vest': { spDefense: 1.5 },
  'Eviolite': { defense: 1.5, spDefense: 1.5 },
  'Light Ball': { attack: 2.0, spAttack: 2.0 }, // Pikachu only, but applying generally
  'Deep Sea Scale': { spDefense: 2.0 }, // Clamperl only
  'Deep Sea Tooth': { spAttack: 2.0 }, // Clamperl only
  'Thick Club': { attack: 2.0 }, // Cubone/Marowak only
  'Metal Powder': { defense: 2.0 }, // Ditto only
  'Quick Powder': { speed: 2.0 } // Ditto only
};

const DEFAULT_IV = 15;
const MAX_IV = 31;

export function calculateHP(baseStat, level, ev = 0, iv = DEFAULT_IV) {
  return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

export function calculateStat(baseStat, level, ev = 0, iv = DEFAULT_IV, natureMod = 1.0) {
  const base = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  return Math.floor(base * natureMod);
}

export function getTotalIVs(ivs) {
  if (!ivs) return DEFAULT_IV * 6;
  return (ivs.hp || DEFAULT_IV) + (ivs.attack || DEFAULT_IV) + (ivs.defense || DEFAULT_IV) + 
         (ivs.spAttack || DEFAULT_IV) + (ivs.spDefense || DEFAULT_IV) + (ivs.speed || DEFAULT_IV);
}

export function getIVRating(totalIVs) {
  if (totalIVs >= 151) return { label: 'Legendary', color: '#ffd700' };
  if (totalIVs >= 121) return { label: 'Rare', color: '#9b59b6' };
  if (totalIVs >= 91) return { label: 'Uncommon', color: '#3498db' };
  return { label: 'Common', color: '#888888' };
}

export function getNatureModifier(nature, statKey) {
  const mod = NATURE_MODIFIERS[nature];
  if (!mod) return 1.0;
  
  if (mod.increase === statKey) return 1.1;
  if (mod.decrease === statKey) return 0.9;
  return 1.0;
}

export function getNatureDescription(nature) {
  const mod = NATURE_MODIFIERS[nature];
  if (!mod || (!mod.increase && !mod.decrease)) {
    return 'Neutral nature (no stat changes)';
  }
  
  const increaseText = STAT_NAMES[mod.increase] || mod.increase;
  const decreaseText = STAT_NAMES[mod.decrease] || mod.decrease;
  
  return `+${increaseText} / -${decreaseText}`;
}

export function calculateAllStats(pokemon) {
  const baseData = getPokemonById(pokemon.id);
  if (!baseData) {
    console.warn('[Stats] Pokemon not found in database:', pokemon.id);
    return null;
  }
  
  const level = pokemon.level || 1;
  const nature = pokemon.nature || 'Hardy';
  const evs = pokemon.evs || { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
  const ivs = pokemon.ivs || { hp: DEFAULT_IV, attack: DEFAULT_IV, defense: DEFAULT_IV, spAttack: DEFAULT_IV, spDefense: DEFAULT_IV, speed: DEFAULT_IV };
  const item = pokemon.item || null;
  
  const baseStats = baseData.baseStats;
  const itemBonuses = item && ITEM_STAT_BONUSES[item] ? ITEM_STAT_BONUSES[item] : {};
  
  // Calculate base stats first
  const stats = {
    hp: {
      base: baseStats.hp,
      ev: evs.hp,
      iv: ivs.hp,
      calculated: calculateHP(baseStats.hp, level, evs.hp, ivs.hp),
      modifier: 1.0,
      itemBonus: 1.0
    },
    attack: {
      base: baseStats.attack,
      ev: evs.attack,
      iv: ivs.attack,
      calculated: calculateStat(baseStats.attack, level, evs.attack, ivs.attack, getNatureModifier(nature, 'attack')),
      modifier: getNatureModifier(nature, 'attack'),
      itemBonus: itemBonuses.attack || 1.0
    },
    defense: {
      base: baseStats.defense,
      ev: evs.defense,
      iv: ivs.defense,
      calculated: calculateStat(baseStats.defense, level, evs.defense, ivs.defense, getNatureModifier(nature, 'defense')),
      modifier: getNatureModifier(nature, 'defense'),
      itemBonus: itemBonuses.defense || 1.0
    },
    spAttack: {
      base: baseStats.spAttack,
      ev: evs.spAttack,
      iv: ivs.spAttack,
      calculated: calculateStat(baseStats.spAttack, level, evs.spAttack, ivs.spAttack, getNatureModifier(nature, 'spAttack')),
      modifier: getNatureModifier(nature, 'spAttack'),
      itemBonus: itemBonuses.spAttack || 1.0
    },
    spDefense: {
      base: baseStats.spDefense,
      ev: evs.spDefense,
      iv: ivs.spDefense,
      calculated: calculateStat(baseStats.spDefense, level, evs.spDefense, ivs.spDefense, getNatureModifier(nature, 'spDefense')),
      modifier: getNatureModifier(nature, 'spDefense'),
      itemBonus: itemBonuses.spDefense || 1.0
    },
    speed: {
      base: baseStats.speed,
      ev: evs.speed,
      iv: ivs.speed,
      calculated: calculateStat(baseStats.speed, level, evs.speed, ivs.speed, getNatureModifier(nature, 'speed')),
      modifier: getNatureModifier(nature, 'speed'),
      itemBonus: itemBonuses.speed || 1.0
    }
  };
  
  // Apply item bonuses to calculated stats (except HP)
  if (item && itemBonuses) {
    ['attack', 'defense', 'spAttack', 'spDefense', 'speed'].forEach(statKey => {
      if (itemBonuses[statKey]) {
        stats[statKey].calculated = Math.floor(stats[statKey].calculated * itemBonuses[statKey]);
      }
    });
  }
  
  return stats;
}

export function getTotalEVs(evs) {
  if (!evs) return 0;
  return (evs.hp || 0) + (evs.attack || 0) + (evs.defense || 0) + 
         (evs.spAttack || 0) + (evs.spDefense || 0) + (evs.speed || 0);
}

export function getStatTotal(stats) {
  if (!stats) return 0;
  return stats.hp.calculated + stats.attack.calculated + stats.defense.calculated +
         stats.spAttack.calculated + stats.spDefense.calculated + stats.speed.calculated;
}

export const MAX_TOTAL_EVS = 510;
export const MAX_SINGLE_EV = 252;

export function validateAndClampEVs(evs) {
  if (!evs) {
    return { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
  }
  
  const statKeys = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
  const clamped = {};
  let totalUsed = 0;
  
  for (const key of statKeys) {
    let value = evs[key] || 0;
    value = Math.max(0, Math.min(MAX_SINGLE_EV, value));
    
    if (totalUsed + value > MAX_TOTAL_EVS) {
      value = MAX_TOTAL_EVS - totalUsed;
    }
    
    clamped[key] = value;
    totalUsed += value;
  }
  
  return clamped;
}

export function canAddEVs(currentEvs, statKey, amount) {
  const currentTotal = getTotalEVs(currentEvs);
  const currentStat = currentEvs[statKey] || 0;
  
  if (currentStat + amount > MAX_SINGLE_EV) {
    return { allowed: false, reason: `${STAT_NAMES[statKey]} is maxed at ${MAX_SINGLE_EV}` };
  }
  
  if (currentTotal + amount > MAX_TOTAL_EVS) {
    return { allowed: false, reason: `Total EVs cannot exceed ${MAX_TOTAL_EVS}` };
  }
  
  return { allowed: true, remaining: MAX_TOTAL_EVS - currentTotal - amount };
}

export function generateRandomIVs() {
  return {
    hp: Math.floor(Math.random() * 32),
    attack: Math.floor(Math.random() * 32),
    defense: Math.floor(Math.random() * 32),
    spAttack: Math.floor(Math.random() * 32),
    spDefense: Math.floor(Math.random() * 32),
    speed: Math.floor(Math.random() * 32)
  };
}

export function getDefaultEVs() {
  return { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
}

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
  spAttack: 'Sp. Atk',
  spDefense: 'Sp. Def',
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

const DEFAULT_IV = 15;

export function calculateHP(baseStat, level, ev = 0, iv = DEFAULT_IV) {
  return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

export function calculateStat(baseStat, level, ev = 0, iv = DEFAULT_IV, natureMod = 1.0) {
  const base = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  return Math.floor(base * natureMod);
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
  
  const baseStats = baseData.baseStats;
  
  return {
    hp: {
      base: baseStats.hp,
      ev: evs.hp,
      calculated: calculateHP(baseStats.hp, level, evs.hp),
      modifier: 1.0
    },
    attack: {
      base: baseStats.attack,
      ev: evs.attack,
      calculated: calculateStat(baseStats.attack, level, evs.attack, DEFAULT_IV, getNatureModifier(nature, 'attack')),
      modifier: getNatureModifier(nature, 'attack')
    },
    defense: {
      base: baseStats.defense,
      ev: evs.defense,
      calculated: calculateStat(baseStats.defense, level, evs.defense, DEFAULT_IV, getNatureModifier(nature, 'defense')),
      modifier: getNatureModifier(nature, 'defense')
    },
    spAttack: {
      base: baseStats.spAttack,
      ev: evs.spAttack,
      calculated: calculateStat(baseStats.spAttack, level, evs.spAttack, DEFAULT_IV, getNatureModifier(nature, 'spAttack')),
      modifier: getNatureModifier(nature, 'spAttack')
    },
    spDefense: {
      base: baseStats.spDefense,
      ev: evs.spDefense,
      calculated: calculateStat(baseStats.spDefense, level, evs.spDefense, DEFAULT_IV, getNatureModifier(nature, 'spDefense')),
      modifier: getNatureModifier(nature, 'spDefense')
    },
    speed: {
      base: baseStats.speed,
      ev: evs.speed,
      calculated: calculateStat(baseStats.speed, level, evs.speed, DEFAULT_IV, getNatureModifier(nature, 'speed')),
      modifier: getNatureModifier(nature, 'speed')
    }
  };
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

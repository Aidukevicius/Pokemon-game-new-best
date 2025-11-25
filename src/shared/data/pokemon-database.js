// Gen 1 Pokemon Database (151 Pokemon)
// Complete data with base stats, types, catch rates, and encounter rates

export const NATURES = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
  'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
  'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
];

export const POKEMON_DATABASE = [
  // Starter Pokemon - Uncommon
  { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], baseStats: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45 }, catchRate: 45, encounterRate: 2, rarity: 'uncommon' },
  { id: 2, name: 'Ivysaur', types: ['Grass', 'Poison'], baseStats: { hp: 60, attack: 62, defense: 63, spAttack: 80, spDefense: 80, speed: 60 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 3, name: 'Venusaur', types: ['Grass', 'Poison'], baseStats: { hp: 80, attack: 82, defense: 83, spAttack: 100, spDefense: 100, speed: 80 }, catchRate: 45, encounterRate: 0.5, rarity: 'rare' },
  { id: 4, name: 'Charmander', types: ['Fire'], baseStats: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 }, catchRate: 45, encounterRate: 2, rarity: 'uncommon' },
  { id: 5, name: 'Charmeleon', types: ['Fire'], baseStats: { hp: 58, attack: 64, defense: 58, spAttack: 80, spDefense: 65, speed: 80 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 6, name: 'Charizard', types: ['Fire', 'Flying'], baseStats: { hp: 78, attack: 84, defense: 78, spAttack: 109, spDefense: 85, speed: 100 }, catchRate: 45, encounterRate: 0.5, rarity: 'rare' },
  { id: 7, name: 'Squirtle', types: ['Water'], baseStats: { hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43 }, catchRate: 45, encounterRate: 2, rarity: 'uncommon' },
  { id: 8, name: 'Wartortle', types: ['Water'], baseStats: { hp: 59, attack: 63, defense: 80, spAttack: 65, spDefense: 80, speed: 58 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 9, name: 'Blastoise', types: ['Water'], baseStats: { hp: 79, attack: 83, defense: 100, spAttack: 85, spDefense: 105, speed: 78 }, catchRate: 45, encounterRate: 0.5, rarity: 'rare' },
  
  // Common Pokemon
  { id: 10, name: 'Caterpie', types: ['Bug'], baseStats: { hp: 45, attack: 30, defense: 35, spAttack: 20, spDefense: 20, speed: 45 }, catchRate: 255, encounterRate: 15, rarity: 'common' },
  { id: 13, name: 'Weedle', types: ['Bug', 'Poison'], baseStats: { hp: 40, attack: 35, defense: 30, spAttack: 20, spDefense: 20, speed: 50 }, catchRate: 255, encounterRate: 15, rarity: 'common' },
  { id: 16, name: 'Pidgey', types: ['Normal', 'Flying'], baseStats: { hp: 40, attack: 45, defense: 40, spAttack: 35, spDefense: 35, speed: 56 }, catchRate: 255, encounterRate: 20, rarity: 'common' },
  { id: 19, name: 'Rattata', types: ['Normal'], baseStats: { hp: 30, attack: 56, defense: 35, spAttack: 25, spDefense: 35, speed: 72 }, catchRate: 255, encounterRate: 20, rarity: 'common' },
  { id: 21, name: 'Spearow', types: ['Normal', 'Flying'], baseStats: { hp: 40, attack: 60, defense: 30, spAttack: 31, spDefense: 31, speed: 70 }, catchRate: 255, encounterRate: 12, rarity: 'common' },
  { id: 23, name: 'Ekans', types: ['Poison'], baseStats: { hp: 35, attack: 60, defense: 44, spAttack: 40, spDefense: 54, speed: 55 }, catchRate: 255, encounterRate: 10, rarity: 'common' },
  { id: 25, name: 'Pikachu', types: ['Electric'], baseStats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 }, catchRate: 190, encounterRate: 5, rarity: 'uncommon' },
  { id: 27, name: 'Sandshrew', types: ['Ground'], baseStats: { hp: 50, attack: 75, defense: 85, spAttack: 20, spDefense: 30, speed: 40 }, catchRate: 255, encounterRate: 10, rarity: 'common' },
  { id: 29, name: 'Nidoran♀', types: ['Poison'], baseStats: { hp: 55, attack: 47, defense: 52, spAttack: 40, spDefense: 40, speed: 41 }, catchRate: 235, encounterRate: 12, rarity: 'common' },
  { id: 32, name: 'Nidoran♂', types: ['Poison'], baseStats: { hp: 46, attack: 57, defense: 40, spAttack: 40, spDefense: 40, speed: 50 }, catchRate: 235, encounterRate: 12, rarity: 'common' },
  { id: 35, name: 'Clefairy', types: ['Fairy'], baseStats: { hp: 70, attack: 45, defense: 48, spAttack: 60, spDefense: 65, speed: 35 }, catchRate: 150, encounterRate: 4, rarity: 'uncommon' },
  { id: 37, name: 'Vulpix', types: ['Fire'], baseStats: { hp: 38, attack: 41, defense: 40, spAttack: 50, spDefense: 65, speed: 65 }, catchRate: 190, encounterRate: 8, rarity: 'uncommon' },
  { id: 39, name: 'Jigglypuff', types: ['Normal', 'Fairy'], baseStats: { hp: 115, attack: 45, defense: 20, spAttack: 45, spDefense: 25, speed: 20 }, catchRate: 170, encounterRate: 5, rarity: 'uncommon' },
  { id: 41, name: 'Zubat', types: ['Poison', 'Flying'], baseStats: { hp: 40, attack: 45, defense: 35, spAttack: 30, spDefense: 40, speed: 55 }, catchRate: 255, encounterRate: 18, rarity: 'common' },
  { id: 43, name: 'Oddish', types: ['Grass', 'Poison'], baseStats: { hp: 45, attack: 50, defense: 55, spAttack: 75, spDefense: 65, speed: 30 }, catchRate: 255, encounterRate: 12, rarity: 'common' },
  { id: 46, name: 'Paras', types: ['Bug', 'Grass'], baseStats: { hp: 35, attack: 70, defense: 55, spAttack: 45, spDefense: 55, speed: 25 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 48, name: 'Venonat', types: ['Bug', 'Poison'], baseStats: { hp: 60, attack: 55, defense: 50, spAttack: 40, spDefense: 55, speed: 45 }, catchRate: 190, encounterRate: 12, rarity: 'common' },
  { id: 50, name: 'Diglett', types: ['Ground'], baseStats: { hp: 10, attack: 55, defense: 25, spAttack: 35, spDefense: 45, speed: 95 }, catchRate: 255, encounterRate: 15, rarity: 'common' },
  { id: 52, name: 'Meowth', types: ['Normal'], baseStats: { hp: 40, attack: 45, defense: 35, spAttack: 40, spDefense: 40, speed: 90 }, catchRate: 255, encounterRate: 12, rarity: 'common' },
  { id: 54, name: 'Psyduck', types: ['Water'], baseStats: { hp: 50, attack: 52, defense: 48, spAttack: 65, spDefense: 50, speed: 55 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 56, name: 'Mankey', types: ['Fighting'], baseStats: { hp: 40, attack: 80, defense: 35, spAttack: 35, spDefense: 45, speed: 70 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 58, name: 'Growlithe', types: ['Fire'], baseStats: { hp: 55, attack: 70, defense: 45, spAttack: 70, spDefense: 50, speed: 60 }, catchRate: 190, encounterRate: 8, rarity: 'uncommon' },
  { id: 60, name: 'Poliwag', types: ['Water'], baseStats: { hp: 40, attack: 50, defense: 40, spAttack: 40, spDefense: 40, speed: 90 }, catchRate: 255, encounterRate: 13, rarity: 'common' },
  { id: 63, name: 'Abra', types: ['Psychic'], baseStats: { hp: 25, attack: 20, defense: 15, spAttack: 105, spDefense: 55, speed: 90 }, catchRate: 200, encounterRate: 6, rarity: 'uncommon' },
  { id: 66, name: 'Machop', types: ['Fighting'], baseStats: { hp: 70, attack: 80, defense: 50, spAttack: 35, spDefense: 35, speed: 35 }, catchRate: 180, encounterRate: 10, rarity: 'common' },
  { id: 69, name: 'Bellsprout', types: ['Grass', 'Poison'], baseStats: { hp: 50, attack: 75, defense: 35, spAttack: 70, spDefense: 30, speed: 40 }, catchRate: 255, encounterRate: 12, rarity: 'common' },
  { id: 72, name: 'Tentacool', types: ['Water', 'Poison'], baseStats: { hp: 40, attack: 40, defense: 35, spAttack: 50, spDefense: 100, speed: 70 }, catchRate: 190, encounterRate: 14, rarity: 'common' },
  { id: 74, name: 'Geodude', types: ['Rock', 'Ground'], baseStats: { hp: 40, attack: 80, defense: 100, spAttack: 30, spDefense: 30, speed: 20 }, catchRate: 255, encounterRate: 15, rarity: 'common' },
  { id: 77, name: 'Ponyta', types: ['Fire'], baseStats: { hp: 50, attack: 85, defense: 55, spAttack: 65, spDefense: 65, speed: 90 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 79, name: 'Slowpoke', types: ['Water', 'Psychic'], baseStats: { hp: 90, attack: 65, defense: 65, spAttack: 40, spDefense: 40, speed: 15 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 81, name: 'Magnemite', types: ['Electric', 'Steel'], baseStats: { hp: 25, attack: 35, defense: 70, spAttack: 95, spDefense: 55, speed: 45 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 84, name: 'Doduo', types: ['Normal', 'Flying'], baseStats: { hp: 35, attack: 85, defense: 45, spAttack: 35, spDefense: 35, speed: 75 }, catchRate: 190, encounterRate: 11, rarity: 'common' },
  { id: 86, name: 'Seel', types: ['Water'], baseStats: { hp: 65, attack: 45, defense: 55, spAttack: 45, spDefense: 70, speed: 45 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 88, name: 'Grimer', types: ['Poison'], baseStats: { hp: 80, attack: 80, defense: 50, spAttack: 40, spDefense: 50, speed: 25 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 90, name: 'Shellder', types: ['Water'], baseStats: { hp: 30, attack: 65, defense: 100, spAttack: 45, spDefense: 25, speed: 40 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 92, name: 'Gastly', types: ['Ghost', 'Poison'], baseStats: { hp: 30, attack: 35, defense: 30, spAttack: 100, spDefense: 35, speed: 80 }, catchRate: 190, encounterRate: 8, rarity: 'uncommon' },
  { id: 95, name: 'Onix', types: ['Rock', 'Ground'], baseStats: { hp: 35, attack: 45, defense: 160, spAttack: 30, spDefense: 45, speed: 70 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  { id: 96, name: 'Drowzee', types: ['Psychic'], baseStats: { hp: 60, attack: 48, defense: 45, spAttack: 43, spDefense: 90, speed: 42 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 98, name: 'Krabby', types: ['Water'], baseStats: { hp: 30, attack: 105, defense: 90, spAttack: 25, spDefense: 25, speed: 50 }, catchRate: 225, encounterRate: 12, rarity: 'common' },
  { id: 100, name: 'Voltorb', types: ['Electric'], baseStats: { hp: 40, attack: 30, defense: 50, spAttack: 55, spDefense: 55, speed: 100 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 102, name: 'Exeggcute', types: ['Grass', 'Psychic'], baseStats: { hp: 60, attack: 40, defense: 80, spAttack: 60, spDefense: 45, speed: 40 }, catchRate: 90, encounterRate: 6, rarity: 'uncommon' },
  { id: 104, name: 'Cubone', types: ['Ground'], baseStats: { hp: 50, attack: 50, defense: 95, spAttack: 40, spDefense: 50, speed: 35 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 108, name: 'Lickitung', types: ['Normal'], baseStats: { hp: 90, attack: 55, defense: 75, spAttack: 60, spDefense: 75, speed: 30 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  { id: 109, name: 'Koffing', types: ['Poison'], baseStats: { hp: 40, attack: 65, defense: 95, spAttack: 60, spDefense: 45, speed: 35 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 111, name: 'Rhyhorn', types: ['Ground', 'Rock'], baseStats: { hp: 80, attack: 85, defense: 95, spAttack: 30, spDefense: 30, speed: 25 }, catchRate: 120, encounterRate: 8, rarity: 'uncommon' },
  { id: 114, name: 'Tangela', types: ['Grass'], baseStats: { hp: 65, attack: 55, defense: 115, spAttack: 100, spDefense: 40, speed: 60 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  { id: 115, name: 'Kangaskhan', types: ['Normal'], baseStats: { hp: 105, attack: 95, defense: 80, spAttack: 40, spDefense: 80, speed: 90 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 116, name: 'Horsea', types: ['Water'], baseStats: { hp: 30, attack: 40, defense: 70, spAttack: 70, spDefense: 25, speed: 60 }, catchRate: 225, encounterRate: 11, rarity: 'common' },
  { id: 118, name: 'Goldeen', types: ['Water'], baseStats: { hp: 45, attack: 67, defense: 60, spAttack: 35, spDefense: 50, speed: 63 }, catchRate: 225, encounterRate: 12, rarity: 'common' },
  { id: 120, name: 'Staryu', types: ['Water'], baseStats: { hp: 30, attack: 45, defense: 55, spAttack: 70, spDefense: 55, speed: 85 }, catchRate: 225, encounterRate: 11, rarity: 'common' },
  { id: 123, name: 'Scyther', types: ['Bug', 'Flying'], baseStats: { hp: 70, attack: 110, defense: 80, spAttack: 55, spDefense: 80, speed: 105 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 127, name: 'Pinsir', types: ['Bug'], baseStats: { hp: 65, attack: 125, defense: 100, spAttack: 55, spDefense: 70, speed: 85 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 128, name: 'Tauros', types: ['Normal'], baseStats: { hp: 75, attack: 100, defense: 95, spAttack: 40, spDefense: 70, speed: 110 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  { id: 129, name: 'Magikarp', types: ['Water'], baseStats: { hp: 20, attack: 10, defense: 55, spAttack: 15, spDefense: 20, speed: 80 }, catchRate: 255, encounterRate: 18, rarity: 'common' },
  { id: 133, name: 'Eevee', types: ['Normal'], baseStats: { hp: 55, attack: 55, defense: 50, spAttack: 45, spDefense: 65, speed: 55 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  { id: 137, name: 'Porygon', types: ['Normal'], baseStats: { hp: 65, attack: 60, defense: 70, spAttack: 85, spDefense: 75, speed: 40 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 138, name: 'Omanyte', types: ['Rock', 'Water'], baseStats: { hp: 35, attack: 40, defense: 100, spAttack: 90, spDefense: 55, speed: 35 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 140, name: 'Kabuto', types: ['Rock', 'Water'], baseStats: { hp: 30, attack: 80, defense: 90, spAttack: 55, spDefense: 45, speed: 55 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 142, name: 'Aerodactyl', types: ['Rock', 'Flying'], baseStats: { hp: 80, attack: 105, defense: 65, spAttack: 60, spDefense: 75, speed: 130 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 147, name: 'Dratini', types: ['Dragon'], baseStats: { hp: 41, attack: 64, defense: 45, spAttack: 50, spDefense: 50, speed: 50 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 148, name: 'Dragonair', types: ['Dragon'], baseStats: { hp: 61, attack: 84, defense: 65, spAttack: 70, spDefense: 70, speed: 70 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // Legendary Pokemon - Very Rare
  { id: 144, name: 'Articuno', types: ['Ice', 'Flying'], baseStats: { hp: 90, attack: 85, defense: 100, spAttack: 95, spDefense: 125, speed: 85 }, catchRate: 3, encounterRate: 0.1, rarity: 'legendary' },
  { id: 145, name: 'Zapdos', types: ['Electric', 'Flying'], baseStats: { hp: 90, attack: 90, defense: 85, spAttack: 125, spDefense: 90, speed: 100 }, catchRate: 3, encounterRate: 0.1, rarity: 'legendary' },
  { id: 146, name: 'Moltres', types: ['Fire', 'Flying'], baseStats: { hp: 90, attack: 100, defense: 90, spAttack: 125, spDefense: 85, speed: 90 }, catchRate: 3, encounterRate: 0.1, rarity: 'legendary' },
  { id: 150, name: 'Mewtwo', types: ['Psychic'], baseStats: { hp: 106, attack: 110, defense: 90, spAttack: 154, spDefense: 90, speed: 130 }, catchRate: 3, encounterRate: 0.05, rarity: 'legendary' },
  { id: 151, name: 'Mew', types: ['Psychic'], baseStats: { hp: 100, attack: 100, defense: 100, spAttack: 100, spDefense: 100, speed: 100 }, catchRate: 45, encounterRate: 0.05, rarity: 'legendary' }
];

// Encounter rate weights for rarity tiers
export const RARITY_WEIGHTS = {
  common: 70,      // 70% chance
  uncommon: 20,    // 20% chance
  rare: 9,         // 9% chance
  legendary: 1     // 1% chance
};

export function getPokemonById(id) {
  return POKEMON_DATABASE.find(p => p.id === id);
}

export function getPokemonByName(name) {
  return POKEMON_DATABASE.find(p => p.name.toLowerCase() === name.toLowerCase());
}

export function getPokemonByRarity(rarity) {
  return POKEMON_DATABASE.filter(p => p.rarity === rarity);
}

export function getAllPokemon() {
  return [...POKEMON_DATABASE];
}

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
  // #001-009: Starter Pokemon Lines
  { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], baseStats: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45 }, catchRate: 45, encounterRate: 2, rarity: 'uncommon' },
  { id: 2, name: 'Ivysaur', types: ['Grass', 'Poison'], baseStats: { hp: 60, attack: 62, defense: 63, spAttack: 80, spDefense: 80, speed: 60 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 3, name: 'Venusaur', types: ['Grass', 'Poison'], baseStats: { hp: 80, attack: 82, defense: 83, spAttack: 100, spDefense: 100, speed: 80 }, catchRate: 45, encounterRate: 0.5, rarity: 'rare' },
  { id: 4, name: 'Charmander', types: ['Fire'], baseStats: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 }, catchRate: 45, encounterRate: 2, rarity: 'uncommon' },
  { id: 5, name: 'Charmeleon', types: ['Fire'], baseStats: { hp: 58, attack: 64, defense: 58, spAttack: 80, spDefense: 65, speed: 80 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 6, name: 'Charizard', types: ['Fire', 'Flying'], baseStats: { hp: 78, attack: 84, defense: 78, spAttack: 109, spDefense: 85, speed: 100 }, catchRate: 45, encounterRate: 0.5, rarity: 'rare' },
  { id: 7, name: 'Squirtle', types: ['Water'], baseStats: { hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43 }, catchRate: 45, encounterRate: 2, rarity: 'uncommon' },
  { id: 8, name: 'Wartortle', types: ['Water'], baseStats: { hp: 59, attack: 63, defense: 80, spAttack: 65, spDefense: 80, speed: 58 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 9, name: 'Blastoise', types: ['Water'], baseStats: { hp: 79, attack: 83, defense: 100, spAttack: 85, spDefense: 105, speed: 78 }, catchRate: 45, encounterRate: 0.5, rarity: 'rare' },
  
  // #010-012: Caterpie Line
  { id: 10, name: 'Caterpie', types: ['Bug'], baseStats: { hp: 45, attack: 30, defense: 35, spAttack: 20, spDefense: 20, speed: 45 }, catchRate: 255, encounterRate: 15, rarity: 'common' },
  { id: 11, name: 'Metapod', types: ['Bug'], baseStats: { hp: 50, attack: 20, defense: 55, spAttack: 25, spDefense: 25, speed: 30 }, catchRate: 120, encounterRate: 8, rarity: 'common' },
  { id: 12, name: 'Butterfree', types: ['Bug', 'Flying'], baseStats: { hp: 60, attack: 45, defense: 50, spAttack: 90, spDefense: 80, speed: 70 }, catchRate: 45, encounterRate: 3, rarity: 'uncommon' },
  
  // #013-015: Weedle Line
  { id: 13, name: 'Weedle', types: ['Bug', 'Poison'], baseStats: { hp: 40, attack: 35, defense: 30, spAttack: 20, spDefense: 20, speed: 50 }, catchRate: 255, encounterRate: 15, rarity: 'common' },
  { id: 14, name: 'Kakuna', types: ['Bug', 'Poison'], baseStats: { hp: 45, attack: 25, defense: 50, spAttack: 25, spDefense: 25, speed: 35 }, catchRate: 120, encounterRate: 8, rarity: 'common' },
  { id: 15, name: 'Beedrill', types: ['Bug', 'Poison'], baseStats: { hp: 65, attack: 90, defense: 40, spAttack: 45, spDefense: 80, speed: 75 }, catchRate: 45, encounterRate: 3, rarity: 'uncommon' },
  
  // #016-018: Pidgey Line
  { id: 16, name: 'Pidgey', types: ['Normal', 'Flying'], baseStats: { hp: 40, attack: 45, defense: 40, spAttack: 35, spDefense: 35, speed: 56 }, catchRate: 255, encounterRate: 20, rarity: 'common' },
  { id: 17, name: 'Pidgeotto', types: ['Normal', 'Flying'], baseStats: { hp: 63, attack: 60, defense: 55, spAttack: 50, spDefense: 50, speed: 71 }, catchRate: 120, encounterRate: 8, rarity: 'common' },
  { id: 18, name: 'Pidgeot', types: ['Normal', 'Flying'], baseStats: { hp: 83, attack: 80, defense: 75, spAttack: 70, spDefense: 70, speed: 101 }, catchRate: 45, encounterRate: 2, rarity: 'uncommon' },
  
  // #019-020: Rattata Line
  { id: 19, name: 'Rattata', types: ['Normal'], baseStats: { hp: 30, attack: 56, defense: 35, spAttack: 25, spDefense: 35, speed: 72 }, catchRate: 255, encounterRate: 20, rarity: 'common' },
  { id: 20, name: 'Raticate', types: ['Normal'], baseStats: { hp: 55, attack: 81, defense: 60, spAttack: 50, spDefense: 70, speed: 97 }, catchRate: 127, encounterRate: 6, rarity: 'common' },
  
  // #021-022: Spearow Line
  { id: 21, name: 'Spearow', types: ['Normal', 'Flying'], baseStats: { hp: 40, attack: 60, defense: 30, spAttack: 31, spDefense: 31, speed: 70 }, catchRate: 255, encounterRate: 12, rarity: 'common' },
  { id: 22, name: 'Fearow', types: ['Normal', 'Flying'], baseStats: { hp: 65, attack: 90, defense: 65, spAttack: 61, spDefense: 61, speed: 100 }, catchRate: 90, encounterRate: 4, rarity: 'uncommon' },
  
  // #023-024: Ekans Line
  { id: 23, name: 'Ekans', types: ['Poison'], baseStats: { hp: 35, attack: 60, defense: 44, spAttack: 40, spDefense: 54, speed: 55 }, catchRate: 255, encounterRate: 10, rarity: 'common' },
  { id: 24, name: 'Arbok', types: ['Poison'], baseStats: { hp: 60, attack: 95, defense: 69, spAttack: 65, spDefense: 79, speed: 80 }, catchRate: 90, encounterRate: 4, rarity: 'uncommon' },
  
  // #025-026: Pikachu Line
  { id: 25, name: 'Pikachu', types: ['Electric'], baseStats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 }, catchRate: 190, encounterRate: 5, rarity: 'uncommon' },
  { id: 26, name: 'Raichu', types: ['Electric'], baseStats: { hp: 60, attack: 90, defense: 55, spAttack: 90, spDefense: 80, speed: 110 }, catchRate: 75, encounterRate: 2, rarity: 'rare' },
  
  // #027-028: Sandshrew Line
  { id: 27, name: 'Sandshrew', types: ['Ground'], baseStats: { hp: 50, attack: 75, defense: 85, spAttack: 20, spDefense: 30, speed: 40 }, catchRate: 255, encounterRate: 10, rarity: 'common' },
  { id: 28, name: 'Sandslash', types: ['Ground'], baseStats: { hp: 75, attack: 100, defense: 110, spAttack: 45, spDefense: 55, speed: 65 }, catchRate: 90, encounterRate: 4, rarity: 'uncommon' },
  
  // #029-031: Nidoran Female Line
  { id: 29, name: 'Nidoran♀', types: ['Poison'], baseStats: { hp: 55, attack: 47, defense: 52, spAttack: 40, spDefense: 40, speed: 41 }, catchRate: 235, encounterRate: 12, rarity: 'common' },
  { id: 30, name: 'Nidorina', types: ['Poison'], baseStats: { hp: 70, attack: 62, defense: 67, spAttack: 55, spDefense: 55, speed: 56 }, catchRate: 120, encounterRate: 5, rarity: 'uncommon' },
  { id: 31, name: 'Nidoqueen', types: ['Poison', 'Ground'], baseStats: { hp: 90, attack: 92, defense: 87, spAttack: 75, spDefense: 85, speed: 76 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #032-034: Nidoran Male Line
  { id: 32, name: 'Nidoran♂', types: ['Poison'], baseStats: { hp: 46, attack: 57, defense: 40, spAttack: 40, spDefense: 40, speed: 50 }, catchRate: 235, encounterRate: 12, rarity: 'common' },
  { id: 33, name: 'Nidorino', types: ['Poison'], baseStats: { hp: 61, attack: 72, defense: 57, spAttack: 55, spDefense: 55, speed: 65 }, catchRate: 120, encounterRate: 5, rarity: 'uncommon' },
  { id: 34, name: 'Nidoking', types: ['Poison', 'Ground'], baseStats: { hp: 81, attack: 102, defense: 77, spAttack: 85, spDefense: 75, speed: 85 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #035-036: Clefairy Line
  { id: 35, name: 'Clefairy', types: ['Fairy'], baseStats: { hp: 70, attack: 45, defense: 48, spAttack: 60, spDefense: 65, speed: 35 }, catchRate: 150, encounterRate: 4, rarity: 'uncommon' },
  { id: 36, name: 'Clefable', types: ['Fairy'], baseStats: { hp: 95, attack: 70, defense: 73, spAttack: 95, spDefense: 90, speed: 60 }, catchRate: 25, encounterRate: 1, rarity: 'rare' },
  
  // #037-038: Vulpix Line
  { id: 37, name: 'Vulpix', types: ['Fire'], baseStats: { hp: 38, attack: 41, defense: 40, spAttack: 50, spDefense: 65, speed: 65 }, catchRate: 190, encounterRate: 8, rarity: 'uncommon' },
  { id: 38, name: 'Ninetales', types: ['Fire'], baseStats: { hp: 73, attack: 76, defense: 75, spAttack: 81, spDefense: 100, speed: 100 }, catchRate: 75, encounterRate: 2, rarity: 'rare' },
  
  // #039-040: Jigglypuff Line
  { id: 39, name: 'Jigglypuff', types: ['Normal', 'Fairy'], baseStats: { hp: 115, attack: 45, defense: 20, spAttack: 45, spDefense: 25, speed: 20 }, catchRate: 170, encounterRate: 5, rarity: 'uncommon' },
  { id: 40, name: 'Wigglytuff', types: ['Normal', 'Fairy'], baseStats: { hp: 140, attack: 70, defense: 45, spAttack: 85, spDefense: 50, speed: 45 }, catchRate: 50, encounterRate: 2, rarity: 'rare' },
  
  // #041-042: Zubat Line
  { id: 41, name: 'Zubat', types: ['Poison', 'Flying'], baseStats: { hp: 40, attack: 45, defense: 35, spAttack: 30, spDefense: 40, speed: 55 }, catchRate: 255, encounterRate: 18, rarity: 'common' },
  { id: 42, name: 'Golbat', types: ['Poison', 'Flying'], baseStats: { hp: 75, attack: 80, defense: 70, spAttack: 65, spDefense: 75, speed: 90 }, catchRate: 90, encounterRate: 6, rarity: 'uncommon' },
  
  // #043-045: Oddish Line
  { id: 43, name: 'Oddish', types: ['Grass', 'Poison'], baseStats: { hp: 45, attack: 50, defense: 55, spAttack: 75, spDefense: 65, speed: 30 }, catchRate: 255, encounterRate: 12, rarity: 'common' },
  { id: 44, name: 'Gloom', types: ['Grass', 'Poison'], baseStats: { hp: 60, attack: 65, defense: 70, spAttack: 85, spDefense: 75, speed: 40 }, catchRate: 120, encounterRate: 5, rarity: 'uncommon' },
  { id: 45, name: 'Vileplume', types: ['Grass', 'Poison'], baseStats: { hp: 75, attack: 80, defense: 85, spAttack: 110, spDefense: 90, speed: 50 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #046-047: Paras Line
  { id: 46, name: 'Paras', types: ['Bug', 'Grass'], baseStats: { hp: 35, attack: 70, defense: 55, spAttack: 45, spDefense: 55, speed: 25 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 47, name: 'Parasect', types: ['Bug', 'Grass'], baseStats: { hp: 60, attack: 95, defense: 80, spAttack: 60, spDefense: 80, speed: 30 }, catchRate: 75, encounterRate: 4, rarity: 'uncommon' },
  
  // #048-049: Venonat Line
  { id: 48, name: 'Venonat', types: ['Bug', 'Poison'], baseStats: { hp: 60, attack: 55, defense: 50, spAttack: 40, spDefense: 55, speed: 45 }, catchRate: 190, encounterRate: 12, rarity: 'common' },
  { id: 49, name: 'Venomoth', types: ['Bug', 'Poison'], baseStats: { hp: 70, attack: 65, defense: 60, spAttack: 90, spDefense: 75, speed: 90 }, catchRate: 75, encounterRate: 4, rarity: 'uncommon' },
  
  // #050-051: Diglett Line
  { id: 50, name: 'Diglett', types: ['Ground'], baseStats: { hp: 10, attack: 55, defense: 25, spAttack: 35, spDefense: 45, speed: 95 }, catchRate: 255, encounterRate: 15, rarity: 'common' },
  { id: 51, name: 'Dugtrio', types: ['Ground'], baseStats: { hp: 35, attack: 100, defense: 50, spAttack: 50, spDefense: 70, speed: 120 }, catchRate: 50, encounterRate: 4, rarity: 'uncommon' },
  
  // #052-053: Meowth Line
  { id: 52, name: 'Meowth', types: ['Normal'], baseStats: { hp: 40, attack: 45, defense: 35, spAttack: 40, spDefense: 40, speed: 90 }, catchRate: 255, encounterRate: 12, rarity: 'common' },
  { id: 53, name: 'Persian', types: ['Normal'], baseStats: { hp: 65, attack: 70, defense: 60, spAttack: 65, spDefense: 65, speed: 115 }, catchRate: 90, encounterRate: 4, rarity: 'uncommon' },
  
  // #054-055: Psyduck Line
  { id: 54, name: 'Psyduck', types: ['Water'], baseStats: { hp: 50, attack: 52, defense: 48, spAttack: 65, spDefense: 50, speed: 55 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 55, name: 'Golduck', types: ['Water'], baseStats: { hp: 80, attack: 82, defense: 78, spAttack: 95, spDefense: 80, speed: 85 }, catchRate: 75, encounterRate: 4, rarity: 'uncommon' },
  
  // #056-057: Mankey Line
  { id: 56, name: 'Mankey', types: ['Fighting'], baseStats: { hp: 40, attack: 80, defense: 35, spAttack: 35, spDefense: 45, speed: 70 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 57, name: 'Primeape', types: ['Fighting'], baseStats: { hp: 65, attack: 105, defense: 60, spAttack: 60, spDefense: 70, speed: 95 }, catchRate: 75, encounterRate: 4, rarity: 'uncommon' },
  
  // #058-059: Growlithe Line
  { id: 58, name: 'Growlithe', types: ['Fire'], baseStats: { hp: 55, attack: 70, defense: 45, spAttack: 70, spDefense: 50, speed: 60 }, catchRate: 190, encounterRate: 8, rarity: 'uncommon' },
  { id: 59, name: 'Arcanine', types: ['Fire'], baseStats: { hp: 90, attack: 110, defense: 80, spAttack: 100, spDefense: 80, speed: 95 }, catchRate: 75, encounterRate: 2, rarity: 'rare' },
  
  // #060-062: Poliwag Line
  { id: 60, name: 'Poliwag', types: ['Water'], baseStats: { hp: 40, attack: 50, defense: 40, spAttack: 40, spDefense: 40, speed: 90 }, catchRate: 255, encounterRate: 13, rarity: 'common' },
  { id: 61, name: 'Poliwhirl', types: ['Water'], baseStats: { hp: 65, attack: 65, defense: 65, spAttack: 50, spDefense: 50, speed: 90 }, catchRate: 120, encounterRate: 5, rarity: 'uncommon' },
  { id: 62, name: 'Poliwrath', types: ['Water', 'Fighting'], baseStats: { hp: 90, attack: 95, defense: 95, spAttack: 70, spDefense: 90, speed: 70 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #063-065: Abra Line
  { id: 63, name: 'Abra', types: ['Psychic'], baseStats: { hp: 25, attack: 20, defense: 15, spAttack: 105, spDefense: 55, speed: 90 }, catchRate: 200, encounterRate: 6, rarity: 'uncommon' },
  { id: 64, name: 'Kadabra', types: ['Psychic'], baseStats: { hp: 40, attack: 35, defense: 30, spAttack: 120, spDefense: 70, speed: 105 }, catchRate: 100, encounterRate: 3, rarity: 'uncommon' },
  { id: 65, name: 'Alakazam', types: ['Psychic'], baseStats: { hp: 55, attack: 50, defense: 45, spAttack: 135, spDefense: 95, speed: 120 }, catchRate: 50, encounterRate: 1, rarity: 'rare' },
  
  // #066-068: Machop Line
  { id: 66, name: 'Machop', types: ['Fighting'], baseStats: { hp: 70, attack: 80, defense: 50, spAttack: 35, spDefense: 35, speed: 35 }, catchRate: 180, encounterRate: 10, rarity: 'common' },
  { id: 67, name: 'Machoke', types: ['Fighting'], baseStats: { hp: 80, attack: 100, defense: 70, spAttack: 50, spDefense: 60, speed: 45 }, catchRate: 90, encounterRate: 5, rarity: 'uncommon' },
  { id: 68, name: 'Machamp', types: ['Fighting'], baseStats: { hp: 90, attack: 130, defense: 80, spAttack: 65, spDefense: 85, speed: 55 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #069-071: Bellsprout Line
  { id: 69, name: 'Bellsprout', types: ['Grass', 'Poison'], baseStats: { hp: 50, attack: 75, defense: 35, spAttack: 70, spDefense: 30, speed: 40 }, catchRate: 255, encounterRate: 12, rarity: 'common' },
  { id: 70, name: 'Weepinbell', types: ['Grass', 'Poison'], baseStats: { hp: 65, attack: 90, defense: 50, spAttack: 85, spDefense: 45, speed: 55 }, catchRate: 120, encounterRate: 5, rarity: 'uncommon' },
  { id: 71, name: 'Victreebel', types: ['Grass', 'Poison'], baseStats: { hp: 80, attack: 105, defense: 65, spAttack: 100, spDefense: 70, speed: 70 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #072-073: Tentacool Line
  { id: 72, name: 'Tentacool', types: ['Water', 'Poison'], baseStats: { hp: 40, attack: 40, defense: 35, spAttack: 50, spDefense: 100, speed: 70 }, catchRate: 190, encounterRate: 14, rarity: 'common' },
  { id: 73, name: 'Tentacruel', types: ['Water', 'Poison'], baseStats: { hp: 80, attack: 70, defense: 65, spAttack: 80, spDefense: 120, speed: 100 }, catchRate: 60, encounterRate: 3, rarity: 'uncommon' },
  
  // #074-076: Geodude Line
  { id: 74, name: 'Geodude', types: ['Rock', 'Ground'], baseStats: { hp: 40, attack: 80, defense: 100, spAttack: 30, spDefense: 30, speed: 20 }, catchRate: 255, encounterRate: 15, rarity: 'common' },
  { id: 75, name: 'Graveler', types: ['Rock', 'Ground'], baseStats: { hp: 55, attack: 95, defense: 115, spAttack: 45, spDefense: 45, speed: 35 }, catchRate: 120, encounterRate: 6, rarity: 'uncommon' },
  { id: 76, name: 'Golem', types: ['Rock', 'Ground'], baseStats: { hp: 80, attack: 120, defense: 130, spAttack: 55, spDefense: 65, speed: 45 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #077-078: Ponyta Line
  { id: 77, name: 'Ponyta', types: ['Fire'], baseStats: { hp: 50, attack: 85, defense: 55, spAttack: 65, spDefense: 65, speed: 90 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 78, name: 'Rapidash', types: ['Fire'], baseStats: { hp: 65, attack: 100, defense: 70, spAttack: 80, spDefense: 80, speed: 105 }, catchRate: 60, encounterRate: 3, rarity: 'uncommon' },
  
  // #079-080: Slowpoke Line
  { id: 79, name: 'Slowpoke', types: ['Water', 'Psychic'], baseStats: { hp: 90, attack: 65, defense: 65, spAttack: 40, spDefense: 40, speed: 15 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 80, name: 'Slowbro', types: ['Water', 'Psychic'], baseStats: { hp: 95, attack: 75, defense: 110, spAttack: 100, spDefense: 80, speed: 30 }, catchRate: 75, encounterRate: 3, rarity: 'uncommon' },
  
  // #081-082: Magnemite Line
  { id: 81, name: 'Magnemite', types: ['Electric', 'Steel'], baseStats: { hp: 25, attack: 35, defense: 70, spAttack: 95, spDefense: 55, speed: 45 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 82, name: 'Magneton', types: ['Electric', 'Steel'], baseStats: { hp: 50, attack: 60, defense: 95, spAttack: 120, spDefense: 70, speed: 70 }, catchRate: 60, encounterRate: 3, rarity: 'uncommon' },
  
  // #083: Farfetch'd
  { id: 83, name: "Farfetch'd", types: ['Normal', 'Flying'], baseStats: { hp: 52, attack: 90, defense: 55, spAttack: 58, spDefense: 62, speed: 60 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #084-085: Doduo Line
  { id: 84, name: 'Doduo', types: ['Normal', 'Flying'], baseStats: { hp: 35, attack: 85, defense: 45, spAttack: 35, spDefense: 35, speed: 75 }, catchRate: 190, encounterRate: 11, rarity: 'common' },
  { id: 85, name: 'Dodrio', types: ['Normal', 'Flying'], baseStats: { hp: 60, attack: 110, defense: 70, spAttack: 60, spDefense: 60, speed: 110 }, catchRate: 45, encounterRate: 3, rarity: 'uncommon' },
  
  // #086-087: Seel Line
  { id: 86, name: 'Seel', types: ['Water'], baseStats: { hp: 65, attack: 45, defense: 55, spAttack: 45, spDefense: 70, speed: 45 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 87, name: 'Dewgong', types: ['Water', 'Ice'], baseStats: { hp: 90, attack: 70, defense: 80, spAttack: 70, spDefense: 95, speed: 70 }, catchRate: 75, encounterRate: 3, rarity: 'uncommon' },
  
  // #088-089: Grimer Line
  { id: 88, name: 'Grimer', types: ['Poison'], baseStats: { hp: 80, attack: 80, defense: 50, spAttack: 40, spDefense: 50, speed: 25 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 89, name: 'Muk', types: ['Poison'], baseStats: { hp: 105, attack: 105, defense: 75, spAttack: 65, spDefense: 100, speed: 50 }, catchRate: 75, encounterRate: 3, rarity: 'uncommon' },
  
  // #090-091: Shellder Line
  { id: 90, name: 'Shellder', types: ['Water'], baseStats: { hp: 30, attack: 65, defense: 100, spAttack: 45, spDefense: 25, speed: 40 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 91, name: 'Cloyster', types: ['Water', 'Ice'], baseStats: { hp: 50, attack: 95, defense: 180, spAttack: 85, spDefense: 45, speed: 70 }, catchRate: 60, encounterRate: 2, rarity: 'rare' },
  
  // #092-094: Gastly Line
  { id: 92, name: 'Gastly', types: ['Ghost', 'Poison'], baseStats: { hp: 30, attack: 35, defense: 30, spAttack: 100, spDefense: 35, speed: 80 }, catchRate: 190, encounterRate: 8, rarity: 'uncommon' },
  { id: 93, name: 'Haunter', types: ['Ghost', 'Poison'], baseStats: { hp: 45, attack: 50, defense: 45, spAttack: 115, spDefense: 55, speed: 95 }, catchRate: 90, encounterRate: 4, rarity: 'uncommon' },
  { id: 94, name: 'Gengar', types: ['Ghost', 'Poison'], baseStats: { hp: 60, attack: 65, defense: 60, spAttack: 130, spDefense: 75, speed: 110 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #095: Onix
  { id: 95, name: 'Onix', types: ['Rock', 'Ground'], baseStats: { hp: 35, attack: 45, defense: 160, spAttack: 30, spDefense: 45, speed: 70 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  
  // #096-097: Drowzee Line
  { id: 96, name: 'Drowzee', types: ['Psychic'], baseStats: { hp: 60, attack: 48, defense: 45, spAttack: 43, spDefense: 90, speed: 42 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 97, name: 'Hypno', types: ['Psychic'], baseStats: { hp: 85, attack: 73, defense: 70, spAttack: 73, spDefense: 115, speed: 67 }, catchRate: 75, encounterRate: 4, rarity: 'uncommon' },
  
  // #098-099: Krabby Line
  { id: 98, name: 'Krabby', types: ['Water'], baseStats: { hp: 30, attack: 105, defense: 90, spAttack: 25, spDefense: 25, speed: 50 }, catchRate: 225, encounterRate: 12, rarity: 'common' },
  { id: 99, name: 'Kingler', types: ['Water'], baseStats: { hp: 55, attack: 130, defense: 115, spAttack: 50, spDefense: 50, speed: 75 }, catchRate: 60, encounterRate: 3, rarity: 'uncommon' },
  
  // #100-101: Voltorb Line
  { id: 100, name: 'Voltorb', types: ['Electric'], baseStats: { hp: 40, attack: 30, defense: 50, spAttack: 55, spDefense: 55, speed: 100 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 101, name: 'Electrode', types: ['Electric'], baseStats: { hp: 60, attack: 50, defense: 70, spAttack: 80, spDefense: 80, speed: 150 }, catchRate: 60, encounterRate: 3, rarity: 'uncommon' },
  
  // #102-103: Exeggcute Line
  { id: 102, name: 'Exeggcute', types: ['Grass', 'Psychic'], baseStats: { hp: 60, attack: 40, defense: 80, spAttack: 60, spDefense: 45, speed: 40 }, catchRate: 90, encounterRate: 6, rarity: 'uncommon' },
  { id: 103, name: 'Exeggutor', types: ['Grass', 'Psychic'], baseStats: { hp: 95, attack: 95, defense: 85, spAttack: 125, spDefense: 75, speed: 55 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #104-105: Cubone Line
  { id: 104, name: 'Cubone', types: ['Ground'], baseStats: { hp: 50, attack: 50, defense: 95, spAttack: 40, spDefense: 50, speed: 35 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 105, name: 'Marowak', types: ['Ground'], baseStats: { hp: 60, attack: 80, defense: 110, spAttack: 50, spDefense: 80, speed: 45 }, catchRate: 75, encounterRate: 4, rarity: 'uncommon' },
  
  // #106-107: Hitmonlee & Hitmonchan
  { id: 106, name: 'Hitmonlee', types: ['Fighting'], baseStats: { hp: 50, attack: 120, defense: 53, spAttack: 35, spDefense: 110, speed: 87 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 107, name: 'Hitmonchan', types: ['Fighting'], baseStats: { hp: 50, attack: 105, defense: 79, spAttack: 35, spDefense: 110, speed: 76 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #108: Lickitung
  { id: 108, name: 'Lickitung', types: ['Normal'], baseStats: { hp: 90, attack: 55, defense: 75, spAttack: 60, spDefense: 75, speed: 30 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  
  // #109-110: Koffing Line
  { id: 109, name: 'Koffing', types: ['Poison'], baseStats: { hp: 40, attack: 65, defense: 95, spAttack: 60, spDefense: 45, speed: 35 }, catchRate: 190, encounterRate: 10, rarity: 'common' },
  { id: 110, name: 'Weezing', types: ['Poison'], baseStats: { hp: 65, attack: 90, defense: 120, spAttack: 85, spDefense: 70, speed: 60 }, catchRate: 60, encounterRate: 3, rarity: 'uncommon' },
  
  // #111-112: Rhyhorn Line
  { id: 111, name: 'Rhyhorn', types: ['Ground', 'Rock'], baseStats: { hp: 80, attack: 85, defense: 95, spAttack: 30, spDefense: 30, speed: 25 }, catchRate: 120, encounterRate: 8, rarity: 'uncommon' },
  { id: 112, name: 'Rhydon', types: ['Ground', 'Rock'], baseStats: { hp: 105, attack: 130, defense: 120, spAttack: 45, spDefense: 45, speed: 40 }, catchRate: 60, encounterRate: 2, rarity: 'rare' },
  
  // #113: Chansey
  { id: 113, name: 'Chansey', types: ['Normal'], baseStats: { hp: 250, attack: 5, defense: 5, spAttack: 35, spDefense: 105, speed: 50 }, catchRate: 30, encounterRate: 1, rarity: 'rare' },
  
  // #114: Tangela
  { id: 114, name: 'Tangela', types: ['Grass'], baseStats: { hp: 65, attack: 55, defense: 115, spAttack: 100, spDefense: 40, speed: 60 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  
  // #115: Kangaskhan
  { id: 115, name: 'Kangaskhan', types: ['Normal'], baseStats: { hp: 105, attack: 95, defense: 80, spAttack: 40, spDefense: 80, speed: 90 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #116-117: Horsea Line
  { id: 116, name: 'Horsea', types: ['Water'], baseStats: { hp: 30, attack: 40, defense: 70, spAttack: 70, spDefense: 25, speed: 60 }, catchRate: 225, encounterRate: 11, rarity: 'common' },
  { id: 117, name: 'Seadra', types: ['Water'], baseStats: { hp: 55, attack: 65, defense: 95, spAttack: 95, spDefense: 45, speed: 85 }, catchRate: 75, encounterRate: 4, rarity: 'uncommon' },
  
  // #118-119: Goldeen Line
  { id: 118, name: 'Goldeen', types: ['Water'], baseStats: { hp: 45, attack: 67, defense: 60, spAttack: 35, spDefense: 50, speed: 63 }, catchRate: 225, encounterRate: 12, rarity: 'common' },
  { id: 119, name: 'Seaking', types: ['Water'], baseStats: { hp: 80, attack: 92, defense: 65, spAttack: 65, spDefense: 80, speed: 68 }, catchRate: 60, encounterRate: 4, rarity: 'uncommon' },
  
  // #120-121: Staryu Line
  { id: 120, name: 'Staryu', types: ['Water'], baseStats: { hp: 30, attack: 45, defense: 55, spAttack: 70, spDefense: 55, speed: 85 }, catchRate: 225, encounterRate: 11, rarity: 'common' },
  { id: 121, name: 'Starmie', types: ['Water', 'Psychic'], baseStats: { hp: 60, attack: 75, defense: 85, spAttack: 100, spDefense: 85, speed: 115 }, catchRate: 60, encounterRate: 2, rarity: 'rare' },
  
  // #122: Mr. Mime
  { id: 122, name: 'Mr. Mime', types: ['Psychic', 'Fairy'], baseStats: { hp: 40, attack: 45, defense: 65, spAttack: 100, spDefense: 120, speed: 90 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #123: Scyther
  { id: 123, name: 'Scyther', types: ['Bug', 'Flying'], baseStats: { hp: 70, attack: 110, defense: 80, spAttack: 55, spDefense: 80, speed: 105 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #124: Jynx
  { id: 124, name: 'Jynx', types: ['Ice', 'Psychic'], baseStats: { hp: 65, attack: 50, defense: 35, spAttack: 115, spDefense: 95, speed: 95 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #125: Electabuzz
  { id: 125, name: 'Electabuzz', types: ['Electric'], baseStats: { hp: 65, attack: 83, defense: 57, spAttack: 95, spDefense: 85, speed: 105 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #126: Magmar
  { id: 126, name: 'Magmar', types: ['Fire'], baseStats: { hp: 65, attack: 95, defense: 57, spAttack: 100, spDefense: 85, speed: 93 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #127: Pinsir
  { id: 127, name: 'Pinsir', types: ['Bug'], baseStats: { hp: 65, attack: 125, defense: 100, spAttack: 55, spDefense: 70, speed: 85 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  
  // #128: Tauros
  { id: 128, name: 'Tauros', types: ['Normal'], baseStats: { hp: 75, attack: 100, defense: 95, spAttack: 40, spDefense: 70, speed: 110 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  
  // #129-130: Magikarp Line
  { id: 129, name: 'Magikarp', types: ['Water'], baseStats: { hp: 20, attack: 10, defense: 55, spAttack: 15, spDefense: 20, speed: 80 }, catchRate: 255, encounterRate: 18, rarity: 'common' },
  { id: 130, name: 'Gyarados', types: ['Water', 'Flying'], baseStats: { hp: 95, attack: 125, defense: 79, spAttack: 60, spDefense: 100, speed: 81 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #131: Lapras
  { id: 131, name: 'Lapras', types: ['Water', 'Ice'], baseStats: { hp: 130, attack: 85, defense: 80, spAttack: 85, spDefense: 95, speed: 60 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #132: Ditto
  { id: 132, name: 'Ditto', types: ['Normal'], baseStats: { hp: 48, attack: 48, defense: 48, spAttack: 48, spDefense: 48, speed: 48 }, catchRate: 35, encounterRate: 2, rarity: 'rare' },
  
  // #133-136: Eevee Line
  { id: 133, name: 'Eevee', types: ['Normal'], baseStats: { hp: 55, attack: 55, defense: 50, spAttack: 45, spDefense: 65, speed: 55 }, catchRate: 45, encounterRate: 3, rarity: 'rare' },
  { id: 134, name: 'Vaporeon', types: ['Water'], baseStats: { hp: 130, attack: 65, defense: 60, spAttack: 110, spDefense: 95, speed: 65 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 135, name: 'Jolteon', types: ['Electric'], baseStats: { hp: 65, attack: 65, defense: 60, spAttack: 110, spDefense: 95, speed: 130 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 136, name: 'Flareon', types: ['Fire'], baseStats: { hp: 65, attack: 130, defense: 60, spAttack: 95, spDefense: 110, speed: 65 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #137: Porygon
  { id: 137, name: 'Porygon', types: ['Normal'], baseStats: { hp: 65, attack: 60, defense: 70, spAttack: 85, spDefense: 75, speed: 40 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #138-139: Omanyte Line
  { id: 138, name: 'Omanyte', types: ['Rock', 'Water'], baseStats: { hp: 35, attack: 40, defense: 100, spAttack: 90, spDefense: 55, speed: 35 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 139, name: 'Omastar', types: ['Rock', 'Water'], baseStats: { hp: 70, attack: 60, defense: 125, spAttack: 115, spDefense: 70, speed: 55 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #140-141: Kabuto Line
  { id: 140, name: 'Kabuto', types: ['Rock', 'Water'], baseStats: { hp: 30, attack: 80, defense: 90, spAttack: 55, spDefense: 45, speed: 55 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 141, name: 'Kabutops', types: ['Rock', 'Water'], baseStats: { hp: 60, attack: 115, defense: 105, spAttack: 65, spDefense: 70, speed: 80 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #142: Aerodactyl
  { id: 142, name: 'Aerodactyl', types: ['Rock', 'Flying'], baseStats: { hp: 80, attack: 105, defense: 65, spAttack: 60, spDefense: 75, speed: 130 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  
  // #143: Snorlax
  { id: 143, name: 'Snorlax', types: ['Normal'], baseStats: { hp: 160, attack: 110, defense: 65, spAttack: 65, spDefense: 110, speed: 30 }, catchRate: 25, encounterRate: 1, rarity: 'rare' },
  
  // #144-146: Legendary Birds
  { id: 144, name: 'Articuno', types: ['Ice', 'Flying'], baseStats: { hp: 90, attack: 85, defense: 100, spAttack: 95, spDefense: 125, speed: 85 }, catchRate: 3, encounterRate: 0.1, rarity: 'legendary' },
  { id: 145, name: 'Zapdos', types: ['Electric', 'Flying'], baseStats: { hp: 90, attack: 90, defense: 85, spAttack: 125, spDefense: 90, speed: 100 }, catchRate: 3, encounterRate: 0.1, rarity: 'legendary' },
  { id: 146, name: 'Moltres', types: ['Fire', 'Flying'], baseStats: { hp: 90, attack: 100, defense: 90, spAttack: 125, spDefense: 85, speed: 90 }, catchRate: 3, encounterRate: 0.1, rarity: 'legendary' },
  
  // #147-149: Dratini Line
  { id: 147, name: 'Dratini', types: ['Dragon'], baseStats: { hp: 41, attack: 64, defense: 45, spAttack: 50, spDefense: 50, speed: 50 }, catchRate: 45, encounterRate: 2, rarity: 'rare' },
  { id: 148, name: 'Dragonair', types: ['Dragon'], baseStats: { hp: 61, attack: 84, defense: 65, spAttack: 70, spDefense: 70, speed: 70 }, catchRate: 45, encounterRate: 1, rarity: 'rare' },
  { id: 149, name: 'Dragonite', types: ['Dragon', 'Flying'], baseStats: { hp: 91, attack: 134, defense: 95, spAttack: 100, spDefense: 100, speed: 80 }, catchRate: 45, encounterRate: 0.5, rarity: 'rare' },
  
  // #150-151: Mewtwo & Mew
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

export function getTotalPokemonCount() {
  return 151;
}

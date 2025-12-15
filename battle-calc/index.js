const express = require('express');
const { Generations, Pokemon, Move, calculate } = require('@smogon/calc');

const app = express();
app.use(express.json());

const gen = Generations.get(9);

const NATURE_MAP = {
  'Hardy': 'Hardy', 'Lonely': 'Lonely', 'Brave': 'Brave', 'Adamant': 'Adamant', 'Naughty': 'Naughty',
  'Bold': 'Bold', 'Docile': 'Docile', 'Relaxed': 'Relaxed', 'Impish': 'Impish', 'Lax': 'Lax',
  'Timid': 'Timid', 'Hasty': 'Hasty', 'Serious': 'Serious', 'Jolly': 'Jolly', 'Naive': 'Naive',
  'Modest': 'Modest', 'Mild': 'Mild', 'Quiet': 'Quiet', 'Bashful': 'Bashful', 'Rash': 'Rash',
  'Calm': 'Calm', 'Gentle': 'Gentle', 'Sassy': 'Sassy', 'Careful': 'Careful', 'Quirky': 'Quirky'
};

function createPokemon(data) {
  const options = {
    level: data.level || 50,
    nature: NATURE_MAP[data.nature] || 'Hardy',
    ability: data.ability || 'Static',
    evs: {
      hp: data.evs?.hp || 0,
      atk: data.evs?.attack || 0,
      def: data.evs?.defense || 0,
      spa: data.evs?.spAttack || 0,
      spd: data.evs?.spDefense || 0,
      spe: data.evs?.speed || 0
    },
    ivs: {
      hp: data.ivs?.hp ?? 31,
      atk: data.ivs?.attack ?? 31,
      def: data.ivs?.defense ?? 31,
      spa: data.ivs?.spAttack ?? 31,
      spd: data.ivs?.spDefense ?? 31,
      spe: data.ivs?.speed ?? 31
    }
  };

  if (data.item) {
    options.item = data.item;
  }

  try {
    return new Pokemon(gen, data.name, options);
  } catch (e) {
    console.error(`Failed to create Pokemon "${data.name}":`, e.message);
    return new Pokemon(gen, 'Pikachu', options);
  }
}

app.post('/api/calculate-damage', (req, res) => {
  try {
    const { attacker, defender, move } = req.body;

    const attackerPokemon = createPokemon(attacker);
    const defenderPokemon = createPokemon(defender);

    let moveObj;
    try {
      moveObj = new Move(gen, move.name || move);
    } catch (e) {
      moveObj = new Move(gen, 'Tackle');
    }

    const result = calculate(gen, attackerPokemon, defenderPokemon, moveObj);

    const damageRange = result.damage;
    let minDamage, maxDamage;
    
    if (Array.isArray(damageRange)) {
      minDamage = damageRange[0];
      maxDamage = damageRange[damageRange.length - 1];
    } else {
      minDamage = maxDamage = damageRange;
    }

    const avgDamage = Math.floor((minDamage + maxDamage) / 2);
    const randomVariance = 0.85 + (Math.random() * 0.15);
    const finalDamage = Math.floor(avgDamage * randomVariance);

    res.json({
      success: true,
      damage: Math.max(1, finalDamage),
      minDamage,
      maxDamage,
      avgDamage,
      attackerStats: attackerPokemon.stats,
      defenderStats: defenderPokemon.stats,
      movePower: moveObj.bp,
      moveType: moveObj.type
    });
  } catch (error) {
    console.error('Damage calculation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/calculate-stats', (req, res) => {
  try {
    const pokemon = createPokemon(req.body);
    
    res.json({
      success: true,
      stats: {
        hp: pokemon.stats.hp,
        attack: pokemon.stats.atk,
        defense: pokemon.stats.def,
        spAttack: pokemon.stats.spa,
        spDefense: pokemon.stats.spd,
        speed: pokemon.stats.spe
      },
      rawStats: pokemon.stats
    });
  } catch (error) {
    console.error('Stats calculation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/get-move-info', (req, res) => {
  try {
    const { moveName } = req.body;
    const move = new Move(gen, moveName);
    
    res.json({
      success: true,
      move: {
        name: move.name,
        type: move.type,
        power: move.bp,
        accuracy: move.accuracy,
        category: move.category,
        priority: move.priority
      }
    });
  } catch (error) {
    res.status(404).json({ success: false, error: `Move "${req.body.moveName}" not found` });
  }
});

app.post('/api/type-effectiveness', (req, res) => {
  try {
    const { attackType, defenderTypes } = req.body;
    
    let multiplier = 1;
    const typeChart = gen.types;
    
    for (const defType of defenderTypes) {
      const effectiveness = typeChart.get(attackType)?.effectiveness?.[defType];
      if (effectiveness !== undefined) {
        multiplier *= effectiveness;
      }
    }
    
    res.json({
      success: true,
      effectiveness: multiplier,
      message: getEffectivenessMessage(multiplier)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function getEffectivenessMessage(multiplier) {
  if (multiplier === 0) return { text: "It doesn't affect the target...", level: 'immune' };
  if (multiplier < 0.5) return { text: "It's barely effective...", level: 'weak' };
  if (multiplier < 1) return { text: "It's not very effective...", level: 'weak' };
  if (multiplier > 2) return { text: "It's extremely effective!", level: 'super' };
  if (multiplier > 1) return { text: "It's super effective!", level: 'super' };
  return { text: '', level: 'normal' };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: '@smogon/calc', generation: 9 });
});

const PORT = process.env.BATTLE_CALC_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Battle Calculator API running on port ${PORT}`);
});

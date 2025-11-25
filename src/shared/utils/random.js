// Random utility functions for game mechanics

/**
 * Generate random integer between min and max (inclusive)
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random float between min and max
 */
export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Weighted random choice from arrays
 * @param {Array} options - Array of options to choose from
 * @param {Array} weights - Array of weights corresponding to options
 * @returns {*} Selected option
 */
export function weightedRandomChoice(options, weights) {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < options.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return options[i];
    }
  }
  
  return options[options.length - 1];
}

/**
 * Get random element from array
 */
export function getRandomFromArray(array) {
  return array[getRandomInt(0, array.length - 1)];
}

/**
 * Return true with given probability (0-1)
 */
export function chance(probability) {
  return Math.random() < probability;
}

/**
 * Shuffle array in place (Fisher-Yates)
 */
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Roll dice with given number of sides
 */
export function rollDice(sides) {
  return getRandomInt(1, sides);
}

import spanishWords from 'an-array-of-spanish-words';

// Common Spanish verb conjugations and variations not in the base dictionary
const additionalWords = new Set([
  // Common verb conjugations
  'soy', 'eres', 'es', 'somos', 'son',
  'estoy', 'estás', 'está', 'estamos', 'están',
  'tengo', 'tienes', 'tiene', 'tenemos', 'tienen',
  
  // Common articles
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  
  // Common prepositions
  'de', 'en', 'a', 'por', 'para', 'con', 'sin', 'sobre',
  
  // Common pronouns
  'yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas',
  
  // Common adjectives with gender/number variations
  'bueno', 'buena', 'buenos', 'buenas',
  'malo', 'mala', 'malos', 'malas',
  'grande', 'grandes', 'pequeño', 'pequeña', 'pequeños', 'pequeñas'
]);

// Create a combined dictionary
const dictionary = new Set([...spanishWords, ...additionalWords]);

// Common accent replacements
const accentMap = {
  'á': 'a',
  'é': 'e',
  'í': 'i',
  'ó': 'o',
  'ú': 'u',
  'ü': 'u',
  'ñ': 'n'
};

function normalizeWord(word) {
  return word.toLowerCase()
    .split('')
    .map(char => accentMap[char] || char)
    .join('');
}

export function checkWord(word) {
  const normalizedWord = normalizeWord(word);
  return {
    isValid: dictionary.has(word) || dictionary.has(normalizedWord),
    normalized: normalizedWord
  };
}

export function getSuggestions(word) {
  const normalizedWord = normalizeWord(word);
  const suggestions = new Set();
  
  // Direct lookup
  if (dictionary.has(word)) return [];
  
  // Check normalized version
  const normalizedMatches = Array.from(dictionary)
    .filter(dictWord => normalizeWord(dictWord) === normalizedWord);
  normalizedMatches.forEach(match => suggestions.add(match));
  
  // Levenshtein distance for similar words
  const maxDistance = Math.min(3, Math.floor(word.length / 3));
  
  Array.from(dictionary).forEach(dictWord => {
    const distance = natural.LevenshteinDistance(
      normalizedWord,
      normalizeWord(dictWord),
      { search: true }
    );
    
    if (distance <= maxDistance) {
      suggestions.add(dictWord);
    }
  });
  
  return Array.from(suggestions)
    .sort((a, b) => {
      const distA = natural.LevenshteinDistance(normalizedWord, normalizeWord(a));
      const distB = natural.LevenshteinDistance(normalizedWord, normalizeWord(b));
      return distA - distB;
    })
    .slice(0, 5); // Return top 5 suggestions
}

export const spanishDictionary = dictionary;
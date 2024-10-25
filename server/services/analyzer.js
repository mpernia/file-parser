import natural from 'natural';
import { checkWord, getSuggestions } from './dictionary.js';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const language = "Spanish";
natural.PorterStemmer.attach();

export async function analyzeDocument(text) {
  const results = [];
  
  // Tokenize the text into sentences
  const sentences = text.split(/[.!?]+/);
  
  for (let sentence of sentences) {
    // Skip empty sentences
    if (!sentence.trim()) continue;
    
    // Analyze each sentence
    const analysis = await analyzeSentence(sentence.trim());
    if (analysis) {
      results.push(analysis);
    }
  }
  
  return results;
}

async function analyzeSentence(sentence) {
  const errors = [];
  
  // Tokenize words
  const words = tokenizer.tokenize(sentence);
  
  // Spell checking with enhanced Spanish dictionary
  for (let word of words) {
    // Skip numbers and special characters
    if (/^\d+$/.test(word) || /^[.,;:!?¡¿"'()\[\]{}]$/.test(word)) continue;
    
    const { isValid } = checkWord(word);
    
    if (!isValid) {
      const suggestions = getSuggestions(word);
      if (suggestions.length > 0) {
        errors.push({
          type: 'spelling',
          word,
          suggestions,
          description: 'Posible error ortográfico'
        });
      }
    }
  }
  
  // Grammar checking
  const tags = await natural.BrillPOSTagger.tag(words);
  
  // Basic grammar rules for Spanish
  for (let i = 0; i < tags.length - 1; i++) {
    const current = tags[i];
    const next = tags[i + 1];
    
    // Article-noun gender agreement
    if (current.tag === 'DT' && next.tag === 'NN') {
      const article = current.token.toLowerCase();
      const noun = next.token.toLowerCase();
      
      if ((article === 'el' && noun.endsWith('a')) || 
          (article === 'la' && noun.endsWith('o'))) {
        errors.push({
          type: 'grammar',
          text: `${current.token} ${next.token}`,
          description: 'Posible desacuerdo en género entre artículo y sustantivo',
          suggestions: [
            article === 'el' ? `la ${noun}` : `el ${noun}`
          ]
        });
      }
    }
    
    // Basic verb conjugation checks
    if (current.tag === 'PRP' && next.tag === 'VB') {
      const pronoun = current.token.toLowerCase();
      const verb = next.token.toLowerCase();
      
      // Simple pronoun-verb agreement check
      if (pronoun === 'yo' && !verb.endsWith('o')) {
        errors.push({
          type: 'grammar',
          text: `${pronoun} ${verb}`,
          description: 'Posible error en la conjugación verbal',
          suggestions: [`${pronoun} ${verb}o`]
        });
      }
    }
  }
  
  if (errors.length > 0) {
    return {
      text: sentence,
      errors
    };
  }
  
  return null;
}
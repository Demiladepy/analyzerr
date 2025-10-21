const crypto = require('crypto');

function analyzeString(str) {
  const length = str.length;
  const isPalindrome = str.toLowerCase() === str.toLowerCase().split('').reverse().join('');
  const uniqueCharacters = new Set(str).size;
  const wordCount = str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
  const sha256Hash = crypto.createHash('sha256').update(str).digest('hex');
  
  const characterFrequencyMap = {};
  for (const char of str) {
    characterFrequencyMap[char] = (characterFrequencyMap[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome: isPalindrome,
    unique_characters: uniqueCharacters,
    word_count: wordCount,
    sha256_hash: sha256Hash,
    character_frequency_map: characterFrequencyMap
  };
}

module.exports = analyzeString;

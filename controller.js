const crypto = require('crypto');
const analyzeString = require('./analyser');
const db = require('./database');

// Create/Analyze String
exports.createString = (req, res) => {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Missing "value" field' });
    if (typeof value !== 'string') return res.status(422).json({ error: '"value" must be a string' });

    const properties = analyzeString(value);
    const id = properties.sha256_hash;

    if (db.has(id)) return res.status(409).json({ error: 'String already exists in the system' });

    const newString = {
      id,
      value,
      properties,
      created_at: new Date().toISOString()
    };

    db.set(id, newString);
    res.status(201).json(newString);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Specific String
exports.getString = (req, res) => {
  try {
    const stringValue = decodeURIComponent(req.params.string_value);
    const id = crypto.createHash('sha256').update(stringValue).digest('hex');
    const stored = db.get(id);

    if (!stored) return res.status(404).json({ error: 'String not found' });

    res.status(200).json(stored);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Strings with Filtering
exports.getStrings = (req, res) => {
  try {
    const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;
    let results = Array.from(db.values());

    if (is_palindrome !== undefined)
      results = results.filter(s => s.properties.is_palindrome === (is_palindrome === 'true'));

    if (min_length) results = results.filter(s => s.properties.length >= parseInt(min_length));
    if (max_length) results = results.filter(s => s.properties.length <= parseInt(max_length));
    if (word_count) results = results.filter(s => s.properties.word_count === parseInt(word_count));
    if (contains_character)
      results = results.filter(s => s.value.includes(contains_character));

    res.status(200).json({
      data: results,
      count: results.length,
      filters_applied: {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character
      }
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete String
exports.deleteString = (req, res) => {
  try {
    const stringValue = decodeURIComponent(req.params.string_value);
    const id = crypto.createHash('sha256').update(stringValue).digest('hex');

    if (!db.has(id)) return res.status(404).json({ error: 'String does not exist in the system' });

    db.delete(id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

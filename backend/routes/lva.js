const express = require('express');
const router = express.Router();
const LiveVariableAnalyzer = require('../lva/analyzer');
const examples = require('../lva/examples');

/**
 * POST /api/lva/analyze
 * Analyze JavaScript code for live variables
 */
router.post('/analyze', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Code must be a non-empty string' 
      });
    }

    if (code.length > 50000) {
      return res.status(400).json({ 
        error: 'Code too long',
        message: 'Code must be less than 50,000 characters' 
      });
    }

    // Perform analysis
    const analyzer = new LiveVariableAnalyzer(code);
    const results = analyzer.analyze();

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('LVA Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/lva/examples
 * Get example code snippets
 */
router.get('/examples', (req, res) => {
  res.json({
    success: true,
    examples,
  });
});

/**
 * GET /api/lva/example/:id
 * Get a specific example and its analysis
 */
router.get('/example/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const example = examples.find((ex) => ex.id === id);

    if (!example) {
      return res.status(404).json({
        success: false,
        error: 'Example not found',
      });
    }

    // Analyze the example
    const analyzer = new LiveVariableAnalyzer(example.code);
    const results = analyzer.analyze();

    res.json({
      success: true,
      example,
      results,
    });
  } catch (error) {
    console.error('Example analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error.message,
    });
  }
});

module.exports = router;

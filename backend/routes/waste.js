const express = require('express');
const router = express.Router();
const { analyzeWasteImage, WASTE_LIBRARY } = require('../services/wasteVisionService');

// POST /api/waste/analyze — Analyze waste image with Gemini Vision → NVIDIA → Demo fallback
router.post('/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description = '', userId } = req.body;

    if (!imageBase64 && !description) {
      return res.status(400).json({
        error: 'imageBase64 or description is required',
        hint: 'Send the base64-encoded image in the imageBase64 field',
      });
    }

    if (imageBase64 && imageBase64.length < 100) {
      return res.status(400).json({ error: 'imageBase64 appears to be empty or corrupted' });
    }

    console.log(`[Waste API] Analyzing waste — image: ${imageBase64 ? Math.round(imageBase64.length / 1024) + 'KB' : 'none'}, desc: "${description}"`);

    const analysis = await analyzeWasteImage(imageBase64, mimeType, description);

    // Determine provider label
    const providerLabel = {
      'gemini-vision': '🔬 Google Gemini 1.5 Flash (Vision AI)',
      'nvidia': '🤖 NVIDIA NIM Llama 3.1',
      'demo': '📚 EcoBot Smart Classifier',
    }[analysis.source] || 'EcoBot AI';

    res.json({
      success: true,
      analysis,
      powered_by: providerLabel,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Waste API] Fatal error:', error.message);
    res.status(500).json({
      error: 'Waste analysis failed',
      message: error.message,
      // Return a safe demo result even on fatal error
      analysis: {
        type: 'Unknown Waste',
        category: 'Mixed',
        confidence: 50,
        disposal: 'Please segregate waste into wet/dry categories and use appropriate bins',
        tips: [
          'Separate organic waste (food, plants) from dry waste (paper, plastic)',
          'Take recyclables to your nearest collection center',
          'Never mix hazardous items with regular waste',
          'Contact local municipality for special disposal guidance',
        ],
        environmental_impact: 'Proper waste management reduces landfill usage and prevents soil and water contamination.',
        icon: '♻️',
        source: 'error-fallback',
      },
    });
  }
});

// GET /api/waste/types — Waste type reference guide
router.get('/types', (req, res) => {
  res.json({
    types: WASTE_LIBRARY.map(w => ({
      type: w.type,
      category: w.category,
      icon: w.icon,
      keywords: w.keywords.slice(0, 5),
    })),
    powered_by: 'EcoBot AI Knowledge Base',
  });
});

// POST /api/waste/classify-text — Text-only waste classification (no image)
router.post('/classify-text', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'description is required' });
    }

    const { classifyByKeywords } = require('../services/wasteVisionService');
    const nvidiaService = require('../services/nvidiaService');

    let result;
    // Try NVIDIA first for text
    if (nvidiaService.isAvailable()) {
      try {
        result = await nvidiaService.analyzeWasteText(description);
        result.source = 'nvidia';
      } catch {
        result = classifyByKeywords(description);
      }
    } else {
      result = classifyByKeywords(description);
    }

    res.json({ success: true, analysis: result });
  } catch (error) {
    res.status(500).json({ error: 'Classification failed', message: error.message });
  }
});

module.exports = router;

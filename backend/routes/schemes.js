const express = require('express');
const router = express.Router();
const nvidiaService = require('../services/nvidiaService');

// GET /api/schemes — list all schemes with optional AI search
router.get('/', (req, res) => {
  const { category = 'all', search = '' } = req.query;
  let schemes;
  try {
    schemes = require('../data/schemes.json');
  } catch {
    return res.status(500).json({ error: 'Schemes database unavailable' });
  }
  let filtered = schemes;
  if (category !== 'all') filtered = filtered.filter(s => s.category === category);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.benefit.toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q)
    );
  }
  res.json({
    schemes: filtered,
    total: filtered.length,
    category,
    search,
    powered_by: nvidiaService.isAvailable() ? 'NVIDIA NIM' : 'Database',
  });
});

// POST /api/schemes/search — AI-powered scheme search
router.post('/search', async (req, res) => {
  try {
    const { query, category = 'all' } = req.body;
    if (!query) return res.status(400).json({ error: 'query is required' });
    const result = await nvidiaService.getSchemeInfo(query, category);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Scheme search error:', error);
    res.status(500).json({ error: 'Scheme search failed' });
  }
});

// GET /api/schemes/categories
router.get('/categories', (req, res) => {
  res.json({
    categories: [
      { id: 'farming', label: 'Farming', count: 3, icon: '🌾' },
      { id: 'water', label: 'Water', count: 2, icon: '💧' },
      { id: 'energy', label: 'Energy', count: 2, icon: '⚡' },
      { id: 'rural', label: 'Rural Welfare', count: 2, icon: '🏡' },
    ]
  });
});

// POST /api/schemes/farming-advice — AI farming advice
router.post('/farming-advice', async (req, res) => {
  try {
    const { crop, location = 'Tamil Nadu', season = '' } = req.body;
    if (!crop) return res.status(400).json({ error: 'crop is required' });
    const result = await nvidiaService.getFarmingAdvice(crop, location, season);
    res.json({ success: true, advice: result, crop, location, season, powered_by: 'NVIDIA NIM' });
  } catch (error) {
    console.error('Farming advice error:', error);
    res.status(500).json({ error: 'Failed to get farming advice' });
  }
});

module.exports = router;

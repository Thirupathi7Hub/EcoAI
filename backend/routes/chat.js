const express = require('express');
const router = express.Router();
const nvidiaService = require('../services/nvidiaService');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, language = 'en', userId } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required and must be a string' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long. Maximum 2000 characters.' });
    }

    const result = await nvidiaService.chat(message.trim(), language);
    res.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
      powered_by: nvidiaService.isAvailable() ? 'NVIDIA NIM — Llama 3.1 70B' : 'Demo Mode',
    });
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ error: 'Chat service error. Please try again.' });
  }
});

// GET /api/chat/suggestions
router.get('/suggestions', (req, res) => {
  const { language = 'en' } = req.query;
  const suggestions = language === 'ta' ? [
    'கரிம விவசாயம் எப்படி தொடங்குவது?',
    'நீர் சேமிப்பு முறைகள் என்ன?',
    'கழிவு மேலாண்மை குறிப்புகள்',
    'PM-KISAN திட்டம் பற்றி சொல்லுங்கள்',
    'மண் ஆரோக்கியம் எப்படி மேம்படுத்துவது?',
  ] : [
    'How to start organic farming?',
    'Water conservation techniques for farms',
    'How to manage plastic waste at home?',
    'Tell me about PM-KISAN scheme',
    'Climate change effects on crops in Tamil Nadu',
    'Best crops to grow in summer season',
    'How to set up a biogas plant?',
  ];
  res.json({
    suggestions,
    powered_by: nvidiaService.isAvailable() ? 'NVIDIA NIM' : 'Demo Mode',
  });
});

// GET /api/chat/status
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    ai_provider: nvidiaService.isAvailable() ? 'NVIDIA NIM' : 'Demo Mode',
    model: nvidiaService.isAvailable() ? 'meta/llama-3.1-70b-instruct' : 'demo-fallback',
    features: ['chat', 'farming-advice', 'scheme-info', 'waste-analysis'],
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();

// GET /api/analytics/summary/:userId
router.get('/summary/:userId', (req, res) => {
  const { userId } = req.params;
  // In production: fetch from Firestore
  res.json({
    userId,
    greenScore: 72,
    waterSaved: 1240,
    wasteClassified: 48,
    carbonReduced: 85,
    aiInteractions: 131,
    lastUpdated: new Date().toISOString(),
    monthlyData: {
      water: [120, 190, 170, 210, 250, 280],
      waste: [5, 8, 6, 12, 10, 15],
      carbon: [8, 12, 10, 15, 18, 22],
    },
    wasteBreakdown: {
      plastic: 35, organic: 28, paper: 18, ewaste: 8, metal: 7, other: 4,
    },
    goals: {
      waterConservation: 68,
      wasteReduction: 82,
      carbonFootprint: 55,
      greenPractices: 90,
    },
  });
});

// POST /api/analytics/update
router.post('/update', (req, res) => {
  const { userId, type, value } = req.body;
  if (!userId || !type) {
    return res.status(400).json({ error: 'userId and type are required' });
  }
  // In production: update Firestore
  res.json({ success: true, message: 'Analytics updated', userId, type, value });
});

// GET /api/analytics/leaderboard
router.get('/leaderboard', (req, res) => {
  res.json({
    leaderboard: [
      { rank: 1, displayName: 'Muthu R.', greenScore: 94, village: 'Tirunelveli' },
      { rank: 2, displayName: 'Kavitha S.', greenScore: 89, village: 'Madurai' },
      { rank: 3, displayName: 'Arjun K.', greenScore: 85, village: 'Coimbatore' },
      { rank: 4, displayName: 'Priya M.', greenScore: 80, village: 'Salem' },
      { rank: 5, displayName: 'Rajan T.', greenScore: 75, village: 'Thanjavur' },
    ]
  });
});

module.exports = router;

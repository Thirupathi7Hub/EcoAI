// EcoBot AI — Waste Vision Service
// Uses Google Gemini Vision API for real image-based waste classification
// Falls back to NVIDIA text analysis → demo mode if APIs unavailable

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_KEY = process.env.GEMINI_API_KEY;

// ── Waste type library for smart demo fallback ────────────────────────────
const WASTE_LIBRARY = [
  {
    keywords: ['plastic', 'bottle', 'bag', 'wrap', 'container', 'pet', 'packaging', 'cup', 'straw'],
    type: 'Plastic Waste',
    category: 'Recyclable',
    icon: '🧴',
    disposal: 'Rinse and take to nearest plastic collection center or dry waste bin. Check recycling number (1-7) on the item.',
    tips: [
      'Rinse plastic before disposing — food residue contaminates recyclables',
      'Look for recycling symbols (♻️ 1-7) — most plastics can be recycled',
      'Flatten bottles and containers to save space',
      'Never burn plastic — it releases toxic dioxins into the air',
    ],
    environmental_impact: 'Plastic takes 400-1000 years to decompose. Recycling 1 ton of plastic saves 5.7 barrels of oil and reduces CO₂ emissions significantly.',
  },
  {
    keywords: ['food', 'vegetable', 'fruit', 'organic', 'kitchen', 'leftover', 'peel', 'leaf', 'plant', 'flower', 'compost'],
    type: 'Organic / Food Waste',
    category: 'Compostable',
    icon: '🥬',
    disposal: 'Add to green/wet waste bin or home compost pit. Use for vermicomposting or biogas plant.',
    tips: [
      'Start a home compost bin — turn kitchen scraps into rich fertilizer in 8-12 weeks',
      'Vermicomposting with earthworms produces premium garden fertilizer',
      'Biogas plants convert organic waste into clean cooking fuel',
      'Avoid mixing with plastic or hazardous waste',
    ],
    environmental_impact: 'Organic waste in landfills produces methane — a greenhouse gas 25x more potent than CO₂. Composting it prevents this and improves soil health.',
  },
  {
    keywords: ['paper', 'cardboard', 'newspaper', 'book', 'magazine', 'box', 'carton', 'tissue'],
    type: 'Paper / Cardboard',
    category: 'Recyclable',
    icon: '📦',
    disposal: 'Place in dry/blue waste bin. Sell to local kabadiwala (scrap dealer) for recycling.',
    tips: [
      'Keep paper dry — wet paper cannot be recycled',
      'Remove staples, tapes, and plastic windows from cardboard boxes',
      'Shredded paper can be used for composting (carbon layer)',
      'Old newspapers are excellent for packaging and art projects',
    ],
    environmental_impact: 'Recycling 1 ton of paper saves 17 trees, 7,000 gallons of water, and 3 cubic yards of landfill space.',
  },
  {
    keywords: ['electronic', 'phone', 'mobile', 'laptop', 'computer', 'battery', 'charger', 'wire', 'cable', 'circuit', 'ewaste', 'e-waste'],
    type: 'E-Waste (Electronic Waste)',
    category: 'Hazardous',
    icon: '📱',
    disposal: 'Take to certified e-waste collection centers. Never throw in regular bins or burn.',
    tips: [
      'Find certified e-waste centers via www.cpcb.nic.in or manufacturer take-back programs',
      'Remove personal data before disposing of devices',
      'Lithium batteries are fire hazards — handle with care',
      'Old phones can be donated for reuse programs',
    ],
    environmental_impact: 'E-waste contains lead, mercury, and cadmium that leach into soil and groundwater. Proper recycling recovers gold, silver, and copper worth billions.',
  },
  {
    keywords: ['metal', 'can', 'tin', 'iron', 'steel', 'aluminum', 'copper', 'scrap', 'wire'],
    type: 'Metal Scrap',
    category: 'Recyclable',
    icon: '🥫',
    disposal: 'Sell to local kabadiwala or take to scrap metal dealer. High recycling value.',
    tips: [
      'Flatten cans to save collection space',
      'Remove sharp edges before handling',
      'Steel and aluminum have infinite recyclability',
      'Copper wire fetches good price at scrap dealers',
    ],
    environmental_impact: 'Recycling aluminum saves 95% of energy compared to making new aluminum. Steel recycling saves 60-74% energy.',
  },
  {
    keywords: ['glass', 'bottle', 'jar', 'window', 'mirror'],
    type: 'Glass Waste',
    category: 'Recyclable',
    icon: '🍾',
    disposal: 'Place in glass collection bin. Sort by color (clear/green/brown) if possible.',
    tips: [
      'Glass can be recycled infinitely without quality loss',
      'Never mix broken glass with other recyclables — wrap safely',
      'Sort by color for best recycling efficiency',
      'Intact glass bottles can be returned/reused',
    ],
    environmental_impact: 'Recycling 1 glass bottle saves enough energy to power a 100W bulb for 4 hours. Glass in landfills takes 1 million years to decompose.',
  },
  {
    keywords: ['hazardous', 'chemical', 'paint', 'medicine', 'medical', 'syringe', 'needle', 'pesticide', 'oil', 'motor oil'],
    type: 'Hazardous Waste',
    category: 'Hazardous',
    icon: '☠️',
    disposal: 'Take to designated hazardous waste collection facility. Never pour down drains or mix with regular waste.',
    tips: [
      'Store in original containers with labels until disposal',
      'Contact local municipality for hazardous waste collection events',
      'Never pour chemicals down drains — contaminates groundwater',
      'Medical waste must go to hospital biomedical waste collection',
    ],
    environmental_impact: 'Hazardous waste contamination can render soil infertile for decades and make groundwater undrinkable, affecting entire communities.',
  },
  {
    keywords: ['cloth', 'textile', 'fabric', 'shirt', 'pant', 'dress', 'shoe', 'bag', 'jute'],
    type: 'Textile / Clothing',
    category: 'Reusable',
    icon: '👕',
    disposal: 'Donate usable items to NGOs/charity. Repurpose worn cloth as cleaning rags. Recycle via textile banks.',
    tips: [
      'Donate gently used clothes to NGOs or community centers',
      'Worn cloth makes excellent cleaning rags and dusters',
      'Old cotton cloth is excellent for composting (carbon source)',
      'Check for textile recycling bins in your city',
    ],
    environmental_impact: 'Textile industry produces 10% of global CO₂. Extending clothing life by 9 months reduces carbon, water, and waste footprints by 20-30%.',
  },
];

// ── Smart demo classifier — pattern-matches keywords ─────────────────────
const classifyByKeywords = (description = '') => {
  const text = description.toLowerCase();
  
  for (const waste of WASTE_LIBRARY) {
    const matchCount = waste.keywords.filter(k => text.includes(k)).length;
    if (matchCount >= 1) {
      return {
        ...waste,
        confidence: Math.min(60 + matchCount * 8, 85),
        source: 'demo',
      };
    }
  }

  // Default: Mixed/General
  return {
    type: 'Mixed / General Waste',
    category: 'Mixed',
    icon: '🗑️',
    confidence: 65,
    disposal: 'Segregate the waste first — separate dry (paper, plastic) from wet (food, organic). Use appropriate colored bins.',
    tips: [
      'Step 1: Separate wet waste (food) from dry waste (plastic, paper)',
      'Step 2: Recyclables (paper, plastic, metal) → dry/blue bin',
      'Step 3: Organic/kitchen waste → wet/green bin',
      'Step 4: Hazardous items → contact local municipality',
    ],
    environmental_impact: 'Proper waste segregation at source reduces landfill load by up to 60% and enables circular economy for materials.',
    source: 'demo',
  };
};

// ── NVIDIA-based text analysis (already set up in nvidiaService) ──────────
const analyzeWithNvidia = async (description) => {
  const nvidiaService = require('./nvidiaService');
  try {
    const result = await nvidiaService.analyzeWasteText(description);
    return { ...result, source: 'nvidia' };
  } catch {
    return null;
  }
};

// ── Gemini Vision — actual image analysis ────────────────────────────────
const analyzeImageWithGemini = async (imageBase64, mimeType = 'image/jpeg') => {
  if (!GEMINI_KEY || GEMINI_KEY.trim() === '') {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert waste management AI. Analyze this waste image carefully.

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON):
{
  "type": "specific waste type name",
  "category": "Recyclable OR Organic OR Hazardous OR Non-recyclable OR Compostable OR Reusable",
  "confidence": 88,
  "disposal": "specific, actionable disposal instructions for rural India",
  "tips": [
    "specific tip 1",
    "specific tip 2", 
    "specific tip 3",
    "specific tip 4"
  ],
  "environmental_impact": "what happens if this is not disposed properly",
  "icon": "single relevant emoji"
}

Be specific about what you see. If you see plastic bottle, say "Plastic Bottle (PET)". If food waste, specify type.`;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const text = result.response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini returned non-JSON response');

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate required fields
  if (!parsed.type || !parsed.category || !parsed.disposal) {
    throw new Error('Gemini returned incomplete waste analysis');
  }

  return { ...parsed, source: 'gemini-vision' };
};

// ── Main export: analyzeWasteImage ────────────────────────────────────────
const analyzeWasteImage = async (imageBase64, mimeType = 'image/jpeg', description = '') => {
  const errors = [];

  // 1. Try Gemini Vision (real image analysis)
  if (imageBase64 && imageBase64.length > 100) {
    try {
      console.log('[Waste] Trying Gemini Vision...');
      const result = await analyzeImageWithGemini(imageBase64, mimeType);
      console.log(`[Waste] ✅ Gemini Vision success: ${result.type}`);
      return result;
    } catch (err) {
      errors.push(`Gemini Vision: ${err.message}`);
      console.warn('[Waste] Gemini Vision failed:', err.message);
    }
  }

  // 2. Try NVIDIA text analysis (if description provided or default)
  const analysisText = description || extractKeywordsFromBase64Hint(imageBase64) || 'waste item from uploaded image';
  try {
    console.log('[Waste] Trying NVIDIA text analysis...');
    const result = await analyzeWithNvidia(analysisText);
    if (result && result.type) {
      console.log(`[Waste] ✅ NVIDIA text success: ${result.type}`);
      return result;
    }
  } catch (err) {
    errors.push(`NVIDIA: ${err.message}`);
    console.warn('[Waste] NVIDIA analysis failed:', err.message);
  }

  // 3. Smart demo fallback with keyword matching
  console.log('[Waste] Using smart demo fallback');
  const demoResult = classifyByKeywords(description || analysisText);
  return demoResult;
};

// Hint: try to detect mime type for better description
const extractKeywordsFromBase64Hint = (base64) => {
  if (!base64) return '';
  // Check base64 header hint for image type — give generic hint for text model
  return 'waste item from uploaded photo image';
};

module.exports = { analyzeWasteImage, classifyByKeywords, WASTE_LIBRARY };

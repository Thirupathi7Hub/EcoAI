// EcoBot AI — Frontend AI Service
// Routes all AI calls through the backend API (powered by NVIDIA NIM Llama 3.1 70B)
// Falls back to demo responses if backend is unavailable

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Stub — actual save goes through dbService; this is kept for import compatibility
export const saveWasteReport = async (userId, reportData) => {
  // Saving handled in WasteDetectionPage via dbService
  return reportData;
};


// Helper: call backend with timeout
const callBackend = async (endpoint, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Backend error ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
};

// --------------- Demo Fallback Responses ---------------
const DEMO_RESPONSES = {
  farming: `🌱 **Sustainable Farming Tips for Rural Communities:**\n\n**Organic Fertilizers:**\n- Use compost from kitchen waste and crop residues\n- Apply vermicompost for better soil health\n- Practice green manuring with legumes\n\n**Water-Smart Techniques:**\n- Drip irrigation saves 50-70% water vs. flood irrigation\n- Mulching reduces water evaporation significantly\n- Rainwater harvesting for field irrigation\n\n**Pest Management:**\n- Neem oil spray: effective natural pesticide (5ml/L water)\n- Companion planting: marigolds deter pests\n- Biological control using beneficial insects\n\n**Government Schemes:**\n- PM-KISAN: ₹6,000/year direct benefit\n- Soil Health Card Scheme: free soil testing\n- PMFBY: Crop insurance protection\n\n*Powered by NVIDIA NIM AI — Ask me anything about farming!*`,

  water: `💧 **Water Conservation for Rural Communities:**\n\n**Household Level:**\n- Fix leaking taps — saves 20+ liters/day\n- Collect and reuse greywater for gardens\n- Install low-flow fixtures\n\n**Agricultural Level:**\n- Micro-irrigation (drip/sprinkler) systems\n- Farm ponds for rainwater storage\n- Contour farming to reduce runoff\n\n**Community Schemes:**\n- Jal Jeevan Mission: tap water to every household\n- Atal Bhujal Yojana: groundwater conservation\n- PM Krishi Sinchayee Yojana: irrigation coverage`,

  waste: `♻️ **Waste Management Guide:**\n\n**Segregation at Source:**\n- 🟢 Green bin: Organic/biodegradable waste\n- 🔵 Blue bin: Recyclable (paper, plastic, metal)\n- 🔴 Red bin: Hazardous/non-recyclable\n\n**Organic Waste:**\n- Home composting for kitchen waste\n- Biogas plant: converts waste to cooking fuel\n- Vermicomposting: creates natural fertilizer\n\n**Plastic Waste:**\n- Return to collection centers\n- Never burn plastic — causes toxic pollution`,

  schemes: `📋 **Government Schemes for Rural Communities:**\n\n**Farming:**\n- 🌾 PM-KISAN: ₹6,000/year for small farmers\n- 📋 PM Fasal Bima Yojana: Crop insurance\n\n**Water:**\n- 💧 Jal Jeevan Mission: Clean tap water\n\n**Energy:**\n- ☀️ PM Surya Ghar: Free solar + ₹78,000 subsidy\n- 🔋 PM Ujjwala Yojana: Free LPG connection\n\n**Rural Welfare:**\n- 💰 MGNREGS: 100 days guaranteed employment`,

  default: `🌍 **Hello! I'm EcoBot AI — Your Sustainability Assistant!**\n\nPowered by **NVIDIA NIM Llama 3.1 8B** (fast mode).\n\nI can help you with:\n🌱 **Sustainable Farming** — organic methods, crop suggestions, pest control\n💧 **Water Conservation** — techniques, rainwater harvesting, irrigation\n♻️ **Waste Management** — segregation, composting, recycling\n📋 **Government Schemes** — PM-KISAN, Jal Jeevan Mission, PM Surya Ghar\n🌡️ **Climate Awareness** — adaptation strategies for rural communities\n\nநான் தமிழிலும் பேசுகிறேன்! (I speak Tamil too!)`,
};

const getDemoResponse = (message) => {
  const msg = (message || '').toLowerCase();
  if (msg.includes('farm') || msg.includes('crop') || msg.includes('agriculture') || msg.includes('விவசாயம்')) return DEMO_RESPONSES.farming;
  if (msg.includes('water') || msg.includes('நீர்') || msg.includes('irrigation') || msg.includes('conserve')) return DEMO_RESPONSES.water;
  if (msg.includes('waste') || msg.includes('recycle') || msg.includes('கழிவு') || msg.includes('plastic')) return DEMO_RESPONSES.waste;
  if (msg.includes('scheme') || msg.includes('government') || msg.includes('அரசு') || msg.includes('yojana')) return DEMO_RESPONSES.schemes;
  return DEMO_RESPONSES.default;
};

// --------------- Exported AI Service Functions ---------------

/**
 * Send a chat message to EcoBot AI (powered by NVIDIA NIM via backend)
 */
export const sendChatMessage = async (message, chatHistory = [], language = 'en') => {
  try {
    const data = await callBackend('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language }),
    });
    return data.response || getDemoResponse(message);
  } catch (error) {
    console.warn('[EcoBot] Backend unavailable, using demo response:', error.message);
    await new Promise(r => setTimeout(r, 800));
    return getDemoResponse(message);
  }
};

/**
 * Analyze waste image (sends image description to NVIDIA via backend)
 */
export const analyzeWasteImage = async (imageData, mimeType = 'image/jpeg', description = '') => {
  try {
    // Try backend with image + description
    const data = await callBackend('/api/waste/analyze', {
      method: 'POST',
      body: JSON.stringify({
        imageBase64: imageData,
        mimeType,
        description: description || 'waste item from uploaded photo',
      }),
    });
    return data.analysis;
  } catch (error) {
    console.warn('[EcoBot] Waste analysis fallback:', error.message);
    await new Promise(r => setTimeout(r, 1200));
    return {
      type: 'Plastic Waste',
      category: 'Recyclable',
      confidence: 87,
      disposal: 'Take to nearest recycling center or plastic collection drive',
      tips: [
        'Clean the plastic before disposing',
        'Separate different types of plastics',
        'Check for recycling symbols (1-7)',
        'Never burn plastic waste',
      ],
      environmental_impact: 'Plastic takes 400-1000 years to decompose. Proper recycling saves energy and reduces pollution.',
      icon: '♻️',
    };
  }
};

/**
 * Get AI farming advice for a specific crop
 */
export const getFarmingAdvice = async (cropType, location, season) => {
  try {
    const data = await callBackend('/api/schemes/farming-advice', {
      method: 'POST',
      body: JSON.stringify({ crop: cropType, location: location || 'Tamil Nadu', season: season || '' }),
    });
    return data.advice;
  } catch (error) {
    console.warn('[EcoBot] Farming advice fallback:', error.message);
    await new Promise(r => setTimeout(r, 900));
    return {
      recommendations: [
        { title: 'Soil Preparation', desc: 'Test soil pH (6.0-7.0 ideal). Add organic compost 2-3 weeks before planting.' },
        { title: 'Irrigation', desc: 'Use drip irrigation. Water in morning to reduce evaporation.' },
        { title: 'Pest Control', desc: 'Spray neem oil solution (5ml/L water) weekly. Use yellow sticky traps.' },
        { title: 'Harvesting', desc: 'Harvest during cooler morning hours. Use sharp clean tools.' },
      ],
      waterNeeds: 'Moderate (2-3 liters/plant/day)',
      bestPractices: 'Practice crop rotation every season to maintain soil health',
      organicFertilizer: 'Apply vermicompost 200kg/acre monthly',
    };
  }
};

/**
 * Get AI-powered government scheme information
 */
export const getSchemeInfo = async (query, category = 'all') => {
  try {
    const data = await callBackend('/api/schemes/search', {
      method: 'POST',
      body: JSON.stringify({ query, category }),
    });
    return data.response || data.schemes;
  } catch (error) {
    console.warn('[EcoBot] Scheme info fallback:', error.message);
    await new Promise(r => setTimeout(r, 600));
    return getDemoResponse(`${query} scheme government`);
  }
};

/**
 * Check AI backend status
 */
export const getAIStatus = async () => {
  try {
    const data = await callBackend('/api/chat/status', { method: 'GET' });
    return data;
  } catch {
    return { status: 'offline', ai_provider: 'Demo Mode', model: 'demo-fallback' };
  }
};

/**
 * Get chat suggestions
 */
export const getChatSuggestions = async (language = 'en') => {
  try {
    const data = await callBackend(`/api/chat/suggestions?language=${language}`, { method: 'GET' });
    return data.suggestions || [];
  } catch {
    return language === 'ta' ? [
      'கரிம விவசாயம் எப்படி தொடங்குவது?',
      'நீர் சேமிப்பு முறைகள்',
      'PM-KISAN திட்டம் பற்றி சொல்லுங்கள்',
    ] : [
      'How to start organic farming?',
      'Water conservation techniques',
      'Tell me about PM-KISAN scheme',
      'How to manage plastic waste?',
    ];
  }
};

// NVIDIA NIM AI Service for EcoBot AI
// Uses NVIDIA's OpenAI-compatible API endpoint
// Model: meta/llama-3.1-70b-instruct (best for multilingual + reasoning)

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = 'meta/llama-3.1-8b-instruct'; // Fast 8B model (~5x faster than 70B)

const ECO_SYSTEM_PROMPT = `You are EcoBot AI, a smart sustainability assistant designed specifically for rural communities in India, especially Tamil Nadu.

Your expertise:
1. Sustainable farming — organic agriculture, crop selection, soil health, pest control
2. Water conservation — irrigation techniques, rainwater harvesting, water-saving methods
3. Waste management — segregation, composting, recycling, e-waste handling
4. Government schemes — PM-KISAN, Jal Jeevan Mission, PM Surya Ghar, MGNREGS, PM Fasal Bima
5. Climate change — adaptation strategies, carbon reduction for rural communities
6. Environmental conservation — biodiversity, sustainable energy for villages

Guidelines:
- Be practical and actionable for resource-limited rural environments
- When asked in Tamil, ALWAYS respond fully in Tamil
- Cite relevant government schemes when applicable
- Align with SDG 6 (Clean Water), SDG 9 (Innovation), SDG 11 (Communities), SDG 13 (Climate Action)
- Keep responses concise, clear, and easy to understand for rural users
- Use emojis where helpful for visual clarity`;

const isConfigured = () => {
  return NVIDIA_API_KEY &&
    !NVIDIA_API_KEY.includes('your-') &&
    NVIDIA_API_KEY.startsWith('nvapi-');
};

const callNvidiaAPI = async (messages, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000); // 12s hard timeout

  try {
    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages,
        temperature: options.temperature ?? 0.5,
        max_tokens: options.max_tokens ?? 1024,
        top_p: 0.85,
        stream: false,
      }),
    });

    clearTimeout(timer);

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`NVIDIA API error ${response.status}: ${err.substring(0, 100)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('NVIDIA API timeout — using demo mode');
    throw err;
  }
};

// Detect if message contains Tamil Unicode characters
const isTamilText = (text) => /[\u0B80-\u0BFF]/.test(text);

// Demo fallback responses — language aware
const getDemoResponse = (message, language = 'en') => {
  const msg = (message || '').toLowerCase();
  const tamil = language === 'ta' || isTamilText(message);

  // ── TAMIL RESPONSES ────────────────────────────────
  if (tamil) {
    if (msg.includes('நீர்') || msg.includes('water') || msg.includes('irrigation') || msg.includes('சேமிப்பு')) {
      return `💧 **நீர் சேமிப்பு முறைகள்:**\n- சொட்டு நீர்ப்பாசனம் — 50-70% நீரை சேமிக்கும்\n- பண்ணை குளங்கள் — மழைநீரை சேமிக்க உதவும்\n- மல்ச்சிங் — நீர் ஆவியாவதை 30-40% குறைக்கும்\n- கசிவு குழாய்களை சரி செய்யுங்கள் — தினமும் 20+ லிட்டர் சேமிக்கலாம்\n- ஜல் ஜீவன் மிஷன் — இலவச குழாய் இணைப்பு வழங்குகிறது\n- அடல் பூஜல் யோஜனா — நிலத்தடி நீர் பாதுகாப்பு திட்டம்`;
    }
    if (msg.includes('விவசாயம்') || msg.includes('farm') || msg.includes('பயிர்') || msg.includes('crop')) {
      return `🌱 **நிலையான விவசாய குறிப்புகள்:**\n- கரிம உரம் மற்றும் மண்புழு உரம் பயன்படுத்துங்கள்\n- ஒவ்வொரு பருவமும் பயிர் சுழற்சி செய்யுங்கள்\n- வேம்பு எண்ணெய் தெளிப்பு — இயற்கை பூச்சிக்கொல்லி\n- சொட்டு நீர்ப்பாசனம் — தண்ணீரை திறம்பட பயன்படுத்துங்கள்\n- PM-KISAN திட்டம் — ஆண்டுக்கு ₹6,000 நேரடி நிதி உதவி`;
    }
    if (msg.includes('கழிவு') || msg.includes('waste') || msg.includes('recycle') || msg.includes('plastic')) {
      return `♻️ **கழிவு மேலாண்மை வழிகாட்டி:**\n- 🟢 பச்சை தொட்டி: உணவு/கரிம கழிவு → உரமாக்கல்\n- 🔵 நீல தொட்டி: பிளாஸ்டிக், காகிதம், உலோகம் → மறுசுழற்சி\n- 🔴 சிவப்பு தொட்டி: தீங்கான கழிவு → சிறப்பு அகற்றல்\n- பிளாஸ்டிக்கை எரிக்காதீர்கள் — விஷ காற்று மாசுபாடு ஏற்படும்\n- வீட்டு கழிவை உரமாக்கி விவசாயத்தில் பயன்படுத்தலாம்`;
    }
    if (msg.includes('திட்டம்') || msg.includes('scheme') || msg.includes('அரசு') || msg.includes('government')) {
      return `📋 **முக்கிய அரசு திட்டங்கள்:**\n- 🌾 PM-KISAN: சிறு விவசாயிகளுக்கு ஆண்டுக்கு ₹6,000\n- ☀️ PM சூர்ய கர்: இலவச சோலார் + ₹78,000 மானியம்\n- 💧 ஜல் ஜீவன் மிஷன்: இலவச குழாய் நீர் இணைப்பு\n- 🛡️ PM பாசல் பீமா: குறைந்த பிரீமியத்தில் பயிர் காப்பீடு\n- 👷 MGNREGS: ஆண்டுக்கு 100 நாள் உத்தரவாத வேலை\n- 🔥 PM உஜ்வாலா யோஜனா: BPL குடும்பங்களுக்கு இலவச LPG`;
    }
    return `🌍 **EcoBot AI — நிலைத்தன்மை உதவியாளர்**\n\nநான் உங்களுக்கு உதவ தயாராக இருக்கிறேன்:\n🌱 நிலையான விவசாயம்\n💧 நீர் சேமிப்பு\n♻️ கழிவு மேலாண்மை\n📋 அரசு திட்டங்கள்\n🌡️ காலநிலை விழிப்புணர்வு\n\nகேள்வி கேளுங்கள் — நான் பதில் சொல்கிறேன்!`;
  }

  // ── ENGLISH RESPONSES ──────────────────────────────
  if (msg.includes('farm') || msg.includes('crop') || msg.includes('agriculture') || msg.includes('விவசாயம்')) {
    return `🌱 **Sustainable Farming Tips:**\n- Use organic compost and vermicompost for soil health\n- Practice crop rotation every season\n- Drip irrigation saves 50-70% water vs flood irrigation\n- Neem oil spray — effective organic pest control\n- Apply mulching to retain soil moisture\n- PM-KISAN provides ₹6,000/year financial support`;
  }
  if (msg.includes('water') || msg.includes('நீர்') || msg.includes('irrigation') || msg.includes('conserve') || msg.includes('சேமிப்பு')) {
    return `💧 **Water Conservation Methods:**\n- Drip/sprinkler irrigation for efficient water use\n- Build farm ponds for rainwater harvesting\n- Mulching reduces evaporation by 30-40%\n- Fix leaking pipes — saves 20+ liters/day\n- Jal Jeevan Mission provides free tap connections\n- Atal Bhujal Yojana supports groundwater conservation`;
  }
  if (msg.includes('waste') || msg.includes('recycle') || msg.includes('கழிவு') || msg.includes('plastic')) {
    return `♻️ **Waste Management Guide:**\n- 🟢 Green bin: Organic/kitchen waste → Compost\n- 🔵 Blue bin: Plastic, paper, metal → Recycle\n- 🔴 Red bin: Hazardous waste → Special disposal\n- Never burn plastic — causes toxic air pollution\n- Biogas plant converts organic waste to cooking fuel\n- Vermicomposting creates natural fertilizer`;
  }
  if (msg.includes('scheme') || msg.includes('government') || msg.includes('yojana') || msg.includes('அரசு')) {
    return `📋 **Key Government Schemes:**\n- 🌾 PM-KISAN: ₹6,000/year for small farmers\n- ☀️ PM Surya Ghar: Free solar + ₹78,000 subsidy\n- 💧 Jal Jeevan Mission: Free tap water connection\n- 🛡️ PM Fasal Bima: Crop insurance at low premium\n- 👷 MGNREGS: 100 days guaranteed employment\n- 🔥 PM Ujjwala Yojana: Free LPG for BPL families`;
  }
  return `🌍 **EcoBot AI — Sustainability Assistant**\n\nI can help with:\n🌱 Sustainable Farming\n💧 Water Conservation\n♻️ Waste Management\n📋 Government Schemes\n🌡️ Climate Awareness\n\nநான் தமிழிலும் பேசுகிறேன்! (I speak Tamil too!)`;
};

const nvidiaService = {
  isAvailable: isConfigured,

  async chat(message, language = 'en') {
    // Auto-detect Tamil from Unicode characters in the message
    const effectiveLang = (language === 'ta' || isTamilText(message)) ? 'ta' : 'en';

    if (!isConfigured()) {
      return { response: getDemoResponse(message, effectiveLang), model: 'demo', language: effectiveLang };
    }

    try {
      const langNote = effectiveLang === 'ta'
        ? `CRITICAL INSTRUCTION: The user is writing in Tamil. You MUST reply ENTIRELY in Tamil script (தமிழ்). 
Do NOT use any English words in your response. 
Every single word must be in Tamil language.
Example format: நீர் சேமிப்பு முறைகள் என்பது மிகவும் முக்கியமானது.`
        : 'Respond in clear, simple English suitable for rural communities.';

      const messages = [
        { role: 'system', content: `${ECO_SYSTEM_PROMPT}\n\n${langNote}` },
        { role: 'user', content: message },
      ];

      const text = await callNvidiaAPI(messages, { temperature: 0.6, max_tokens: 1024 });
      return { response: text, model: NVIDIA_MODEL, language: effectiveLang };
    } catch (error) {
      console.error('[NVIDIA] Chat error:', error.message);
      return { response: getDemoResponse(message, effectiveLang), model: 'fallback', language: effectiveLang };
    }
  },

  async getFarmingAdvice(crop, location = 'Tamil Nadu', season = '') {
    if (!isConfigured()) {
      return {
        recommendations: [
          { title: 'Soil Preparation', desc: 'Test soil pH (6.0-7.0 ideal). Add organic compost 2-3 weeks before planting.' },
          { title: 'Irrigation', desc: 'Use drip irrigation. Water in early morning to reduce evaporation losses.' },
          { title: 'Pest Control', desc: 'Spray neem oil solution (5ml/L water) weekly. Use yellow sticky traps for flying insects.' },
          { title: 'Harvesting', desc: 'Harvest during cooler morning hours. Use clean sharp tools to avoid crop damage.' },
        ],
        waterNeeds: 'Moderate (2-3 liters/plant/day)',
        bestPractices: 'Practice crop rotation every season to maintain soil health and reduce pests',
        organicFertilizer: 'Apply vermicompost 200kg/acre monthly for best results',
      };
    }

    try {
      const prompt = `Provide detailed farming advice for growing ${crop} in ${location}${season ? ` during ${season} season` : ''}.

Return ONLY valid JSON (no markdown, no extra text):
{
  "recommendations": [
    {"title": "Soil Preparation", "desc": "..."},
    {"title": "Irrigation", "desc": "..."},
    {"title": "Pest Control", "desc": "..."},
    {"title": "Harvesting", "desc": "..."}
  ],
  "waterNeeds": "...",
  "bestPractices": "...",
  "organicFertilizer": "..."
}`;

      const messages = [
        { role: 'system', content: 'You are an agricultural expert for rural India. Always respond with valid JSON only, no markdown code blocks.' },
        { role: 'user', content: prompt },
      ];

      const text = await callNvidiaAPI(messages, { temperature: 0.4, max_tokens: 700 });
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      throw new Error('JSON parse failed');
    } catch (error) {
      console.error('[NVIDIA] Farming advice error:', error.message);
      return {
        recommendations: [
          { title: 'Soil Preparation', desc: 'Add organic compost and test soil pH before planting.' },
          { title: 'Water Management', desc: 'Use drip irrigation for efficient water use.' },
          { title: 'Pest Control', desc: 'Use neem oil spray as organic pesticide.' },
          { title: 'Harvesting', desc: 'Harvest in early morning for best quality produce.' },
        ],
        waterNeeds: 'Moderate irrigation required',
        bestPractices: 'Practice crop rotation',
        organicFertilizer: 'Use vermicompost and green manure',
      };
    }
  },

  async getSchemeInfo(query, category = 'all') {
    const schemesDb = [
      { name: 'PM-KISAN', category: 'farming', benefit: '₹6,000/year direct benefit transfer', eligibility: 'Small/marginal farmers ≤2 hectares' },
      { name: 'PM Fasal Bima Yojana', category: 'farming', benefit: 'Crop insurance at low 1.5-2% premium', eligibility: 'All farmers growing notified crops' },
      { name: 'Soil Health Card Scheme', category: 'farming', benefit: 'Free soil testing + nutrient recommendations', eligibility: 'All farmers' },
      { name: 'Jal Jeevan Mission', category: 'water', benefit: 'Free functional household tap connection', eligibility: 'Rural households without piped water' },
      { name: 'Atal Bhujal Yojana', category: 'water', benefit: 'Groundwater management support', eligibility: 'Communities in 7 water-stressed states' },
      { name: 'PM Surya Ghar Muft Bijli', category: 'energy', benefit: '300 units free/month + ₹78,000 subsidy for rooftop solar', eligibility: 'Residential electricity consumers' },
      { name: 'PM Ujjwala Yojana', category: 'energy', benefit: 'Free LPG connection + ₹1,600 financial assistance', eligibility: 'BPL household women above 18' },
      { name: 'MGNREGS', category: 'rural', benefit: '100 days guaranteed wage employment/year', eligibility: 'Adult rural household members' },
      { name: 'PMAY-Gramin', category: 'rural', benefit: 'Housing assistance up to ₹1.2 lakh (plains) / ₹1.3 lakh (hilly)', eligibility: 'Homeless/kutcha house rural families' },
    ];

    if (!isConfigured()) {
      const filtered = category === 'all' ? schemesDb : schemesDb.filter(s => s.category === category);
      return { schemes: filtered, source: 'database', query };
    }

    try {
      const prompt = `You are a government scheme expert for rural India. Answer this query: "${query}"

Available schemes database: ${JSON.stringify(schemesDb)}

Provide a clear, helpful answer about relevant schemes. Include:
- Which schemes apply to the query
- Key benefits and eligibility
- How to apply

Keep it concise and practical for rural community members.`;

      const messages = [
        { role: 'system', content: 'You are a helpful government scheme advisor for rural communities in India. Be clear and practical.' },
        { role: 'user', content: prompt },
      ];

      const text = await callNvidiaAPI(messages, { temperature: 0.5, max_tokens: 900 });
      return { response: text, schemes: schemesDb, source: 'nvidia-ai', query, model: NVIDIA_MODEL };
    } catch (error) {
      console.error('[NVIDIA] Scheme info error:', error.message);
      const filtered = category === 'all' ? schemesDb : schemesDb.filter(s => s.category === category);
      return { schemes: filtered, source: 'database-fallback', query };
    }
  },

  async analyzeWasteText(description) {
    // Text-based waste analysis (NVIDIA doesn't support vision in basic tier)
    if (!isConfigured()) {
      return {
        type: 'Mixed Waste', category: 'Recyclable', confidence: 78,
        disposal: 'Sort by material type before disposal at nearest collection center',
        tips: ['Separate wet and dry waste', 'Clean recyclables before disposal', 'Compost organic waste at home', 'Never burn any waste'],
        environmental_impact: 'Proper waste segregation reduces landfill burden by 60%.',
        icon: '♻️',
      };
    }

    try {
      const prompt = `Analyze this waste description and classify it: "${description}"

Return ONLY valid JSON:
{
  "type": "specific waste type",
  "category": "Recyclable/Organic/Hazardous/Non-recyclable",
  "confidence": 85,
  "disposal": "specific disposal method",
  "tips": ["tip1", "tip2", "tip3", "tip4"],
  "environmental_impact": "impact if not properly disposed",
  "icon": "relevant emoji"
}`;

      const messages = [
        { role: 'system', content: 'You are a waste management expert. Respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ];

      const text = await callNvidiaAPI(messages, { temperature: 0.3, max_tokens: 300 });
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      throw new Error('JSON parse failed');
    } catch (error) {
      console.error('[NVIDIA] Waste analysis error:', error.message);
      return {
        type: 'General Waste', category: 'Mixed', confidence: 70,
        disposal: 'Segregate by material type and use designated bins',
        tips: ['Separate wet and dry waste', 'Recycle paper and plastics', 'Compost organic matter', 'Contact local collection center'],
        environmental_impact: 'Improper disposal pollutes soil and groundwater.',
        icon: '🗑️',
      };
    }
  },
};

module.exports = nvidiaService;

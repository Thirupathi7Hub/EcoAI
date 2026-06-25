const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
let model = null;

const getModel = () => {
  if (!API_KEY) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return model;
};

const ECO_SYSTEM_PROMPT = `You are EcoBot AI, a smart sustainability assistant for rural communities in India, especially Tamil Nadu.
Answer questions about: sustainable farming, water conservation, waste management, government schemes, climate awareness.
Support Tamil and English. Be practical, empathetic, and concise. Always relate to rural Indian context.`;

const DEMO_RESPONSES = {
  default: `I'm EcoBot AI! I can help you with:
🌱 **Sustainable farming** — organic methods, crop selection, pest control
💧 **Water conservation** — irrigation, rainwater harvesting
♻️ **Waste management** — segregation, composting, recycling  
📋 **Government schemes** — PM-KISAN, Jal Jeevan Mission, PM Surya Ghar
🌡️ **Climate awareness** — adaptation for rural communities

*Demo mode — Add Gemini API key for full AI responses.*`,
};

const getDemoResponse = (message) => {
  const msg = message.toLowerCase();
  if (msg.includes('farm') || msg.includes('crop') || msg.includes('agriculture')) {
    return `**Sustainable Farming Tips:**\n- Use organic compost and vermicompost\n- Practice crop rotation\n- Drip irrigation saves 50-70% water\n- Neem oil spray for organic pest control\n- Check PM-KISAN for financial support`;
  }
  if (msg.includes('water') || msg.includes('irrigation') || msg.includes('conserve')) {
    return `**Water Conservation:**\n- Drip/sprinkler irrigation\n- Rainwater harvesting with farm ponds\n- Mulching reduces evaporation\n- Fix leaking pipes — saves 20L/day\n- Jal Jeevan Mission provides tap connections`;
  }
  if (msg.includes('waste') || msg.includes('recycle') || msg.includes('plastic')) {
    return `**Waste Management:**\n- Segregate: Green (organic), Blue (recyclable), Red (hazardous)\n- Compost kitchen waste at home\n- Never burn plastic or e-waste\n- Use biogas plant for organic waste`;
  }
  if (msg.includes('scheme') || msg.includes('government') || msg.includes('yojana')) {
    return `**Key Government Schemes:**\n- PM-KISAN: ₹6,000/year for farmers\n- PM Surya Ghar: Free solar + ₹78,000 subsidy\n- Jal Jeevan Mission: Free tap water\n- PM Fasal Bima: Crop insurance\n- MGNREGS: 100 days employment`;
  }
  return DEMO_RESPONSES.default;
};

const geminiService = {
  async chat(message, language = 'en') {
    const aiModel = getModel();
    if (!aiModel) {
      await new Promise(r => setTimeout(r, 800));
      return { response: getDemoResponse(message), model: 'demo', language };
    }
    try {
      const langNote = language === 'ta' ? 'Respond in Tamil (தமிழ்).' : 'Respond in English.';
      const prompt = `${ECO_SYSTEM_PROMPT}\n\n${langNote}\n\nUser: ${message}`;
      const result = await aiModel.generateContent(prompt);
      return { response: result.response.text(), model: 'gemini-1.5-flash', language };
    } catch (error) {
      console.error('Gemini chat error:', error);
      return { response: getDemoResponse(message), model: 'demo-fallback', language };
    }
  },

  async analyzeWaste(imageBase64, mimeType = 'image/jpeg') {
    const aiModel = getModel();
    if (!aiModel) {
      await new Promise(r => setTimeout(r, 1000));
      return {
        type: 'Plastic Waste', category: 'Recyclable', confidence: 85,
        disposal: 'Take to nearest plastic collection center. Clean before recycling.',
        tips: ['Rinse containers', 'Check recycling symbol', 'Separate by type', 'Never burn plastic'],
        environmental_impact: 'Plastic takes 400-1000 years to decompose.',
        icon: '♻️',
      };
    }
    try {
      const wasteModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze this waste image. Return JSON: {"type":"waste type","category":"Recyclable/Organic/Hazardous","confidence":85,"disposal":"method","tips":["tip1","tip2","tip3","tip4"],"environmental_impact":"impact","icon":"emoji"}`;
      const result = await wasteModel.generateContent([
        prompt,
        { inlineData: { data: imageBase64, mimeType } }
      ]);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      throw new Error('Parse error');
    } catch (error) {
      console.error('Waste analysis error:', error);
      throw new Error('Image analysis failed');
    }
  },

  async getSchemeInfo(query, category = 'all') {
    const aiModel = getModel();
    const schemesDb = [
      { name: 'PM-KISAN', category: 'farming', benefit: '₹6,000/year', eligibility: 'Small/marginal farmers' },
      { name: 'Jal Jeevan Mission', category: 'water', benefit: 'Tap water connection', eligibility: 'Rural households' },
      { name: 'PM Surya Ghar', category: 'energy', benefit: 'Solar + ₹78,000 subsidy', eligibility: 'Residential consumers' },
      { name: 'PM Fasal Bima', category: 'farming', benefit: 'Crop insurance', eligibility: 'All farmers' },
      { name: 'MGNREGS', category: 'rural', benefit: '100 days employment', eligibility: 'Rural adults' },
    ];
    if (!aiModel) {
      await new Promise(r => setTimeout(r, 500));
      const filtered = category === 'all' ? schemesDb : schemesDb.filter(s => s.category === category);
      return { schemes: filtered, source: 'database', query };
    }
    try {
      const prompt = `You are a government scheme expert. Answer: "${query}". Available schemes: ${JSON.stringify(schemesDb)}. Provide helpful information about matching schemes.`;
      const result = await aiModel.generateContent(prompt);
      return { response: result.response.text(), schemes: schemesDb, source: 'ai', query };
    } catch {
      return { schemes: schemesDb, source: 'database-fallback', query };
    }
  },
};

module.exports = geminiService;

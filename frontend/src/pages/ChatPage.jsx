import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Trash2, Globe, Loader2, Leaf, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { sendChatMessage } from '../services/aiService';
import { saveChatMessage, getChatHistory } from '../services/dbService';
import { useVoice } from '../hooks/useVoice';
import toast from 'react-hot-toast';

const formatAIText = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00d084">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
};

const WELCOME_EN = `🌍 **Vanakkam! I'm EcoBot AI**\n\nPowered by **NVIDIA NIM Llama 3.1 8B** — Ask me anything about:\n\n🌱 **Farming** — organic methods, crop selection, pest control\n💧 **Water** — conservation, irrigation, rainwater harvesting\n♻️ **Waste** — segregation, composting, recycling\n📋 **Schemes** — PM-KISAN, Jal Jeevan Mission, PM Surya Ghar\n🌡️ **Climate** — adaptation strategies, environmental awareness\n\nநான் தமிழிலும் பேசுகிறேன்! (I speak Tamil too!)`;

const WELCOME_TA = `🌍 **வணக்கம்! நான் EcoBot AI**\n\n**NVIDIA NIM Llama 3.1 8B** ஆல் இயக்கப்படுகிறேன் — என்னிடம் கேளுங்கள்:\n\n🌱 **விவசாயம்** — கரிம முறைகள், பயிர் தேர்வு, பூச்சி கட்டுப்பாடு\n💧 **நீர்** — பாதுகாப்பு, நீர்ப்பாசனம், மழைநீர் சேகரிப்பு\n♻️ **கழிவு** — பிரித்தல், உரமாக்கல், மறுசுழற்சி\n📋 **திட்டங்கள்** — PM-KISAN, ஜல் ஜீவன் மிஷன், PM சூர்ய கர்\n🌡️ **காலநிலை** — தழுவல் உத்திகள், சுற்றுச்சூழல் விழிப்புணர்வு`;

const SUGGESTIONS_EN = [
  '🌱 How to start organic farming?',
  '💧 Water conservation techniques',
  '♻️ How to manage plastic waste?',
  '📋 Tell me about PM-KISAN scheme',
  '🌡️ Climate change effects on crops',
  '🔆 PM Surya Ghar solar scheme',
];

const SUGGESTIONS_TA = [
  '🌱 கரிம விவசாயம் எப்படி தொடங்குவது?',
  '💧 நீர் சேமிப்பு முறைகள்',
  '♻️ பிளாஸ்டிக் கழிவை எப்படி நிர்வகிப்பது?',
  '📋 PM-KISAN திட்டம் பற்றி சொல்லுங்கள்',
  '🌡️ காலநிலை மாற்றம் பயிர்களை எப்படி பாதிக்கிறது?',
  '🔆 PM சூர்ய கர் சூரிய ஆற்றல் திட்டம்',
];

const ChatPage = () => {
  // ── Hooks first (React rules) ─────────────────────────────────────
  const { user, userProfile } = useAuth();
  const { t, lang } = useLanguage();   // ← must be BEFORE any useState that uses lang
  const { startListening, stopListening, speak, stopSpeaking } = useVoice();

  const isTamil = lang === 'ta';

  // ── State ─────────────────────────────────────────────────────────
  const [messages, setMessages] = useState(() => [{
    id: 'welcome',
    role: 'assistant',
    content: isTamil ? WELCOME_TA : WELCOME_EN,
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(isTamil ? 'ta' : 'en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = isTamil ? SUGGESTIONS_TA : SUGGESTIONS_EN;

  // ── Effects ───────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) {
      getChatHistory(user.uid).then(history => {
        if (history.length > 0) {
          const mapped = history.map(h => ({
            id: h.id,
            role: h.role,
            content: h.message,
            timestamp: h.timestamp?.toDate?.() || new Date(),
          }));
          setMessages(prev => [prev[0], ...mapped.slice(-20)]);
        }
      }).catch(() => {}); // ignore history errors silently
    }
  }, [user]);

  // ── Handlers ──────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    if (user) saveChatMessage(user.uid, text.trim(), 'user').catch(() => {});

    try {
      const response = await sendChatMessage(text.trim(), messages, language);
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      if (user) saveChatMessage(user.uid, response, 'assistant').catch(() => {});
      if (autoSpeak) {
        setIsSpeaking(true);
        const plainText = response.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\n/g, ' ');
        speak(plainText, language, () => setIsSpeaking(false));
      }
    } catch (error) {
      toast.error(isTamil ? 'பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Failed to get AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      startListening(
        (transcript) => {
          setInput(transcript);
          setIsListening(false);
          setTimeout(() => sendMessage(transcript), 300);
        },
        (error) => {
          setIsListening(false);
          toast.error('Voice recognition error: ' + error);
        },
        language
      );
    }
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const plain = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\n/g, ' ');
      speak(plain, language, () => setIsSpeaking(false));
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: isTamil ? WELCOME_TA : WELCOME_EN,
      timestamp: new Date(),
    }]);
    toast.success(isTamil ? 'அரட்டை அழிக்கப்பட்டது' : 'Chat cleared');
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 0 16px',
        borderBottom: '1px solid rgba(26,45,74,0.8)',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00d084, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0,208,132,0.4)',
          }}>
            <Leaf size={22} color="#0a0f1e" />
          </div>
          <div>
            <h1 style={{ color: '#f0fdf4', fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>
              {isTamil ? 'EcoBot AI அரட்டை' : 'EcoBot AI Chat'}
            </h1>
            <p style={{ color: '#00d084', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ● {isTamil ? 'தமிழ் முறை' : 'English Mode'}
              <span style={{ background: 'rgba(118,185,0,0.12)', border: '1px solid rgba(118,185,0,0.35)', color: '#76b900', borderRadius: '99px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>
                NVIDIA NIM
              </span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Language toggle */}
          <button
            id="lang-toggle-btn"
            onClick={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(26,45,74,0.6)', border: '1px solid rgba(0,208,132,0.3)',
              borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#00d084', fontSize: '13px', fontWeight: 600,
            }}
          >
            <Globe size={14} />
            {language === 'en' ? '🇮🇳 தமிழ்' : '🌐 English'}
          </button>

          {/* Auto speak */}
          <button
            id="auto-speak-btn"
            onClick={() => setAutoSpeak(s => !s)}
            title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: autoSpeak ? 'rgba(0,208,132,0.15)' : 'rgba(26,45,74,0.6)',
              border: `1px solid ${autoSpeak ? 'rgba(0,208,132,0.5)' : 'rgba(26,45,74,0.8)'}`,
              borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
              color: autoSpeak ? '#00d084' : '#64748b', fontSize: '13px',
            }}
          >
            {autoSpeak ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {isTamil ? (autoSpeak ? 'குரல் இயக்கம்' : 'குரல் நிறுத்தம்') : (autoSpeak ? 'Voice ON' : 'Voice OFF')}
          </button>

          {/* Clear chat */}
          <button
            id="clear-chat-btn"
            onClick={clearChat}
            title={isTamil ? 'அழி' : 'Clear chat'}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#ef4444' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', maxWidth: '85%' }}>
                {/* Avatar */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #00d084, #10b981)' : 'rgba(13,22,40,0.9)',
                  border: msg.role !== 'user' ? '1px solid rgba(0,208,132,0.3)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'user'
                    ? <span style={{ fontSize: '12px', fontWeight: 700, color: '#0a0f1e' }}>{(userProfile?.displayName || 'U')[0]}</span>
                    : <Leaf size={14} color="#00d084" />
                  }
                </div>
                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ padding: '12px 16px', fontSize: '14px', lineHeight: '1.7', position: 'relative' }}>
                  <div dangerouslySetInnerHTML={{ __html: formatAIText(msg.content) }} />
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                      title={isTamil ? 'சத்தமாக படிக்கவும்' : 'Read aloud'}
                    >
                      {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>
              </div>
              <p style={{ color: '#334155', fontSize: '11px', marginTop: '4px', marginLeft: msg.role !== 'user' ? '42px' : '0', marginRight: msg.role === 'user' ? '42px' : '0' }}>
                {msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(13,22,40,0.9)', border: '1px solid rgba(0,208,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={14} color="#00d084" />
            </div>
            <div className="chat-bubble-ai" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d084' }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: '8px 0 12px', display: 'flex', gap: '8px', overflowX: 'auto', flexWrap: 'wrap' }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => sendMessage(s.replace(/^[^\s]+ /, ''))}
              style={{ padding: '6px 12px', borderRadius: '99px', border: '1px solid rgba(0,208,132,0.25)', background: 'rgba(0,208,132,0.05)', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.color = '#00d084'; e.target.style.borderColor = 'rgba(0,208,132,0.5)'; }}
              onMouseLeave={e => { e.target.style.color = '#94a3b8'; e.target.style.borderColor = 'rgba(0,208,132,0.25)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: '12px 0 20px', borderTop: '1px solid rgba(26,45,74,0.8)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder={isTamil ? 'விவசாயம், நீர், கழிவு பற்றி கேளுங்கள்...' : 'Ask about sustainability, farming, water, waste...'}
              rows={1}
              style={{
                width: '100%', resize: 'none', background: 'rgba(13,22,40,0.8)',
                border: '1px solid rgba(26,45,74,0.8)', color: '#f0fdf4',
                borderRadius: '14px', padding: '14px 50px 14px 16px',
                fontSize: '14px', fontFamily: 'Inter, sans-serif',
                outline: 'none', transition: 'border-color 0.3s',
                lineHeight: '1.5',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,208,132,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(26,45,74,0.8)'}
            />
            <div style={{ position: 'absolute', right: '12px', bottom: '12px' }}>
              <Sparkles size={18} color="#334155" />
            </div>
          </div>

          {/* Voice button */}
          <motion.button
            id="voice-input-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceInput}
            style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: isListening ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(26,45,74,0.6)',
              border: `1px solid ${isListening ? 'rgba(239,68,68,0.5)' : 'rgba(26,45,74,0.8)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: isListening ? '#fff' : '#64748b',
              boxShadow: isListening ? '0 0 15px rgba(239,68,68,0.4)' : 'none',
            }}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </motion.button>

          {/* Send button */}
          <motion.button
            id="send-msg-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: input.trim() && !loading ? 'linear-gradient(135deg, #00d084, #10b981)' : 'rgba(26,45,74,0.3)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            {loading ? <Loader2 size={20} color="#64748b" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} color={input.trim() ? '#0a0f1e' : '#334155'} />}
          </motion.button>
        </div>
        <p style={{ color: '#334155', fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
          {isTamil ? 'அனுப்ப Enter • புதிய வரிக்கு Shift+Enter' : 'Press Enter to send • Shift+Enter for new line'} • Powered by <span style={{ color: '#76b900', fontWeight: 600 }}>NVIDIA NIM</span>
        </p>
      </div>
    </div>
  );
};

export default ChatPage;

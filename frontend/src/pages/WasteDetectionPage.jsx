import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Trash2, RefreshCw, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const WasteDetectionPage = () => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const isTa = lang === 'ta';

  const [imageUrl, setImageUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [poweredBy, setPoweredBy] = useState('');
  const [reports, setReports] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error(isTa ? 'சரியான பட கோப்பை பதிவேற்றவும்' : 'Please upload a valid image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(isTa ? 'படம் 10MB க்கும் குறைவாக இருக்க வேண்டும்' : 'Image must be under 10MB');
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResult(null);
    setImageMime(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }, [isTa]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      toast.error(isTa ? 'முதலில் படத்தைப் பதிவேற்றவும்' : 'Please upload an image first');
      return;
    }
    setAnalyzing(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(`${API_BASE}/api/waste/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          imageBase64,
          mimeType: imageMime,
          description: description.trim() || '',
        }),
      });
      clearTimeout(timer);

      const data = await res.json();

      if (data.analysis) {
        setResult(data.analysis);
        setPoweredBy(data.powered_by || '');
        setReports(prev => [{ ...data.analysis, analyzedAt: new Date() }, ...prev]);
        toast.success(isTa ? 'கழிவு பகுப்பாய்வு முடிந்தது!' : 'Waste analysis complete!');
      } else {
        throw new Error(data.error || 'No analysis returned');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        toast.error(isTa ? 'நேரம் முடிந்தது. மீண்டும் முயற்சிக்கவும்.' : 'Analysis timed out. Please try again.');
      } else {
        toast.error(isTa ? 'பகுப்பாய்வு தோல்வி. மீண்டும் முயற்சிக்கவும்.' : 'Analysis failed. Please try again.');
      }
      console.error('[Waste] Error:', err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAll = () => {
    setImageUrl(null);
    setImageBase64(null);
    setResult(null);
    setDescription('');
    setPoweredBy('');
  };

  const confColor = (c) => c >= 80 ? 'var(--primary)' : c >= 60 ? '#f59e0b' : '#ef4444';

  const catColor = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('recycl')) return { bg: 'rgba(34,197,94,0.12)', color: 'var(--primary)' };
    if (c.includes('organic') || c.includes('compost')) return { bg: 'rgba(16,185,129,0.12)', color: '#10b981' };
    if (c.includes('hazard')) return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' };
    if (c.includes('reusable')) return { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' };
    return { bg: 'rgba(100,116,139,0.12)', color: '#64748b' };
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
        <span className="badge badge-orange" style={{ marginBottom: '8px' }}>{t('farming_badge')}</span>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-1)', marginBottom: '6px' }}>
          {t('waste_title')}
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>{t('waste_subtitle')}</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left — Upload */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !imageUrl && fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--primary)' : imageUrl ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
              borderRadius: '14px',
              background: dragOver ? 'rgba(34,197,94,0.04)' : 'var(--bg-2)',
              minHeight: '240px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: imageUrl ? 'default' : 'pointer',
              overflow: 'hidden', position: 'relative', transition: 'all 0.2s',
            }}
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Waste" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                  <button onClick={e => { e.stopPropagation(); resetAll(); }}
                    className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', fontSize: '11px' }}>
                    <Trash2 size={12} /> {isTa ? 'அகற்று' : 'Remove'}
                  </button>
                  <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                    className="btn btn-sm btn-primary" style={{ border: 'none', fontSize: '11px' }}>
                    <RefreshCw size={12} /> {isTa ? 'மாற்று' : 'Change'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Upload size={36} color="#f59e0b" style={{ marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{t('waste_upload')}</p>
                <p style={{ color: 'var(--text-3)', fontSize: '12px' }}>{t('waste_supported')}</p>
              </div>
            )}
          </motion.div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />

          {/* Optional description */}
          {imageUrl && (
            <input
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder={isTa ? 'விருப்பம்: இது என்ன கழிவு என்று விவரிக்கவும்...' : 'Optional: describe the waste (e.g. "plastic bottle")'}
              className="form-input"
              style={{ marginTop: '10px', fontSize: '13px' }}
            />
          )}

          {/* Analyze button */}
          <button onClick={handleAnalyze} disabled={!imageUrl || analyzing}
            className="btn btn-primary" style={{ width: '100%', marginTop: '10px', justifyContent: 'center', padding: '11px' }}>
            {analyzing
              ? <><Loader2 size={15} className="animate-spin" /> {t('waste_analyzing')}</>
              : <><Camera size={15} /> {t('waste_analyze')}</>}
          </button>
        </div>

        {/* Right — Results */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !analyzing && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card" style={{ textAlign: 'center', padding: '40px 20px', minHeight: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={36} color="var(--border-2)" style={{ marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-2)', fontWeight: 600, fontSize: '14px' }}>
                  {isTa ? 'முடிவுகளைக் காண படத்தைப் பதிவேற்றவும்' : 'Upload an image to see results'}
                </p>
              </motion.div>
            )}

            {analyzing && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card" style={{ textAlign: 'center', padding: '40px 20px', minHeight: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '44px', height: '44px', borderRadius: '11px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Camera size={22} color="#0a0f1a" />
                </motion.div>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}>{t('waste_analyzing')}</p>
                <p style={{ color: 'var(--text-3)', fontSize: '12px', marginTop: '4px' }}>
                  {isTa ? 'AI படத்தை பகுப்பாய்வு செய்கிறது...' : 'AI is analyzing your image...'}
                </p>
              </motion.div>
            )}

            {result && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="card" style={{ marginBottom: '12px' }}>
                  {/* Type + confidence */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '36px' }}>{result.icon || '♻️'}</span>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '17px', fontFamily: 'Outfit, sans-serif' }}>{result.type}</h2>
                      <span className="badge" style={{ marginTop: '4px', ...catColor(result.category) }}>{result.category}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'var(--text-3)', fontSize: '10px' }}>{t('waste_confidence')}</p>
                      <p style={{ color: confColor(result.confidence), fontWeight: 800, fontSize: '20px' }}>{result.confidence}%</p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border)', marginBottom: '14px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 0.7 }}
                      style={{ height: '100%', borderRadius: '3px', background: confColor(result.confidence) }} />
                  </div>

                  {/* Disposal */}
                  <div style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', borderRadius: '10px', padding: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <CheckCircle size={13} color="var(--primary)" />
                      <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}>{t('waste_disposal')}</p>
                    </div>
                    <p style={{ color: 'var(--text-2)', fontSize: '12px', lineHeight: '1.5' }}>{result.disposal}</p>
                  </div>

                  {/* Tips */}
                  {result.tips?.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '12px', marginBottom: '6px' }}>💡 {t('waste_tips')}</p>
                      {result.tips.map((tip, i) => (
                        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '11px', minWidth: '14px' }}>{i + 1}.</span>
                          <span style={{ color: 'var(--text-2)', fontSize: '12px', lineHeight: '1.5' }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Environmental impact */}
                  {result.environmental_impact && (
                    <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '10px', padding: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <AlertTriangle size={13} color="#ef4444" />
                        <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '12px' }}>{t('waste_impact')}</p>
                      </div>
                      <p style={{ color: 'var(--text-2)', fontSize: '12px', lineHeight: '1.5' }}>{result.environmental_impact}</p>
                    </div>
                  )}

                  {/* Powered by label */}
                  {poweredBy && (
                    <p style={{ color: 'var(--text-3)', fontSize: '10px', marginTop: '10px', textAlign: 'center' }}>
                      {poweredBy}
                    </p>
                  )}
                </div>

                <button onClick={resetAll} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <RefreshCw size={13} /> {t('waste_scan_another')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent reports */}
          {reports.length > 1 && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ color: 'var(--text-3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                {isTa ? `சமீபத்திய ஸ்கேன்கள் (${reports.length})` : `Recent Scans (${reports.length})`}
              </p>
              {reports.slice(1, 4).map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{r.icon || '♻️'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: '12px' }}>{r.type}</p>
                    <p style={{ color: 'var(--text-3)', fontSize: '10px' }}>{r.category} • {r.confidence}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteDetectionPage;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent successfully! We\'ll respond within 24 hours.');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '64px' }}>
        <span style={{ color: '#00d084', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Get in Touch</span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#f0fdf4', marginTop: '12px', marginBottom: '16px' }}>Contact Us</h1>
        <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
          Have questions, feedback, or want to partner with us? We'd love to hear from you.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '48px' }}>
        {/* Contact info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ color: '#f0fdf4', fontWeight: 700, fontSize: '22px', fontFamily: 'Outfit, sans-serif', marginBottom: '28px' }}>Let's Connect</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
            {[
              { icon: Mail, label: 'Email Us', value: 'hello@ecobot.ai', color: '#00d084' },
              { icon: Phone, label: 'Call Us', value: '+91 98765 43210', color: '#0ea5e9' },
              { icon: MapPin, label: 'Office', value: 'Chennai, Tamil Nadu, India', color: '#f59e0b' },
              { icon: Clock, label: 'Support Hours', value: 'Mon–Sat, 9 AM – 6 PM IST', color: '#8b5cf6' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <p style={{ color: '#f0fdf4', fontSize: '15px', fontWeight: 500, marginTop: '4px' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="eco-card">
            <h3 style={{ color: '#f0fdf4', fontWeight: 700, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={18} color="#00d084" /> Common Questions
            </h3>
            {[
              { q: 'Is EcoBot AI free to use?', a: 'Yes! Basic features are free. Premium features coming soon.' },
              { q: 'Does it work in villages with slow internet?', a: 'We are optimizing for low-bandwidth environments.' },
              { q: 'Can NGOs partner with EcoBot AI?', a: 'Absolutely! Contact us for NGO partnership programs.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(26,45,74,0.6)' }}>
                <p style={{ color: '#00d084', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{q}</p>
                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.5' }}>{a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {submitted ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="eco-card"
              style={{ textAlign: 'center', padding: '60px 40px' }}>
              <CheckCircle size={56} color="#00d084" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ color: '#f0fdf4', fontWeight: 700, fontSize: '24px', marginBottom: '12px' }}>Message Sent!</h2>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7' }}>
                Thank you for reaching out. Our team will respond within 24 business hours.
              </p>
              <button onClick={() => setSubmitted(false)} id="send-another-btn" className="btn-secondary" style={{ marginTop: '24px' }}>
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <div className="eco-card">
              <h2 style={{ color: '#f0fdf4', fontWeight: 700, fontSize: '20px', fontFamily: 'Outfit, sans-serif', marginBottom: '24px' }}>Send a Message</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Name *</label>
                    <input id="contact-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="eco-input" />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Email *</label>
                    <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="eco-input" />
                  </div>
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Inquiry Type</label>
                  <select id="contact-type" name="type" value={form.type} onChange={handleChange} className="eco-input" style={{ appearance: 'none' }}>
                    <option value="general" style={{ background: '#0d1628' }}>General Inquiry</option>
                    <option value="partnership" style={{ background: '#0d1628' }}>Partnership</option>
                    <option value="technical" style={{ background: '#0d1628' }}>Technical Support</option>
                    <option value="feedback" style={{ background: '#0d1628' }}>Feedback</option>
                    <option value="ngo" style={{ background: '#0d1628' }}>NGO/Government</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Subject</label>
                  <input id="contact-subject" type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Brief subject" className="eco-input" />
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Message *</label>
                  <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us more about your inquiry..." rows={5} className="eco-input" style={{ resize: 'vertical', lineHeight: '1.6' }} />
                </div>
                <motion.button id="contact-submit-btn" type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary"
                  disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                  {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : <><Send size={18} /> Send Message</>}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;

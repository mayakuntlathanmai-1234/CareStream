import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RefreshCw, Heart, Thermometer, Pill, Stethoscope } from 'lucide-react';
import './PatientDashboard.css';

const suggestions = [
  { icon: '🤒', text: 'I have a headache and fever' },
  { icon: '💊', text: 'When should I take my Metformin?' },
  { icon: '❤️', text: 'My blood pressure is 140/90' },
  { icon: '😴', text: 'I have trouble sleeping' },
  { icon: '🤢', text: 'I feel nauseous after meals' },
  { icon: '🏃', text: 'Can I exercise with my condition?' },
];

const botResponses = [
  { keywords: ['headache', 'fever', 'temperature'], text: "I'm sorry to hear you're feeling unwell. A headache with fever can be caused by various conditions. <br/><br/>📋 <b>Recommendations:</b><br/>• Stay hydrated — drink 8-10 glasses of water<br/>• Rest in a cool, quiet room<br/>• Take paracetamol 500mg if needed<br/>• Monitor temperature every 4 hours<br/><br/>⚠️ <b>Seek emergency care if:</b> fever exceeds 103°F (39.4°C) or if you have a stiff neck or severe pain.<br/><span class='emergency-badge em-med'>🟡 Moderate Concern — Monitor Closely</span>" },
  { keywords: ['metformin', 'medication', 'medicine', 'pill'], text: "Regarding your Metformin:<br/><br/>💊 <b>Best practice:</b> Take Metformin with or after meals to reduce stomach upset. Never take on an empty stomach.<br/><br/>⏰ <b>Timing:</b><br/>• Morning dose: After breakfast<br/>• Evening dose: After dinner<br/>• Never skip or double up doses<br/><br/>If you experience nausea, vomiting or stomach pain, contact your doctor.<br/><span class='emergency-badge em-low'>🟢 Routine Guidance</span>" },
  { keywords: ['blood pressure', '140', '130', '150', 'bp', 'hypertension'], text: "A reading of 140/90 mmHg is classified as <b>Stage 2 Hypertension</b>. This needs attention.<br/><br/>🫀 <b>Immediate steps:</b><br/>• Sit quietly for 5 minutes and re-measure<br/>• Reduce sodium intake today<br/>• Avoid caffeine and stress<br/>• Take your prescribed BP medication<br/><br/>📅 <b>Book a follow-up</b> with your cardiologist within 48 hours.<br/><span class='emergency-badge em-med'>🟡 Needs Medical Attention</span>" },
  { keywords: ['sleep', 'insomnia', 'tired', 'fatigue'], text: "Sleep issues can significantly impact your health. Let me help.<br/><br/>🌙 <b>Sleep hygiene tips:</b><br/>• Maintain a consistent sleep schedule<br/>• Avoid screens 1 hour before bed<br/>• Keep bedroom cool (65-68°F / 18-20°C)<br/>• Avoid caffeine after 2 PM<br/>• Try 4-7-8 breathing technique<br/><br/>If sleep problems persist for &gt;3 weeks, consult your doctor for further evaluation.<br/><span class='emergency-badge em-low'>🟢 Lifestyle Adjustment Recommended</span>" },
  { keywords: ['nausea', 'vomit', 'stomach', 'meal'], text: "Post-meal nausea can have several causes. Here are some steps:<br/><br/>🍽️ <b>Dietary advice:</b><br/>• Eat smaller, more frequent meals<br/>• Avoid fatty, spicy, or acidic foods<br/>• Sit upright for 30 min after eating<br/>• Sip ginger tea or peppermint tea<br/>• Stay hydrated<br/><br/>Check if any of your current medications cause nausea as a side effect.<br/><span class='emergency-badge em-low'>🟢 Manageable at Home</span>" },
  { keywords: ['exercise', 'workout', 'gym', 'walk', 'run'], text: "Great question! Exercise is generally beneficial even with most health conditions.<br/><br/>🏃 <b>General guidelines:</b><br/>• 30 minutes of moderate activity, 5 days/week<br/>• Start slow if you're new to exercise<br/>• Walking is excellent for most conditions<br/>• Avoid vigorous exercise if BP is uncontrolled<br/><br/>⚠️ Stop exercising and seek care if you experience chest pain, dizziness, or shortness of breath.<br/><span class='emergency-badge em-low'>🟢 Exercise Encouraged</span>" },
];

const getResponse = (input) => {
  const lower = input.toLowerCase();
  const match = botResponses.find(r => r.keywords.some(k => lower.includes(k)));
  return match?.text || "Thank you for sharing that with me. Based on your symptoms, I recommend consulting with your doctor for a proper diagnosis. <br/><br/>In the meantime:<br/>• Stay hydrated and rest<br/>• Monitor your symptoms<br/>• Avoid self-medicating<br/><br/>Would you like me to help you book an appointment?<br/><span class='emergency-badge em-low'>🟢 Consult Your Doctor</span>";
};

export default function AiChat() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! 👋 I'm <b>CareStream AI</b>, your personal health assistant.<br/><br/>I can help you:<br/>• Understand symptoms<br/>• Remind you about medications<br/>• Provide health guidance<br/>• Help you decide if you need urgent care<br/><br/>How are you feeling today? Describe your symptoms or choose a quick option below.",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text = input) => {
    if (!text.trim()) return;
    const userMsg = { sender: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: getResponse(text), time: new Date() }]);
    }, 1400 + Math.random() * 800);
  };

  const clearChat = () => {
    setMessages([{
      sender: 'bot',
      text: "Chat cleared! How can I help you today?",
      time: new Date()
    }]);
  };

  const fmtTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="patient-dashboard max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="welcome-banner mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">🤖</div>
          <div className="welcome-text">
            <h2>CareStream AI</h2>
            <p>Your personal health assistant — available 24/7</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/15 rounded-xl text-theme-main dark:text-white text-xs font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> AI Online
          </div>
          <button onClick={clearChat} className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-xl text-theme-main dark:text-white text-xs font-medium transition-all">
            <RefreshCw size={13} /> Clear
          </button>
        </div>
      </motion.div>

      {/* Quick suggestions */}
      <div className="flex gap-2 flex-wrap mb-4 flex-shrink-0">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => sendMessage(s.text)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--teal-300)] hover:bg-[var(--teal-50)] rounded-full text-xs text-[var(--text-secondary)] font-medium transition-all">
            <span>{s.icon}</span>{s.text}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="pd-card flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-[var(--teal-50)] text-[var(--teal-600)] flex items-center justify-center flex-shrink-0 mt-1 text-base">🤖</div>
              )}
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[var(--teal-500)] text-white rounded-br-sm'
                    : 'bg-[var(--teal-50)] text-[var(--text-primary)] rounded-bl-sm border border-[var(--teal-100)]'
                }`} dangerouslySetInnerHTML={{ __html: msg.text }} />
                <span className="text-[10px] text-[var(--text-muted)] px-1">{fmtTime(msg.time)}</span>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[var(--teal-500)] text-white flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold">U</div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--teal-50)] text-[var(--teal-600)] flex items-center justify-center text-base">🤖</div>
              <div className="px-4 py-3 bg-[var(--teal-50)] border border-[var(--teal-100)] rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.div key={i} className="w-2 h-2 bg-[var(--teal-400)] rounded-full"
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, delay: d, repeat: Infinity }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[var(--border)] p-4 flex gap-3 flex-shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Describe your symptoms or ask a health question..."
            className="flex-1 px-4 py-3 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-[var(--teal-400)] transition-all"
          />
          <button onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-[var(--teal-500)] hover:bg-[var(--teal-600)] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-[var(--text-muted)] mt-3 flex-shrink-0">
        ⚠️ CareStream AI is for informational purposes only. Always consult a qualified doctor for medical advice.
      </p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Activity, Droplet, Weight, Moon, Clock, Search, Send } from 'lucide-react';
import './PatientDashboard.css';



export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDoctors, setShowDoctors] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! 👋 I'm your personal health assistant. I can help you check symptoms, remind you about medications, or answer health questions. How are you feeling today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Medications state
  const [meds, setMeds] = useState([
    { id: 1, name: 'Metformin', dose: '500mg · After breakfast', taken: true, color: '#0a9973' },
    { id: 2, name: 'Atorvastatin', dose: '10mg · After dinner', taken: true, color: '#185fa5' },
    { id: 3, name: 'Amlodipine', dose: '5mg · Morning', taken: true, color: '#d4920e' },
    { id: 4, name: 'Vitamin D3', dose: '1000 IU · With lunch', taken: false, color: '#e05a4a' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [apptRes, docRes] = await Promise.all([
          api.get('/appointments/my'),
          api.get('/doctors').catch(() => ({ data: [] }))
        ]);
        setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
        setDoctors(Array.isArray(docRes.data) ? docRes.data : []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const toggleMed = (id) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Based on your symptoms, I recommend resting and staying hydrated. If symptoms persist for more than 3 days, please book a follow-up consultation. <br/><span class='emergency-badge em-low'>🟢 Low Priority</span>"
      }]);
    }, 1500);
  };

  const bpData = [
    { day: 'Mon', sys: 124, dia: 82 },
    { day: 'Tue', sys: 121, dia: 79 },
    { day: 'Wed', sys: 128, dia: 84 },
    { day: 'Thu', sys: 119, dia: 76 },
    { day: 'Fri', sys: 122, dia: 80 },
    { day: 'Sat', sys: 116, dia: 74 },
    { day: 'Today', sys: 118, dia: 76 },
  ];

  const adherenceData = [
    { name: 'Taken', value: 86 },
    { name: 'Missed', value: 14 }
  ];

  const upcomingAppts = appointments.filter(a => a.status !== 'CANCELLED').slice(0, 3);
  const nextAppt = upcomingAppts.length > 0 ? upcomingAppts[0] : null;

  return (
    <div className="patient-dashboard max-w-6xl mx-auto">

      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="welcome-banner">
        <div className="welcome-text">
          <h2>Your health is your greatest wealth.</h2>
          {nextAppt ? (
            <p>Next appointment: Dr. {nextAppt.doctorName || nextAppt.doctorId} · {nextAppt.appointmentDate ? new Date(nextAppt.appointmentDate).toLocaleString() : 'Pending'}</p>
          ) : (
            <p>No upcoming appointments. Book one today!</p>
          )}
          <button
            onClick={() => setShowDoctors(!showDoctors)}
            className="mt-4 px-4 py-2 bg-black/[0.05] dark:bg-white/[0.07] hover:bg-black/[0.1] dark:bg-white/[0.11] backdrop-blur-md rounded-xl text-sm font-semibold text-theme-main transition-all flex items-center gap-2 border border-black/[0.1] dark:border-white/[0.14]"
          >
            <Search size={14} /> Find a Doctor
          </button>
        </div>
        <div className="welcome-stats">
          <div className="w-stat">
            <div className="w-stat-n">86%</div>
            <div className="w-stat-l">Med Adherence</div>
          </div>
          <div className="w-stat">
            <div className="w-stat-n">{upcomingAppts.length}</div>
            <div className="w-stat-l">Upcoming</div>
          </div>
          <div className="w-stat">
            <div className="w-stat-n">12</div>
            <div className="w-stat-l">Days streak</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-head">
            <div className="stat-icon si-teal"><Activity size={20} /></div>
            <span className="trend up">↑ Normal</span>
          </div>
          <div className="stat-val">118/76</div>
          <div className="stat-lbl">Blood Pressure (mmHg)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-head">
            <div className="stat-icon si-amber"><Droplet size={20} /></div>
            <span className="trend down">↑ High</span>
          </div>
          <div className="stat-val">142</div>
          <div className="stat-lbl">Blood Sugar (mg/dL)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-head">
            <div className="stat-icon si-lavender"><Weight size={20} /></div>
            <span className="trend up">↓ -1.2kg</span>
          </div>
          <div className="stat-val">74.8</div>
          <div className="stat-lbl">Weight (kg)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-head">
            <div className="stat-icon si-coral"><Moon size={20} /></div>
            <span className="trend up">On track</span>
          </div>
          <div className="stat-val">7h 24m</div>
          <div className="stat-lbl">Avg Sleep</div>
        </div>
      </motion.div>

      {/* Doctors List */}
      {showDoctors && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card mb-7">
          <div className="card-header">
            <div>
              <div className="card-title">Available Specialists</div>
              <div className="card-subtitle">{doctors.length} doctors found</div>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={doctorSearch}
                onChange={e => setDoctorSearch(e.target.value)}
                placeholder="Search name or specialty..."
                className="pl-9 pr-4 py-2 bg-black/[0.05] dark:bg-white/[0.07] border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--cyan)] text-[var(--text-primary)] w-64 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors
                .filter(d => !doctorSearch || d.name?.toLowerCase().includes(doctorSearch.toLowerCase()) || d.specialization?.toLowerCase().includes(doctorSearch.toLowerCase()))
                .map((doc, i) => (
                  <div key={doc.id} className="p-4 rounded-xl border border-[var(--border)] hover:border-[rgba(0,229,255,0.3)] transition-all group cursor-pointer bg-[var(--surface)] hover:bg-[rgba(255,255,255,0.11)] backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[rgba(0,229,255,0.15)] text-[#00e5ff] flex items-center justify-center font-bold text-lg">
                        {doc.name?.[0] || 'D'}
                      </div>
                      <div>
                        <div className="font-semibold text-theme-main text-sm">Dr. {doc.name}</div>
                        <div className="text-xs text-[#00e5ff] font-medium">{doc.specialization || 'General'}</div>
                      </div>
                    </div>
                    <div className="text-xs text-theme-muted flex justify-between items-center">
                      <span>{doc.availability || 'Available'}</span>
                      <button className="text-[#00e5ff] font-semibold hover:text-[#00e5ff]/80">Book →</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Two col: Chart + Appointments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="two-col">
        <div className="glass-card">
          <div className="card-header">
            <div>
              <div className="card-title">Blood Pressure Trend</div>
              <div className="card-subtitle">Last 7 days — Systolic & Diastolic</div>
            </div>
          </div>
          <div className="card-body h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8aa89d' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8aa89d' }} domain={[60, 140]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #daeae5', fontSize: '12px' }} />
                <Line type="monotone" dataKey="sys" name="Systolic" stroke="#0fb38a" strokeWidth={3} dot={{ r: 4, fill: '#0fb38a' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="dia" name="Diastolic" stroke="#8b7cf8" strokeWidth={3} dot={{ r: 4, fill: '#8b7cf8' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <div>
              <div className="card-title">Upcoming Appointments</div>
              <div className="card-subtitle">Next 7 days</div>
            </div>
          </div>
          <div className="card-body">
            {loading ? <p className="text-sm text-slate-500 text-center py-4">Loading...</p> : upcomingAppts.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No upcoming appointments</p> : upcomingAppts.map((appt, i) => (
              <div key={i} className="appt-item">
                <div className="appt-avatar">
                  {appt.doctorName ? appt.doctorName.charAt(0) : 'D'}
                </div>
                <div className="appt-info">
                  <div className="appt-name">Dr. {appt.doctorName || appt.doctorId}</div>
                  <div className="appt-dept">{appt.reason || 'General'}</div>
                  <span className={`appt-status ${appt.status === 'CONFIRMED' ? 's-confirmed' : appt.status === 'PENDING' ? 's-pending' : 's-cancelled'}`}>
                    {appt.status}
                  </span>
                </div>
                <div className="appt-time">
                  <div className="appt-date">{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom grid: Timeline + Chat & Meds */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bottom-grid">
        <div className="glass-card">
          <div className="card-header">
            <div>
              <div className="card-title">Medical Timeline</div>
              <div className="card-subtitle">Recent health events</div>
            </div>
          </div>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-left">
                <div className="tl-icon">📋</div>
                <div className="tl-line"></div>
              </div>
              <div className="tl-content">
                <div className="tl-title">Blood Test Report</div>
                <div className="tl-desc">CBC, Lipid profile, HbA1c — All within normal range except glucose.</div>
                <div className="tl-date">May 10, 2025</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-left">
                <div className="tl-icon">💊</div>
                <div className="tl-line"></div>
              </div>
              <div className="tl-content">
                <div className="tl-title">Prescription Added</div>
                <div className="tl-desc">Metformin 500mg, Atorvastatin 10mg prescribed.</div>
                <div className="tl-date">May 12, 2025</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-left">
                <div className="tl-icon">🎥</div>
                <div className="tl-line"></div>
              </div>
              <div className="tl-content">
                <div className="tl-title">Video Consultation</div>
                <div className="tl-desc">30-min follow-up. BP slightly elevated, advised lifestyle changes.</div>
                <div className="tl-date">May 15, 2025</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Medications */}
          <div className="glass-card">
            <div className="card-header">
              <div>
                <div className="card-title">Today's Medications</div>
                <div className="card-subtitle">Tap to mark as taken</div>
              </div>
              <span className="text-[11px] bg-[rgba(0,229,255,0.12)] text-[#00e5ff] px-2.5 py-1 rounded-full font-bold border border-[rgba(0,229,255,0.2)]">
                {meds.filter(m => m.taken).length}/{meds.length} taken
              </span>
            </div>
            <div className="card-body">
              {meds.map(med => (
                <div key={med.id} className="med-item">
                  <div className="med-dot" style={{ background: med.color }}></div>
                  <div className="med-info">
                    <div className="med-name">{med.name}</div>
                    <div className="med-dose">{med.dose}</div>
                  </div>
                  <div
                    className={`med-check ${med.taken ? 'taken' : ''}`}
                    onClick={() => toggleMed(med.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke={med.taken ? 'white' : 'var(--text-muted)'} strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chat */}
          <div className="glass-card">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)' }}>✨</div>
                <div>
                  <div className="card-title">CareStream AI</div>
                  <div className="card-subtitle">Powered by Claude</div>
                </div>
              </div>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {m.sender === 'bot' && <div className="msg-label">CareStream AI</div>}
                  <div className={`msg ${m.sender} ${m.sender === 'bot' ? 'bot' : 'user'}`} dangerouslySetInnerHTML={{ __html: m.text }} />
                </div>
              ))}
              {isTyping && (
                <div className="typing"><span></span><span></span><span></span></div>
              )}
            </div>
            <div className="chat-input-wrap">
              <input
                className="chat-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about symptoms..."
              />
              <button className="chat-send" onClick={handleSendChat}>
                <Send size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

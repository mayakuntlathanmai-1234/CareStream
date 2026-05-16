import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video, Eye, FileText, Search, Plus, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import './DoctorDashboard.css';



const COLORS = [
  { bg: '#e8ecff', color: '#4f6af5' },
  { bg: '#d1fae5', color: '#065f46' },
  { bg: '#fef3c7', color: '#92400e' },
  { bg: '#ede9fe', color: '#6d28d9' },
  { bg: '#fce7f3', color: '#9d174d' },
  { bg: '#e0f2fe', color: '#0369a1' },
];

const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const weekData = [
  { day: 'Mon', this: 10, last: 8 }, { day: 'Tue', this: 13, last: 11 },
  { day: 'Wed', this: 9, last: 12 }, { day: 'Thu', this: 14, last: 10 },
  { day: 'Fri', this: 11, last: 13 }, { day: 'Sat', this: 12, last: 9 },
  { day: 'Sun', this: 4, last: 6 },
];

const statusClass = (s) => {
  if (!s) return 'sc-pending';
  const m = { CONFIRMED: 'sc-confirmed', PENDING: 'sc-pending', CANCELLED: 'sc-cancelled', COMPLETED: 'sc-done' };
  return m[s.toUpperCase()] || 'sc-pending';
};

const statusLabel = (s) => {
  if (!s) return 'Pending';
  const m = { CONFIRMED: 'Confirmed', PENDING: 'Pending', CANCELLED: 'Cancelled', COMPLETED: 'Done' };
  return m[s.toUpperCase()] || s;
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabFilter, setTabFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(true);
  const [countdown, setCountdown] = useState(18 * 60);
  const notesTimer = useRef(null);

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtCountdown = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Fetch data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [apptRes, patientsRes] = await Promise.all([
          api.get('/appointments/my'),
          api.get('/patients').catch(() => ({ data: [] })),
        ]);
        const appts = Array.isArray(apptRes.data) ? apptRes.data : [];
        setAppointments(appts);

        // Build unique patient list from appointments if /patients not available
        const pats = Array.isArray(patientsRes.data) && patientsRes.data.length > 0
          ? patientsRes.data
          : [...new Map(appts.map(a => [a.patientId, {
            id: a.patientId,
            name: a.patientName || `Patient #${a.patientId}`,
            lastVisit: a.appointmentDate,
            status: a.status,
          }])).values()];
        setPatients(pats);
        if (pats.length > 0) setSelectedPatient(pats[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  // Notes autosave
  const handleNotesChange = (v) => {
    setNotes(v);
    setNotesSaved(false);
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(async () => {
      // In a real app, POST to /api/notes
      setNotesSaved(true);
    }, 2000);
  };

  // Appointment actions
  const confirmAppt = async (id) => {
    try {
      await api.put(`/appointments/${id}/confirm`);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CONFIRMED' } : a));
    } catch (e) { console.error(e); }
  };
  const cancelAppt = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`).catch(
        () => api.patch(`/appointments/${id}/cancel`)
      );
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch (e) { console.error(e); }
  };

  const filteredAppts = appointments.filter(a => {
    if (tabFilter === 'video') return a.reason?.toLowerCase().includes('video');
    return true;
  });

  const filteredPatients = patients.filter(p =>
    !patientSearch || p.name?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const pending = appointments.filter(a => a.status === 'PENDING').length;
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;

  const docName = user?.username || 'Doctor';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="doctor-dash">

      {/* Topbar info strip */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-theme-muted px-2">{today} · OPD Hours: 9 AM – 5 PM</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={confirmAppt.bind(null, null)}></button>
          <div
            className="status-toggle"
            onClick={() => setIsAvailable(a => !a)}
            style={isAvailable ? {} : { background: '#ffe4e6', borderColor: 'rgba(244,63,94,0.2)' }}
          >
            <div className="status-dot" style={{ background: isAvailable ? 'var(--emerald)' : 'var(--rose)' }}></div>
            <span className="status-text" style={{ color: isAvailable ? '#065f46' : '#be123c' }}>
              {isAvailable ? 'Available' : 'Busy'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hero-grid">
        <div className="hero-card">
          <div className="hc-icon hci-indigo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
          </div>
          <div className="hc-val">{appointments.length}</div>
          <div className="hc-label">Patients Today</div>
          <div className="hc-delta delta-up">↑ {pending} pending</div>
        </div>
        <div className="hero-card">
          <div className="hc-icon hci-emerald">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          </div>
          <div className="hc-val">{pending}</div>
          <div className="hc-label">Remaining Appointments</div>
          <div className="hc-delta delta-neu">{confirmed} confirmed</div>
        </div>
        <div className="hero-card">
          <div className="hc-icon hci-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="hc-val">24m</div>
          <div className="hc-label">Avg Consultation Time</div>
          <div className="hc-delta delta-up">↓ 4m faster</div>
        </div>

        {/* Live Queue */}
        <div className="hero-card accent-indigo">
          <div className="queue-title">
            <span className="live-dot"></span> Live Queue
          </div>
          {appointments.filter(a => a.status === 'CONFIRMED').slice(0, 3).map((a, i) => (
            <div key={a.id} className="q-row">
              <div className="q-num">{i + 1}</div>
              <div className="q-info">
                <div className="q-name">{a.patientName || `Patient #${a.patientId}`}</div>
                <div className="q-time">Appointment · {a.appointmentDate ? new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}</div>
              </div>
              <div className="q-badge">{i === 0 ? 'In Room' : i === 1 ? 'Next' : 'Queue'}</div>
            </div>
          ))}
          {appointments.filter(a => a.status === 'CONFIRMED').length === 0 && (
            <div className="q-row"><div className="q-name" style={{ opacity: 0.6 }}>No confirmed appointments</div></div>
          )}
        </div>
      </motion.div>

      {/* Video Consultation Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="video-banner">
        <div className="flex items-center gap-4 relative z-10">
          <div className="vb-cam">
            <Video size={22} color="white" />
          </div>
          <div>
            <div className="vb-title">Upcoming Video Consultation</div>
            <div className="vb-sub">Next scheduled consult · Starts in {fmtCountdown(countdown)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="vb-timer">{fmtCountdown(countdown)}</div>
          <button className="join-btn" onClick={() => navigate('/video')}>Prepare Room</button>
          <button className="join-btn green" onClick={() => navigate('/video')}>Join Now</button>
        </div>
      </motion.div>

      {/* Main 2-col: Schedule + Patients */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="main-cols">

        {/* Today's Schedule */}
        <div className="glass-card">
          <div className="card-hd">
            <div>
              <div className="ch-title">Today's Schedule</div>
              <div className="ch-sub">{today} · OPD</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['all', 'opd', 'video'].map(t => (
                  <button key={t} className={`pt-tab ${tabFilter === t ? 'on' : ''}`} onClick={() => setTabFilter(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <button onClick={() => { }} className="text-xs font-semibold" style={{ color: 'var(--indigo)' }}>+ Add</button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredAppts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-sm" style={{ color: 'var(--text-3)' }}>
              <p>No appointments found</p>
            </div>
          ) : (
            filteredAppts.map((appt, i) => {
              const c = COLORS[i % COLORS.length];
              const init = getInitials(appt.patientName || `P${appt.patientId}`);
              const apptTime = appt.appointmentDate ? new Date(appt.appointmentDate) : null;
              return (
                <div key={appt.id} className="appt-row">
                  <div className="ar-time">
                    <div className="ar-t">{apptTime ? apptTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}</div>
                    <div className="ar-ampm">{apptTime ? apptTime.toLocaleString('en', { hour12: true }).slice(-2) : ''}</div>
                  </div>
                  <div className="ar-divider"></div>
                  <div className="ar-avatar" style={{ background: c.bg, color: c.color }}>{init}</div>
                  <div className="flex-1 min-w-0">
                    <div className="ar-name">{appt.patientName || `Patient #${appt.patientId}`}</div>
                    <div className="ar-reason">{appt.reason || 'General Consultation'}</div>
                  </div>
                  <span className={`sc ${statusClass(appt.status)}`}>{statusLabel(appt.status)}</span>
                  <div className="ar-actions">
                    {appt.status === 'PENDING' && (
                      <button className="ar-btn" title="Confirm" onClick={() => confirmAppt(appt.id)}>
                        <CheckCircle size={14} color="var(--indigo)" />
                      </button>
                    )}
                    <button className="ar-btn" title="View records" onClick={() => navigate(`/medical-records/${appt.patientId}`)}>
                      <Eye size={14} />
                    </button>
                    <button className="ar-btn" title="Write prescription" onClick={() => navigate('/prescriptions')}>
                      <FileText size={14} />
                    </button>
                    {appt.status !== 'CANCELLED' && (
                      <button className="ar-btn" title="Cancel" onClick={() => cancelAppt(appt.id)}>
                        <XCircle size={14} color="var(--rose)" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Patient Panel */}
        <div className="glass-card flex flex-col">
          <div className="card-hd">
            <div>
              <div className="ch-title">Patient Records</div>
              <div className="ch-sub">Quick-view history</div>
            </div>
          </div>

          {/* Search */}
          <div className="pp-search p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-4)' }} />
              <input
                value={patientSearch}
                onChange={e => setPatientSearch(e.target.value)}
                placeholder="Search patient…"
                className="pl-8"
              />
            </div>
          </div>

          {/* Patient List */}
          <div className="patient-list">
            {filteredPatients.map((p, i) => {
              const c = COLORS[i % COLORS.length];
              return (
                <div key={p.id} className={`p-item ${selectedPatient?.id === p.id ? 'sel' : ''}`}
                  onClick={() => setSelectedPatient(p)}>
                  <div className="p-av" style={{ background: c.bg, color: c.color }}>{getInitials(p.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="p-name">{p.name}</div>
                    <div className="p-meta">Last visit: {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : 'Today'}</div>
                  </div>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, fontWeight: 600, background: c.bg, color: c.color }}>
                    {p.status || 'Active'}
                  </span>
                </div>
              );
            })}
            {filteredPatients.length === 0 && (
              <p className="text-xs p-4 text-center" style={{ color: 'var(--text-3)' }}>No patients found</p>
            )}
          </div>

          {/* Patient Detail */}
          {selectedPatient && (() => {
            const idx = patients.findIndex(p => p.id === selectedPatient.id);
            const c = COLORS[idx % COLORS.length];
            return (
              <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="pt-d-av" style={{ background: c.bg, color: c.color }}>{getInitials(selectedPatient.name)}</div>
                  <div>
                    <div className="pt-d-name">{selectedPatient.name}</div>
                    <div className="pt-d-meta">{selectedPatient.age ? `${selectedPatient.age}${selectedPatient.gender?.charAt(0)} · ` : ''}{selectedPatient.condition || 'Patient'}</div>
                  </div>
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { val: '118/76', lbl: 'Blood Pressure', status: 'Normal ✓', cls: 'vs-ok' },
                    { val: '142', lbl: 'Blood Sugar (mg/dL)', status: 'Slightly High ↑', cls: 'vs-warn' },
                    { val: '74.8', lbl: 'Weight (kg)', status: 'Stable ✓', cls: 'vs-ok' },
                    { val: '98%', lbl: 'SpO2', status: 'Normal ✓', cls: 'vs-ok' },
                  ].map((v, i) => (
                    <div key={i} className="vital-box">
                      <div className="vb-val">{v.val}</div>
                      <div className="vb-lbl">{v.lbl}</div>
                      <div className={`vb-status ${v.cls}`}>{v.status}</div>
                    </div>
                  ))}
                </div>

                <div className="section-title">Current Prescriptions</div>
                {[
                  { name: 'Metformin', dose: '500mg · 2x daily', color: '#4f6af5' },
                  { name: 'Atorvastatin', dose: '10mg · Once daily', color: '#10b981' },
                  { name: 'Amlodipine', dose: '5mg · Morning', color: '#f59e0b' },
                ].map((rx, i) => (
                  <div key={i} className="rx-item">
                    <div className="rx-dot" style={{ background: rx.color }}></div>
                    <div className="rx-name">{rx.name}</div>
                    <div className="rx-dose">{rx.dose}</div>
                  </div>
                ))}

                <button className="write-rx-btn" onClick={() => navigate('/prescriptions')}>
                  <Plus size={14} /> Write New Prescription
                </button>
              </div>
            );
          })()}
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bottom-row">

        {/* Weekly Chart */}
        <div className="glass-card">
          <div className="card-hd">
            <div>
              <div className="ch-title">Weekly Appointments</div>
              <div className="ch-sub">This week vs last week</div>
            </div>
          </div>
          <div className="p-5" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a8b5d4' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a8b5d4' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
                <Bar dataKey="this" name="This week" fill="#4f6af5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="last" name="Last week" fill="rgba(79,106,245,0.15)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Satisfaction */}
        <div className="glass-card">
          <div className="card-hd">
            <div>
              <div className="ch-title">Patient Satisfaction</div>
              <div className="ch-sub">Based on 148 reviews</div>
            </div>
            <span style={{ fontFamily: 'Syne', fontSize: '1rem', fontWeight: 700, color: 'var(--indigo)' }}>4.9 ★</span>
          </div>
          <div className="p-4">
            {[
              { name: 'Communication', sub: 'Clarity of explanation', val: 96, color: 'var(--indigo)' },
              { name: 'Wait Time', sub: 'On-time rate', val: 88, color: 'var(--emerald)' },
              { name: 'Diagnosis Accuracy', sub: 'Patient-reported', val: 98, color: 'var(--amber)' },
              { name: 'Would Recommend', sub: 'Net promoter', val: 94, color: 'var(--rose)' },
            ].map((p, i) => (
              <div key={i} className="perf-item">
                <div className="flex-1">
                  <div className="perf-name">{p.name}</div>
                  <div className="perf-sub">{p.sub}</div>
                </div>
                <div className="perf-bar-wrap">
                  <div className="perf-bar" style={{ width: `${p.val}%`, background: p.color }}></div>
                </div>
                <div className="perf-val">{p.val}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="glass-card flex flex-col">
          <div className="card-hd">
            <div>
              <div className="ch-title">Clinical Notes</div>
              <div className="ch-sub">Quick scratchpad</div>
            </div>
            <span style={{ fontSize: 10, background: notesSaved ? 'var(--emerald-light)' : 'var(--amber-light)', color: notesSaved ? '#065f46' : '#92400e', padding: '2px 9px', borderRadius: 20, fontWeight: 600 }}>
              {notesSaved ? 'Saved ✓' : 'Unsaved…'}
            </span>
          </div>
          <textarea
            className="notes-area flex-1"
            placeholder="Type clinical notes, observations, reminders…"
            value={notes}
            onChange={e => handleNotesChange(e.target.value)}
          />
          <div className="flex items-center justify-between p-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>Auto-saves after 2 seconds</span>
            <button
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
              style={{ background: 'var(--navy-800)', fontFamily: 'Mulish' }}
              onClick={() => setNotesSaved(true)}
            >
              Save Notes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

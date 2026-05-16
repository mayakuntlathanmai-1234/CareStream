import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Plus, RefreshCw } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PatientDashboard.css';

const statusConfig = {
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, class: 's-confirmed', bg: '#e6f9f4', color: '#0a9973' },
  PENDING:   { label: 'Pending',   icon: AlertCircle, class: 's-pending',   bg: '#fffbf0', color: '#d4920e' },
  CANCELLED: { label: 'Cancelled', icon: XCircle,     class: 's-cancelled', bg: '#fff1f0', color: '#e05a4a' },
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments/my');
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  const counts = {
    ALL: appointments.length,
    CONFIRMED: appointments.filter(a => a.status === 'CONFIRMED').length,
    PENDING: appointments.filter(a => a.status === 'PENDING').length,
    CANCELLED: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  return (
    <div className="patient-dashboard max-w-5xl mx-auto">

      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="welcome-banner mb-7">
        <div className="welcome-text">
          <h2>My Appointments</h2>
          <p>View and manage all your scheduled consultations</p>
        </div>
        <button
          onClick={() => navigate('/appointments/book')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-theme-main dark:text-white font-semibold text-sm transition-all border border-white/20"
        >
          <Plus size={16} /> Book New
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-6">
        {[
          { key: 'ALL', label: 'Total', color: '#0a9973', bg: '#e6f9f4' },
          { key: 'CONFIRMED', label: 'Confirmed', color: '#0a9973', bg: '#e6f9f4' },
          { key: 'PENDING', label: 'Pending', color: '#d4920e', bg: '#fffbf0' },
          { key: 'CANCELLED', label: 'Cancelled', color: '#e05a4a', bg: '#fff1f0' },
        ].map(s => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`stat-card text-left transition-all ${filter === s.key ? 'ring-2 ring-offset-2' : ''}`}
            style={{ '--ring-color': s.color, boxShadow: filter === s.key ? `0 0 0 2px ${s.color}` : '' }}>
            <div className="stat-val" style={{ color: s.color }}>{counts[s.key]}</div>
            <div className="stat-lbl">{s.label}</div>
          </button>
        ))}
      </motion.div>

      {/* Appointments List */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pd-card">
        <div className="card-header">
          <div>
            <div className="card-title">
              {filter === 'ALL' ? 'All Appointments' : `${statusConfig[filter]?.label} Appointments`}
            </div>
            <div className="card-subtitle">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={fetchAppointments} className="flex items-center gap-1.5 text-sm text-[var(--teal-500)] font-medium hover:text-[var(--teal-700)]">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-2 border-[var(--teal-500)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
              <Calendar size={48} className="mb-4 opacity-30" />
              <p className="text-base font-medium">No {filter !== 'ALL' ? filter.toLowerCase() : ''} appointments found</p>
              <button onClick={() => navigate('/appointments/book')} className="mt-4 px-4 py-2 bg-[var(--teal-500)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--teal-600)] transition-colors">
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filtered.map((appt, i) => {
                const cfg = statusConfig[appt.status] || statusConfig.PENDING;
                const StatusIcon = cfg.icon;
                const apptDate = appt.appointmentDate ? new Date(appt.appointmentDate) : null;

                return (
                  <motion.div
                    key={appt.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-5 px-6 py-4 hover:bg-[var(--surface2)] transition-colors"
                  >
                    {/* Date Badge */}
                    <div className="flex-shrink-0 w-14 text-center">
                      <div className="text-xl font-bold text-[var(--text-primary)]">
                        {apptDate ? apptDate.getDate() : '—'}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] uppercase">
                        {apptDate ? apptDate.toLocaleString('default', { month: 'short' }) : ''}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-10 bg-[var(--border)]"></div>

                    {/* Doctor Info */}
                    <div className="w-10 h-10 rounded-full bg-[var(--teal-50)] text-[var(--teal-600)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {appt.doctorName?.[0] || 'D'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[var(--text-primary)] text-sm">
                        Dr. {appt.doctorName || `Doctor #${appt.doctorId}`}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {apptDate ? apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={11} /> {appt.reason || 'General Consultation'}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      <StatusIcon size={12} />
                      {cfg.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

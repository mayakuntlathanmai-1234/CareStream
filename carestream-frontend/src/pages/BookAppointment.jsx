import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  Calendar, Clock, Stethoscope, FileText, CheckCircle,
  AlertCircle, ChevronRight, Star, MapPin, ArrowLeft
} from 'lucide-react';
import './PatientDashboard.css';



const SPECIALTIES = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General'];
const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
const REASONS = ['General Check-up', 'Follow-up Consultation', 'Chest Pain / Breathing Issue', 'Fever / Infection', 'Skin Condition', 'Mental Health', 'Vaccination', 'Other'];

const AVATAR_COLORS = [
  { bg: '#e8ecff', color: '#4f6af5' }, { bg: '#d1fae5', color: '#065f46' },
  { bg: '#fef3c7', color: '#92400e' }, { bg: '#ede9fe', color: '#6d28d9' },
  { bg: '#fce7f3', color: '#9d174d' }, { bg: '#e0f2fe', color: '#0369a1' },
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state || {};

  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [specFilter, setSpecFilter] = useState('All');

  const [form, setForm] = useState({
    doctorId: prefill.doctorId || '',
    doctorName: prefill.doctorName || '',
    specialization: prefill.specialization || '',
    date: '',
    time: '',
    reason: prefill.reason || '',
  });

  useEffect(() => {
    api.get('/doctors')
      .then(res => setDoctors(Array.isArray(res.data) ? res.data : []))
      .catch(() => setDoctors([
        { id: 1, name: 'Jane Smith', specialization: 'Cardiology', availability: 'Mon-Wed, 9AM-2PM' },
        { id: 2, name: 'Robert Brown', specialization: 'Neurology', availability: 'Tue-Thu, 10AM-4PM' },
        { id: 3, name: 'Sarah Wilson', specialization: 'Pediatrics', availability: 'Mon-Fri, 8AM-12PM' },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = doctors.filter(d =>
    specFilter === 'All' || d.specialization === specFilter
  );

  const selectDoctor = (doc) => {
    setForm(f => ({ ...f, doctorId: doc.id, doctorName: doc.name, specialization: doc.specialization }));
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!form.doctorId || !form.date || !form.time || !form.reason) {
      setError('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/appointments', {
        doctorId: form.doctorId,
        appointmentTime: `${form.date}T${form.time}:00`,
        reason: form.reason,
      });
      setSuccess(true);
      setTimeout(() => navigate('/appointments'), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoc = doctors.find(d => d.id == form.doctorId);
  const today = new Date().toISOString().split('T')[0];

  if (success) return (
    <div className="patient-dashboard flex items-center justify-center min-h-[70vh]">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="pd-card p-10 text-center max-w-sm w-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-[var(--teal-50)] flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} color="var(--teal-500)" />
        </motion.div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'Instrument Serif' }}>
          Appointment Booked!
        </h2>
        <p className="text-[var(--text-muted)] text-sm mb-1">
          Dr. {form.doctorName} · {new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-[var(--teal-500)] font-semibold text-sm">{form.time} · {form.reason}</p>
        <div className="mt-6 text-xs text-[var(--text-muted)]">Redirecting to My Appointments…</div>
      </motion.div>
    </div>
  );

  return (
    <div className="patient-dashboard max-w-5xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="welcome-banner mb-7">
        <div className="welcome-text">
          <h2>Book an Appointment</h2>
          <p>Choose your specialist, pick a time, and confirm your visit</p>
        </div>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/15 hover:bg-black/10 dark:hover:bg-white/25 rounded-xl text-theme-main dark:text-white text-sm font-medium transition-all border border-black/10 dark:border-white/20">
          <ArrowLeft size={15} /> Go Back
        </button>
      </motion.div>

      {/* Step Indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-7">
        {[
          { n: 1, label: 'Choose Doctor' },
          { n: 2, label: 'Pick Date & Time' },
          { n: 3, label: 'Confirm' },
        ].map((s, i, arr) => (
          <div key={s.n} className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => step > s.n && setStep(s.n)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step > s.n ? 'bg-[var(--teal-500)] text-white' :
                step === s.n ? 'bg-[var(--teal-500)] text-white shadow-md' :
                'bg-[var(--surface2)] text-[var(--text-muted)] border border-[var(--border)]'
              }`}>
                {step > s.n ? <CheckCircle size={16} /> : s.n}
              </div>
              <span className={`text-sm font-semibold ${step === s.n ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                {s.label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div className={`h-px flex-1 w-12 transition-all ${step > s.n ? 'bg-[var(--teal-400)]' : 'bg-[var(--border)]'}`}></div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Error banner */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 mb-5 rounded-xl text-sm font-medium"
          style={{ background: '#fff1f0', color: '#e05a4a', border: '1px solid #ffc5c0' }}>
          <AlertCircle size={18} />{error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* ─── STEP 1: Choose Doctor ─── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {/* Specialty filter */}
            <div className="flex gap-2 flex-wrap mb-5">
              {['All', ...SPECIALTIES].map(s => (
                <button key={s} onClick={() => setSpecFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    specFilter === s
                      ? 'bg-[var(--teal-500)] text-white border-[var(--teal-500)]'
                      : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--teal-300)]'
                  }`}>
                  {s}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-[var(--teal-500)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDoctors.map((doc, i) => {
                  const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const isSelected = form.doctorId == doc.id;
                  return (
                    <motion.div key={doc.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                      onClick={() => selectDoctor(doc)}
                      className={`pd-card cursor-pointer transition-all flex flex-col ${
                        isSelected ? 'ring-2 ring-[var(--teal-400)]' : 'hover:shadow-md'
                      }`}>
                      <div className="p-5 flex gap-4 items-start">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                          style={{ background: c.bg, color: c.color }}>
                          {doc.name?.[0] || 'D'}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[var(--text-primary)]">Dr. {doc.name}</div>
                          <div className="text-xs font-semibold text-[var(--teal-500)] mt-0.5">{doc.specialization || 'General'}</div>
                          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-1.5">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>4.9 · 120+ reviews</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-5 pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <Clock size={12} />{doc.availability || 'Available Today'}
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                          isSelected
                            ? 'bg-[var(--teal-500)] text-white'
                            : 'bg-[var(--teal-50)] text-[var(--teal-600)] hover:bg-[var(--teal-500)] hover:text-white'
                        }`}>
                          Select <ChevronRight size={12} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── STEP 2: Pick Date & Time ─── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Date & Reason */}
              <div className="pd-card p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type="date" min={today}
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] bg-[var(--surface2)] outline-none focus:border-[var(--teal-400)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Reason for Visit
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {REASONS.map(r => (
                      <button key={r} onClick={() => setForm(f => ({ ...f, reason: r }))}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                          form.reason === r
                            ? 'bg-[var(--teal-50)] border-[var(--teal-300)] text-[var(--teal-700)]'
                            : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--teal-200)]'
                        }`}>
                        {r}
                      </button>
                    ))}
                  </div>
                  <textarea rows={2} placeholder="Add more details…"
                    value={REASONS.includes(form.reason) ? '' : form.reason}
                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    className="w-full mt-2 px-3 py-2.5 border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] bg-[var(--surface2)] outline-none focus:border-[var(--teal-400)] resize-none transition-all"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="pd-card p-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, time: t }))}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        form.time === t
                          ? 'bg-[var(--teal-500)] text-white border-[var(--teal-500)] shadow-md'
                          : 'bg-[var(--surface2)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--teal-300)] hover:bg-[var(--teal-50)]'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-[var(--border)]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Selected Doctor</div>
                  {selectedDoc && (() => {
                    const idx = doctors.findIndex(d => d.id == form.doctorId);
                    const c = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    return (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                          style={{ background: c.bg, color: c.color }}>
                          {selectedDoc.name?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[var(--text-primary)]">Dr. {selectedDoc.name}</div>
                          <div className="text-xs text-[var(--teal-500)]">{selectedDoc.specialization}</div>
                        </div>
                        <button onClick={() => setStep(1)} className="ml-auto text-xs text-[var(--teal-500)] font-semibold hover:underline">
                          Change
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setStep(1)}
                className="px-6 py-3 border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface2)] transition-all">
                ← Back
              </button>
              <button onClick={() => { if (form.date && form.time && form.reason) { setStep(3); setError(''); } else setError('Please select a date, time and reason.'); }}
                className="flex-1 py-3 bg-[var(--teal-500)] hover:bg-[var(--teal-600)] text-white rounded-xl text-sm font-bold transition-all shadow-md">
                Continue to Confirm →
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: Confirm ─── */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="max-w-xl mx-auto">
            <div className="pd-card p-8">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: 'Instrument Serif' }}>
                Confirm Your Appointment
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">Please review the details below before confirming</p>

              {/* Summary card */}
              <div className="bg-[var(--surface2)] rounded-2xl p-5 space-y-4 border border-[var(--border)] mb-6">
                {[
                  { icon: Stethoscope, label: 'Doctor', value: `Dr. ${form.doctorName} · ${form.specialization}` },
                  { icon: Calendar, label: 'Date', value: form.date ? new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                  { icon: Clock, label: 'Time', value: form.time ? `${form.time} (${parseInt(form.time) < 12 ? 'AM' : 'PM'})` : '—' },
                  { icon: FileText, label: 'Reason', value: form.reason },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--teal-50)] flex items-center justify-center flex-shrink-0">
                      <row.icon size={16} color="var(--teal-600)" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{row.label}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{row.value}</div>
                    </div>
                    <button onClick={() => setStep(row.label === 'Doctor' ? 1 : 2)}
                      className="ml-auto text-xs text-[var(--teal-500)] font-medium hover:underline">Edit</button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)}
                  className="px-6 py-3 border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface2)] transition-all">
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-3 bg-[var(--teal-500)] hover:bg-[var(--teal-600)] disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2">
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Booking…</>
                  ) : (
                    <><CheckCircle size={16} /> Confirm Booking</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

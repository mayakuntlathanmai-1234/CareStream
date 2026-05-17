import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, Search, Plus, FileDown, RefreshCw, FileText, 
  Calendar, User, Check, X, Printer, HeartPulse, Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Prescriptions() {
  const { hasRole, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);
  
  // Patient list (For Doctors)
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
  // Modal / Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [refillLoading, setRefillLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New prescription form (For Doctors)
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (hasRole('PATIENT')) {
        const patRes = await api.get('/patients/me');
        setPatient(patRes.data);
        if (patRes.data.id) {
          const recRes = await api.get(`/medical-records/patient/${patRes.data.id}`);
          setRecords(Array.isArray(recRes.data) ? recRes.data : []);
        }
      } else if (hasRole('DOCTOR') || hasRole('ADMIN')) {
        const patsRes = await api.get('/patients');
        const patsData = Array.isArray(patsRes.data) ? patsRes.data : [];
        setPatients(patsData);
        if (patsData.length > 0) {
          setSelectedPatientId(patsData[0].id);
          const recRes = await api.get(`/medical-records/patient/${patsData[0].id}`);
          setRecords(Array.isArray(recRes.data) ? recRes.data : []);
        }
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      toast.error('Failed to load prescription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hasRole]);

  // When doctor changes selected patient
  const handlePatientChange = async (patientId) => {
    setSelectedPatientId(patientId);
    setLoading(true);
    try {
      const recRes = await api.get(`/medical-records/patient/${patientId}`);
      setRecords(Array.isArray(recRes.data) ? recRes.data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  // Submit prescription form
  const handlePrescribeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.warn('Please select a patient first');
      return;
    }
    try {
      await api.post('/medical-records', {
        patientId: selectedPatientId,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes
      });
      toast.success('Prescription generated successfully! Patient notified.');
      setShowAddForm(false);
      setFormData({ diagnosis: '', treatment: '', notes: '' });
      handlePatientChange(selectedPatientId);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save prescription');
    }
  };

  // Handle refill request animation
  const handleRefillRequest = (prescriptionId) => {
    setRefillLoading(prescriptionId);
    setTimeout(() => {
      setRefillLoading(null);
      toast.success('Refill request sent to doctor and pharmacy! You will receive an SMS update.');
    }, 1800);
  };

  // Helper to parse treatment plan into individual items
  const parseTreatment = (treatmentText) => {
    if (!treatmentText) return [];
    // Split by commas, semi-colons, or newlines
    return treatmentText.split(/[,\n;]+/).map(t => t.trim()).filter(Boolean);
  };

  // Filtered list
  const filteredRecords = records.filter(r => 
    r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.treatment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-main dark:text-white flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ff375f]/15 text-[#ff375f] shadow-[0_0_15px_rgba(255,55,95,0.15)]">
              <Pill size={22} className="animate-pulse" />
            </div>
            Clinical Prescriptions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {hasRole('PATIENT') 
              ? 'View details of active medications, request refills, or download official prescription documents.'
              : 'Issue new prescriptions, check past medication histories, and monitor patient adherence.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text"
              placeholder="Search prescriptions..."
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-theme-main dark:text-white text-sm focus:outline-none focus:border-[#ff375f]/50 w-64 backdrop-blur-md transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {hasRole('DOCTOR') && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff375f] to-[#ff2a55] text-white hover:shadow-[0_0_20px_rgba(255,55,95,0.4)] transition-all font-bold text-sm"
            >
              {showAddForm ? <X size={16} /> : <Plus size={16} />}
              {showAddForm ? 'Cancel' : 'Write Prescription'}
            </button>
          )}
        </div>
      </div>

      {/* Doctor Patient Selection Bar */}
      {(hasRole('DOCTOR') || hasRole('ADMIN')) && (
        <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Select Patient:</span>
          <select 
            value={selectedPatientId} 
            onChange={(e) => handlePatientChange(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-theme-main dark:text-white text-sm focus:outline-none focus:border-[#ff375f]/50 min-w-[200px]"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id} className="dark:bg-slate-900">{p.name} (ID: #{p.id})</option>
            ))}
          </select>
        </div>
      )}

      {/* Write Prescription Form (Doctor only) */}
      <AnimatePresence>
        {showAddForm && hasRole('DOCTOR') && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 border-[#ff375f]/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#ff375f]/10 to-transparent rounded-full filter blur-xl pointer-events-none" />
            <h2 className="text-xl font-bold text-theme-main dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-[#ff375f]" size={18} />
              Issue New Prescription
            </h2>
            <form onSubmit={handlePrescribeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Diagnosis / Reason</label>
                <input
                  type="text"
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white text-sm focus:outline-none focus:border-[#ff375f]/50"
                  placeholder="e.g., Type 2 Diabetes, Hypertension"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Medications & Dosages (Use comma or new lines for separate drugs)</label>
                <textarea
                  required
                  rows="3"
                  value={formData.treatment}
                  onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white text-sm focus:outline-none focus:border-[#ff375f]/50"
                  placeholder="e.g., Metformin 500mg - 1 tablet after dinner, Atorvastatin 10mg - 1 tablet at night"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Usage Guidelines / Clinical Notes</label>
                <textarea
                  required
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white text-sm focus:outline-none focus:border-[#ff375f]/50"
                  placeholder="e.g., Avoid sugary drinks, check sugar fasting daily, walk 30 mins."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-theme-muted hover:text-theme-main transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff375f] to-[#ff2a55] text-white hover:shadow-[0_0_15px_rgba(255,55,95,0.3)] transition-all text-sm font-bold"
                >
                  Save & Print
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#ff375f] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-20 glass-card border-dashed border-white/10">
          <HeartPulse className="mx-auto text-slate-600 mb-4" size={48} />
          <p className="text-slate-400 font-medium">No prescriptions found</p>
          <p className="text-slate-500 text-xs mt-1">Any medical history with medications will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((record) => {
            const medsList = parseTreatment(record.treatment);
            return (
              <motion.div 
                key={record.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card flex flex-col justify-between hover:border-[#ff375f]/30 p-5 group relative overflow-hidden"
              >
                {/* Background soft glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#ff375f]/5 to-transparent rounded-full pointer-events-none filter blur-xl" />
                
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#ff375f]/12 text-[#ff375f] border border-[#ff375f]/15">
                        Rx Diagnosis
                      </span>
                      <h3 className="text-lg font-bold text-theme-main dark:text-white mt-1.5">{record.diagnosis}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <User size={13} className="text-[#ff375f]/70" />
                      <span>Dr. {record.doctor?.name}</span>
                    </div>
                  </div>

                  {/* Medicines List */}
                  <div className="space-y-2 mb-4 bg-black/10 dark:bg-white/5 rounded-xl p-3.5 border border-black/5 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Pill size={11} className="text-[#ff375f]" /> Meds list
                    </p>
                    {medsList.map((med, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs text-theme-muted group-hover:text-theme-main transition-colors">
                        <span className="w-1.5 h-1.5 bg-[#ff375f] rounded-full mt-1.5 flex-shrink-0"></span>
                        <span className="leading-normal font-medium">{med}</span>
                      </div>
                    ))}
                  </div>

                  {/* Clinical Guideline Section */}
                  <div className="space-y-1 mb-5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <FileText size={11} className="text-[#ff375f]" /> Doctor Guidelines
                    </p>
                    <p className="text-xs text-theme-muted italic">"{record.notes || 'Take as directed by doctor.'}"</p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10 mt-auto">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <Calendar size={12} className="text-slate-500" />
                    <span>{new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedPrescription(record)}
                      className="p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="View Digital Rx"
                    >
                      <FileDown size={14} />
                    </button>
                    
                    {hasRole('PATIENT') && (
                      <button 
                        onClick={() => handleRefillRequest(record.id)}
                        disabled={refillLoading === record.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#ff375f]/10 hover:bg-[#ff375f]/20 border border-[#ff375f]/20 hover:border-[#ff375f]/40 text-[#ff375f] rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {refillLoading === record.id ? (
                          <RefreshCw size={12} className="animate-spin" />
                        ) : (
                          <RefreshCw size={12} />
                        )}
                        <span>Request Refill</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Digital Prescription Preview Modal */}
      <AnimatePresence>
        {selectedPrescription && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white text-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col"
            >
              {/* Paper Top Design Accent */}
              <div className="bg-gradient-to-r from-[#ff375f] to-[#ff2a55] h-3 w-full" />
              
              {/* Official Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Care<span className="text-[#ff375f]">Stream</span>
                  </h2>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Official Digital Prescription</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">DR. {selectedPrescription.doctor?.name?.toUpperCase()}</p>
                  <p className="text-[10px] text-slate-500">{selectedPrescription.doctor?.specialization || 'Hospital Specialist'}</p>
                  <p className="text-[9px] text-[#ff375f] font-semibold mt-0.5">Reg ID: #CS-2026-{selectedPrescription.doctor?.id || 492}</p>
                </div>
              </div>

              {/* Prescription Body Details */}
              <div className="p-6 space-y-5 flex-1">
                {/* Patient Meta Strip */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium">Patient Name</p>
                    <p className="font-bold text-slate-800 mt-0.5">{patient?.name || selectedPrescription.patient?.name || 'CareStream Patient'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Date / Time</p>
                    <p className="font-bold text-slate-800 mt-0.5">{new Date(selectedPrescription.date).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Gender</p>
                    <p className="font-bold text-slate-800 mt-0.5">{patient?.gender || selectedPrescription.patient?.gender || 'Male'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Prescription Reference</p>
                    <p className="font-bold text-[#ff375f] mt-0.5">#RX-{selectedPrescription.id * 105}</p>
                  </div>
                </div>

                {/* Rx Diagnosis */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedPrescription.diagnosis}</p>
                </div>

                {/* Rx Symbol & Medication Plan */}
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5 mb-2.5">
                    <span className="text-2xl font-serif italic font-extrabold text-[#ff375f]">℞</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Prescribed Medicines</p>
                  </div>
                  <div className="space-y-2.5">
                    {parseTreatment(selectedPrescription.treatment).map((med, i) => (
                      <div key={i} className="flex justify-between items-start text-xs border-b border-slate-50 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff375f]" />
                          <span className="font-semibold text-slate-800">{med.split('-')[0].trim()}</span>
                        </div>
                        <span className="text-slate-500 text-[11px] italic">{med.split('-')[1]?.trim() || 'As directed'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guidelines */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dosage guidelines & Diet rules</p>
                  <p className="text-slate-600 text-xs italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{selectedPrescription.notes || 'Take full dosage. Finish course of treatment.'}"
                  </p>
                </div>
              </div>

              {/* Stamp & Footer Buttons */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {/* Simulated Signature Stamp */}
                <div className="text-center relative">
                  <div className="absolute inset-0 bg-teal-400/5 border border-teal-400/20 rounded-full scale-125 -rotate-12 flex items-center justify-center font-bold text-[8px] uppercase tracking-wider text-teal-500">CareStream Certified</div>
                  <p className="font-serif italic text-xs text-slate-700 relative z-10 pt-1">Dr. {selectedPrescription.doctor?.name}</p>
                  <div className="w-16 h-[1px] bg-slate-400 mx-auto mt-0.5" />
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Authorised Doctor</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedPrescription(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors text-xs font-bold"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => { window.print(); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff375f] to-[#ff2a55] text-white hover:shadow-lg transition-all text-xs font-bold"
                  >
                    <Printer size={13} />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Calendar, Activity, UserRound, Search, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);
  const { hasRole } = useAuth();

  const { patientId } = useParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ diagnosis: '', treatment: '', notes: '' });

  const fetchData = async () => {
    try {
      let currentPatientId = patientId;
      let patientData = null;

      if (patientId) {
        const patientRes = await api.get(`/patients/${patientId}`);
        patientData = patientRes.data;
      } else if (hasRole('PATIENT')) {
        const patientRes = await api.get('/patients/me');
        patientData = patientRes.data;
        currentPatientId = patientData.id;
      }

      setPatient(patientData);

      if (currentPatientId) {
        const recordsRes = await api.get(`/medical-records/patient/${currentPatientId}`);
        setRecords(recordsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch medical records');
    }
  };

  useEffect(() => {
    fetchData();
  }, [hasRole, patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) return;
    try {
      await api.post('/medical-records', {
        patientId: patient.id,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes
      });
      setShowAddForm(false);
      setFormData({ diagnosis: '', treatment: '', notes: '' });
      fetchData(); // Refresh records
    } catch (err) {
      console.error('Failed to save record');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-clinical-dark">Medical Records</h1>
          <p className="text-slate-500">View and manage clinical history for {patient?.name || 'Patient'}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-clinical-primary bg-white"
            />
          </div>
          {hasRole('DOCTOR') && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-clinical-primary text-white rounded-lg hover:bg-clinical-secondary transition-colors font-bold text-sm"
            >
              {showAddForm ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
              {showAddForm ? 'Cancel' : 'Add Record'}
            </button>
          )}
        </div>
      </header>

      {showAddForm && hasRole('DOCTOR') && (
        <div className="card border-clinical-primary border-t-4">
          <h2 className="text-xl font-bold text-clinical-dark mb-4">New Clinical Note</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
              <input
                type="text"
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-clinical-primary/20 focus:border-clinical-primary transition-all"
                placeholder="e.g., Acute Bronchitis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Plan</label>
              <textarea
                required
                value={formData.treatment}
                onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-clinical-primary/20 focus:border-clinical-primary transition-all min-h-[80px]"
                placeholder="Prescriptions and treatment steps..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes</label>
              <textarea
                required
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-clinical-primary/20 focus:border-clinical-primary transition-all min-h-[80px]"
                placeholder="Observations during visit..."
              />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2 bg-clinical-primary text-white rounded-lg hover:bg-clinical-secondary transition-colors font-bold text-sm">
                Save Medical Record
              </button>
            </div>
          </form>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <FileText className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">No medical records found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {records.map((record) => (
            <div key={record.id} className="card hover:border-clinical-primary transition-all p-0 overflow-hidden group">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 bg-slate-50 p-6 border-r border-slate-100 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-clinical-primary shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Calendar size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  <p className="text-2xl font-bold text-clinical-dark">{new Date(record.date).getDate()}</p>
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-clinical-primary bg-teal-50 px-2 py-1 rounded mb-2 inline-block">Diagnosis</span>
                      <h3 className="text-xl font-bold text-clinical-dark">{record.diagnosis}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 text-sm italic">
                      <UserRound size={14} />
                      <span>By Dr. {record.doctor.name}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                        <Activity size={14} className="mr-1.5" /> Treatment Plan
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{record.treatment}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                        <FileText size={14} className="mr-1.5" /> Clinical Notes
                      </h4>
                      <p className="text-slate-600 text-sm italic leading-relaxed">"{record.notes}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Calendar, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './PatientDashboard.css';



export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        console.log('Doctors API response:', res.data);
        setDoctors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Doctors fetch error:', err.response?.status, err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || 'Failed to load doctors');
        // Fallback mock data so the UI still renders
        setDoctors([
          { id: 1, name: 'Jane Smith', specialization: 'Cardiology', availability: 'Mon-Wed, 9AM-2PM', contactNumber: '9876543210' },
          { id: 2, name: 'Robert Brown', specialization: 'Neurology', availability: 'Tue-Thu, 10AM-4PM', contactNumber: '9876543210' },
          { id: 3, name: 'Sarah Wilson', specialization: 'Pediatrics', availability: 'Mon-Fri, 8AM-12PM', contactNumber: '9876543210' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d => 
    !search || 
    d.name?.toLowerCase().includes(search.toLowerCase()) || 
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patient-dashboard max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pd-card p-8 bg-[var(--surface)] relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'Instrument Serif, serif' }}>
              Our Specialists
            </h1>
            <p className="text-[var(--text-muted)] max-w-lg">
              Find and book appointments with our world-class medical professionals. Select a doctor to view their profile and availability.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or specialty..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] outline-none focus:border-[var(--teal-400)] transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Doctors Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          <div className="col-span-full py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-[var(--teal-500)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--text-muted)] pd-card">
            No doctors found matching "{search}"
          </div>
        ) : (
          filteredDoctors.map((doc, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={doc.id} 
              className="pd-card group hover:shadow-lg transition-all flex flex-col hover:-translate-y-1"
            >
              {/* Doctor Header / Avatar */}
              <div className="p-6 pb-0 flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--teal-50)] text-[var(--teal-600)] flex items-center justify-center text-2xl font-bold">
                  {doc.name?.[0] || 'D'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Dr. {doc.name}</h3>
                  <div className="text-[var(--teal-500)] text-sm font-medium mb-1">{doc.specialization || 'General Physician'}</div>
                  <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Star size={12} className="text-[var(--amber)] fill-[var(--amber)]" />
                    <span>4.9 (120+ reviews)</span>
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="p-6 py-4 flex-1">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <MapPin size={14} className="text-[var(--text-muted)]" />
                    <span>Room {doc.id + 100}, Main Wing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Clock size={14} className="text-[var(--text-muted)]" />
                    <span>{doc.availability || 'Available Today'}</span>
                  </div>
                </div>
                
                <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                  Dr. {doc.name} is a highly experienced {doc.specialization || 'General Physician'} dedicated to providing comprehensive and compassionate patient care.
                </p>
              </div>

              {/* Action Area */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--surface2)]">
                <button 
                  onClick={() => navigate('/appointments/book', { state: { doctorId: doc.id, doctorName: doc.name, specialization: doc.specialization } })}
                  className="w-full py-2.5 bg-white hover:bg-[var(--teal-500)] text-[var(--teal-600)] hover:text-white border border-[var(--teal-200)] hover:border-[var(--teal-500)] rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <Calendar size={16} />
                  Book Appointment
                  <ChevronRight size={16} className="opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

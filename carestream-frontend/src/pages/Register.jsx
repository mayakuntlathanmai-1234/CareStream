import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, Mail, Lock, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [accountType, setAccountType] = useState('patient');
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', name: '',
    contactNumber: '', address: '', gender: 'Male',
    dateOfBirth: '', specialization: '', availability: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, role: [accountType] };
      await register(payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/[0.05] dark:bg-white/[0.07] border border-black/[0.1] dark:border-white/[0.14] focus:ring-2 focus:ring-[#00e5ff]/20 focus:border-[#00e5ff]/50 outline-none transition-all text-theme-main placeholder-[#5a6485] backdrop-blur-sm font-[Outfit]";
  const selectClass = "w-full px-4 py-2.5 rounded-xl bg-black/[0.05] dark:bg-white/[0.07] border border-black/[0.1] dark:border-white/[0.14] focus:ring-2 focus:ring-[#00e5ff]/20 focus:border-[#00e5ff]/50 outline-none transition-all text-theme-main backdrop-blur-sm font-[Outfit]";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Mesh Background */}
      <div className="mesh-bg"></div>

      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Top Controls */}
      <div className="absolute top-6 w-full max-w-7xl px-6 flex justify-between z-20">
        <Link to="/" className="flex items-center text-theme-muted hover:text-theme-main font-medium transition-colors bg-black/[0.05] dark:bg-white/[0.07] backdrop-blur-xl px-4 py-2 rounded-full border border-black/[0.1] dark:border-white/[0.14] text-sm">
          <ArrowLeft size={18} className="mr-2" /> Home
        </Link>
        <ThemeToggle />
      </div>
      
      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl relative z-10 bg-black/[0.05] dark:bg-white/[0.07] backdrop-blur-2xl border border-black/[0.1] dark:border-white/[0.14] rounded-2xl p-8 my-16 overflow-y-auto max-h-[85vh] hide-scrollbar"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)', boxShadow: '0 0 20px rgba(0,229,255,0.4)' }}>
              <Activity className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-theme-main" style={{ fontFamily: "'Playfair Display', serif" }}>Create Account</h2>
              <p className="text-theme-muted text-sm">Join CareStream today</p>
            </div>
          </div>
          
          <div className="bg-black/[0.05] dark:bg-white/[0.07] backdrop-blur-md p-1 rounded-xl flex space-x-1 border border-black/[0.1] dark:border-white/[0.14]">
            <button type="button" onClick={() => setAccountType('patient')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${accountType === 'patient' ? 'text-[#00e5ff] border border-[#00e5ff]/20' : 'text-theme-muted hover:text-theme-muted'}`}
              style={accountType === 'patient' ? { background: 'linear-gradient(90deg, rgba(0,229,255,0.12), rgba(10,132,255,0.06))' } : {}}>
              Patient
            </button>
            <button type="button" onClick={() => setAccountType('doctor')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${accountType === 'doctor' ? 'text-[#00e5ff] border border-[#00e5ff]/20' : 'text-theme-muted hover:text-theme-muted'}`}
              style={accountType === 'doctor' ? { background: 'linear-gradient(90deg, rgba(0,229,255,0.12), rgba(10,132,255,0.06))' } : {}}>
              Doctor
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-[#ff375f]/10 border border-[#ff375f]/20 text-[#ff375f] p-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#00e5ff] mb-2">Account Details</h3>
            
            <div>
              <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"><User size={16} /></span>
                <input name="username" onChange={handleChange} className={inputClass} placeholder="johndoe" required />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"><Mail size={16} /></span>
                <input name="email" type="email" onChange={handleChange} className={inputClass} placeholder="john@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"><Lock size={16} /></span>
                <input name="password" type="password" onChange={handleChange} className={inputClass} placeholder="••••••••" required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#00e5ff] mb-2">Personal Information</h3>

            <div>
              <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Full Name</label>
              <input name="name" onChange={handleChange} className={selectClass} placeholder="John Doe" required />
            </div>

            {accountType === 'patient' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Gender</label>
                  <select name="gender" onChange={handleChange} className={selectClass}>
                    <option value="Male" className="bg-[#0e1220]">Male</option>
                    <option value="Female" className="bg-[#0e1220]">Female</option>
                    <option value="Other" className="bg-[#0e1220]">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Date of Birth</label>
                  <input name="dateOfBirth" type="date" onChange={handleChange} className={selectClass} required={accountType === 'patient'} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Specialization</label>
                  <input name="specialization" onChange={handleChange} className={selectClass} placeholder="e.g. Cardiology" required={accountType === 'doctor'} />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Availability</label>
                  <input name="availability" onChange={handleChange} className={selectClass} placeholder="Mon-Fri, 9AM-5PM" required={accountType === 'doctor'} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Contact Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"><Phone size={16} /></span>
                <input name="contactNumber" onChange={handleChange} className={inputClass} placeholder="1234567890" required />
              </div>
            </div>
          </div>

          {accountType === 'patient' && (
            <div className="md:col-span-2">
              <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-1">Address</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-theme-muted"><MapPin size={16} /></span>
                <textarea name="address" onChange={handleChange} rows="2" className={`${inputClass} !py-2.5`} placeholder="Your full address"></textarea>
              </div>
            </div>
          )}

          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="md:col-span-2 py-3.5 text-lg mt-4 rounded-xl text-white font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)', boxShadow: '0 4px 16px rgba(0,229,255,0.25)' }}>
            Create Account
          </motion.button>
        </form>

        <p className="mt-8 text-center text-theme-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00e5ff] font-bold hover:text-[#00e5ff]/80 transition-colors">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

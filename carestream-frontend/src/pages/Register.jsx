import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, Mail, Lock, Phone, MapPin, ArrowLeft, Shield, Sparkles, Stethoscope, Heart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [accountType, setAccountType] = useState('patient');
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', name: '',
    contactNumber: '', address: '', gender: 'Male',
    dateOfBirth: '', specialization: '', availability: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData, role: [accountType] };
      await register(payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputContainerClass = "relative mt-1.5 group";
  const inputClass = "w-full pl-11 pr-4 py-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] focus:ring-2 focus:ring-[#00e5ff]/20 focus:border-[#00e5ff] outline-none transition-all text-theme-main placeholder-[#5a6485] font-sans group-hover:border-black/[0.15] dark:group-hover:border-white/[0.15] backdrop-blur-md";
  const labelClass = "block text-xs font-semibold text-theme-muted uppercase tracking-wider transition-colors group-focus-within:text-[#00e5ff]";

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#080b16] relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* MESH BACKGROUNDS */}
      <div className="mesh-bg opacity-30"></div>
      <div className="orb orb-1 opacity-20"></div>
      <div className="orb orb-2 opacity-20"></div>

      {/* LEFT COLUMN: BRAND SHOWCASE (Visible on LG screens) */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-16 relative overflow-hidden bg-gradient-to-br from-[#0c1225] via-[#090b16] to-[#04060d] border-r border-white/[0.05]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e5ff]/10 rounded-full blur-3xl opacity-35" />
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)', boxShadow: '0 0 20px rgba(0,229,255,0.3)' }}>
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-sans">CareStream</span>
        </div>

        {/* Feature/Tagline Center */}
        <div className="space-y-10 my-auto relative z-10">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight font-sans">
              Next-Gen Clinical <br/>
              <span className="bg-gradient-to-r from-[#00e5ff] to-[#0a84ff] bg-clip-text text-transparent">Operations Portal</span>
            </h1>
            <p className="text-slate-400 text-base max-w-md font-sans">
              Manage patient care, track real-time clinical statistics, and conduct digital consultations through a unified, high-security ecosystem.
            </p>
          </div>

          {/* Features Highlights */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#00e5ff] flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">HIPAA Compliant Security</h4>
                <p className="text-slate-400 text-xs mt-0.5">End-to-end encrypted databases and strict clinical role controls.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#0a84ff] flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Live Clinical Dashboards</h4>
                <p className="text-slate-400 text-xs mt-0.5">Real-time statistics, appointment tracking, and live WebRTC consultations.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#00e5ff] flex-shrink-0">
                <Stethoscope size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Integrated Patient Records</h4>
                <p className="text-slate-400 text-xs mt-0.5">Unified patient charts, prescription histories, and automatic seeding.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="text-xs text-slate-500 font-sans relative z-10">
          © 2026 CareStream Health Technologies. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: REGISTRATION FORM */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative z-10 overflow-y-auto min-h-screen">
        
        {/* Navigation & Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <Link to="/" className="flex items-center gap-2 text-theme-muted hover:text-theme-main bg-black/[0.05] dark:bg-white/[0.07] hover:bg-black/[0.1] dark:hover:bg-white/[0.11] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] px-4 py-2 rounded-full text-xs font-medium transition-all">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <ThemeToggle />
        </div>

        {/* Registration Box */}
        <div className="w-full max-w-xl mx-auto mt-10">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-theme-main font-sans tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Get Started
            </h2>
            <p className="text-theme-muted text-sm mt-1">Create your clinical account to access the platform.</p>
          </div>

          {/* Account Type Selector (Glass Capsule) */}
          <div className="bg-black/[0.05] dark:bg-white/[0.05] backdrop-blur-md p-1 rounded-2xl flex border border-black/[0.08] dark:border-white/[0.08] mb-8 w-fit">
            <button type="button" onClick={() => setAccountType('patient')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${accountType === 'patient' ? 'text-[#00e5ff] border border-[#00e5ff]/20 bg-[#00e5ff]/10' : 'text-theme-muted hover:text-theme-main'}`}>
              <Heart size={14} /> Patient
            </button>
            <button type="button" onClick={() => setAccountType('doctor')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${accountType === 'doctor' ? 'text-[#00e5ff] border border-[#00e5ff]/20 bg-[#00e5ff]/10' : 'text-theme-muted hover:text-theme-main'}`}>
              <Stethoscope size={14} /> Doctor
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#ff375f]/10 border border-[#ff375f]/20 text-[#ff375f] p-4 rounded-xl text-sm mb-6 font-medium">
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Account Details */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#00e5ff]">Account Credentials</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className={labelClass}>Username</label>
                  <div className={inputContainerClass}>
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                    <input name="username" onChange={handleChange} className={inputClass} placeholder="johndoe" required />
                  </div>
                </div>

                <div className="group">
                  <label className={labelClass}>Email Address</label>
                  <div className={inputContainerClass}>
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                    <input name="email" type="email" onChange={handleChange} className={inputClass} placeholder="john@example.com" required />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className={labelClass}>Password</label>
                <div className={inputContainerClass}>
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                  <input name="password" type="password" onChange={handleChange} className={inputClass} placeholder="••••••••" required />
                </div>
              </div>
            </div>

            {/* Row 2: Personal details */}
            <div className="space-y-5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#00e5ff]">Profile Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className={labelClass}>Full Name</label>
                  <div className={inputContainerClass}>
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                    <input name="name" onChange={handleChange} className={inputClass} placeholder="John Doe" required />
                  </div>
                </div>

                <div className="group">
                  <label className={labelClass}>Contact Number</label>
                  <div className={inputContainerClass}>
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                    <input name="contactNumber" onChange={handleChange} className={inputClass} placeholder="1234567890" required />
                  </div>
                </div>
              </div>

              {/* Dynamic profile fields depending on Patient / Doctor selection */}
              <AnimatePresence mode="wait">
                {accountType === 'patient' ? (
                  <motion.div key="patient-fields" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="group">
                      <label className={labelClass}>Gender</label>
                      <div className="relative mt-1.5">
                        <select name="gender" onChange={handleChange} 
                          className="w-full px-4 py-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] focus:ring-2 focus:ring-[#00e5ff]/20 focus:border-[#00e5ff] outline-none transition-all text-theme-main font-sans backdrop-blur-md appearance-none cursor-pointer">
                          <option value="Male" className="bg-[#0e1220] text-white">Male</option>
                          <option value="Female" className="bg-[#0e1220] text-white">Female</option>
                          <option value="Other" className="bg-[#0e1220] text-white">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-theme-muted">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div className="group">
                      <label className={labelClass}>Date of Birth</label>
                      <div className={inputContainerClass}>
                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                        <input name="dateOfBirth" type="date" onChange={handleChange} className={inputClass} required={accountType === 'patient'} />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="doctor-fields" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="group">
                      <label className={labelClass}>Specialization</label>
                      <div className={inputContainerClass}>
                        <Stethoscope size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                        <input name="specialization" onChange={handleChange} className={inputClass} placeholder="e.g. Cardiology" required={accountType === 'doctor'} />
                      </div>
                    </div>
                    <div className="group">
                      <label className={labelClass}>Availability Info</label>
                      <div className={inputContainerClass}>
                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                        <input name="availability" onChange={handleChange} className={inputClass} placeholder="Mon-Fri, 9AM-5PM" required={accountType === 'doctor'} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {accountType === 'patient' && (
                <div className="group">
                  <label className={labelClass}>Living Address</label>
                  <div className="relative mt-1.5">
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
                    <textarea name="address" onChange={handleChange} rows="2" className={`${inputClass} !pl-11 !py-3`} placeholder="Enter full mailing address"></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Create Button */}
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
              className="w-full py-4 text-base font-bold mt-4 rounded-xl text-white transition-all duration-300 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)', boxShadow: '0 4px 20px rgba(0,229,255,0.25)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </motion.button>
          </form>

          {/* Footer Navigation */}
          <p className="mt-8 text-center text-theme-muted text-sm font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00e5ff] font-bold hover:text-[#00e5ff]/80 transition-colors">
              Sign In
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Register;

import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, ArrowRight, UserCircle, CalendarDays, FileText, Video, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Mesh Background */}
      <div className="mesh-bg"></div>

      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-transparent backdrop-blur-2xl border-b border-black/[0.1] dark:border-white/[0.14]" style={{ WebkitBackdropFilter: 'blur(24px) saturate(180%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)', boxShadow: '0 0 20px rgba(0,229,255,0.4)' }}>
                <Activity className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-theme-main tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Care<span className="text-[#00e5ff]">Stream</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-theme-muted hover:text-[#00e5ff] font-medium text-sm transition-colors">
                Sign In
              </Link>
              <ThemeToggle />
              <Link to="/register" className="btn-primary flex items-center text-sm">
                Get Started <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-bold tracking-widest uppercase mb-6 border border-[#00e5ff]/20" style={{ backdropFilter: 'blur(12px)' }}>
                <ShieldCheck size={14} className="mr-2" /> Secure Healthcare Platform
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-theme-main tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Modernizing{' '}
              <span className="text-gradient-cyan">Clinical Workflows</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-theme-muted mb-10 leading-relaxed"
            >
              A unified management system for patients, doctors, and hospital administration. Streamline appointments, secure medical records, and enhance patient care.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all text-white" style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)', boxShadow: '0 6px 24px rgba(0,229,255,0.3)' }}>
                Join as Patient
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-black/[0.05] dark:bg-white/[0.07] backdrop-blur-xl text-theme-main border border-black/[0.1] dark:border-white/[0.14] rounded-xl font-bold text-lg hover:border-[#00e5ff]/30 hover:bg-black/[0.1] dark:bg-white/[0.11] transition-all flex items-center justify-center">
                Staff Portal <ArrowRight size={20} className="ml-2 text-[#00e5ff]" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-theme-main mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>A Platform for Everyone</h2>
              <p className="text-theme-muted max-w-2xl mx-auto">CareStream brings together all healthcare stakeholders into one seamless, secure environment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Patient Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="group p-8 rounded-2xl bg-black/[0.05] dark:bg-white/[0.07] backdrop-blur-xl border border-black/[0.1] dark:border-white/[0.14] hover:border-[#00e5ff]/30 transition-all duration-300 relative overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#00e5ff]/15 text-[#00e5ff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 16px rgba(0,229,255,0.2)' }}>
                  <HeartPulse size={28} />
                </div>
                <h3 className="text-xl font-bold text-theme-main mb-3">For Patients</h3>
                <p className="text-theme-muted mb-6 leading-relaxed text-sm">Take control of your health. Book appointments, view your comprehensive medical records, and communicate with your doctors securely.</p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm font-medium text-theme-muted"><CalendarDays size={16} className="mr-2 text-[#00e5ff]" /> 24/7 Appointment Booking</li>
                  <li className="flex items-center text-sm font-medium text-theme-muted"><FileText size={16} className="mr-2 text-[#00e5ff]" /> Access Clinical Notes</li>
                  <li className="flex items-center text-sm font-medium text-theme-muted"><Video size={16} className="mr-2 text-[#00e5ff]" /> Video Consultations</li>
                </ul>
              </motion.div>

              {/* Doctor Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="group p-8 rounded-2xl bg-black/[0.05] dark:bg-white/[0.07] backdrop-blur-xl border border-black/[0.1] dark:border-white/[0.14] hover:border-[#0a84ff]/30 transition-all duration-300 relative overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#0a84ff]/15 text-[#0a84ff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 16px rgba(10,132,255,0.2)' }}>
                  <UserCircle size={28} />
                </div>
                <h3 className="text-xl font-bold text-theme-main mb-3">For Doctors</h3>
                <p className="text-theme-muted mb-6 leading-relaxed text-sm">Focus on patient care, not paperwork. Manage your daily schedule, review patient histories, and write clinical notes effortlessly.</p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm font-medium text-theme-muted"><CalendarDays size={16} className="mr-2 text-[#0a84ff]" /> Schedule Management</li>
                  <li className="flex items-center text-sm font-medium text-theme-muted"><FileText size={16} className="mr-2 text-[#0a84ff]" /> Dynamic Record Entry</li>
                  <li className="flex items-center text-sm font-medium text-theme-muted"><Bot size={16} className="mr-2 text-[#0a84ff]" /> AI-Assisted Diagnosis</li>
                </ul>
              </motion.div>

              {/* Admin Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="group p-8 rounded-2xl bg-black/[0.05] dark:bg-white/[0.07] backdrop-blur-xl border border-black/[0.1] dark:border-white/[0.14] hover:border-[#bf5af2]/30 transition-all duration-300 relative overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#bf5af2]/15 text-[#bf5af2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 16px rgba(191,90,242,0.2)' }}>
                  <Activity size={28} />
                </div>
                <h3 className="text-xl font-bold text-theme-main mb-3">For Administrators</h3>
                <p className="text-theme-muted mb-6 leading-relaxed text-sm">Complete oversight of the hospital system. Monitor metrics, manage user roles, and ensure smooth operational workflows.</p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm font-medium text-theme-muted"><UserCircle size={16} className="mr-2 text-[#bf5af2]" /> Staff & User Management</li>
                  <li className="flex items-center text-sm font-medium text-theme-muted"><Activity size={16} className="mr-2 text-[#bf5af2]" /> Real-time System Metrics</li>
                  <li className="flex items-center text-sm font-medium text-theme-muted"><ShieldCheck size={16} className="mr-2 text-[#bf5af2]" /> Advanced Analytics</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-12 text-center border-t border-black/[0.09] dark:border-white/[0.09]">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)' }}>
              <Activity size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-theme-main tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Care<span className="text-[#00e5ff]">Stream</span>
            </span>
          </div>
          <p className="text-sm text-theme-muted">© 2026 CareStream Medical Center. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;

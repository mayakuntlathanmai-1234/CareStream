import { useAuth } from '../context/AuthContext';
import {
  LogOut, LayoutDashboard, Calendar, FileText, Users, Activity,
  Stethoscope, ChevronRight, CalendarPlus, Pill, ClipboardList,
  CreditCard, BarChart2, Settings, UserCog, HeartPulse,
  Video, Bot, X
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const sections = [
    {
      label: 'Analytics',
      links: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: true, color: 'text-[#00e5ff]' },
      ]
    },
    {
      label: 'Patient',
      links: [
        { name: 'Book Appointment', path: '/appointments/book', icon: CalendarPlus, show: hasRole('PATIENT'), color: 'text-[#0a84ff]' },
        { name: 'My Appointments', path: '/appointments', icon: Calendar, show: hasRole('PATIENT'), color: 'text-[#0a84ff]' },
        { name: 'Find Doctors', path: '/doctors', icon: Stethoscope, show: hasRole('PATIENT'), color: 'text-[#00e5ff]' },
        { name: 'Video Consultation', path: '/video', icon: Video, show: hasRole('PATIENT'), color: 'text-[#30d158]' },
        { name: 'AI Health Chat', path: '/ai-chat', icon: Bot, show: hasRole('PATIENT'), color: 'text-[#bf5af2]' },
        { name: 'Medical Records', path: '/medical-records', icon: FileText, show: hasRole('PATIENT'), color: 'text-[#bf5af2]' },
        { name: 'Prescriptions', path: '/prescriptions', icon: Pill, show: hasRole('PATIENT'), color: 'text-[#ff375f]' },
        { name: 'Billing', path: '/billing', icon: CreditCard, show: hasRole('PATIENT'), color: 'text-[#ffd60a]' },
      ]
    },
    {
      label: 'Doctor',
      links: [
        { name: 'Appointments', path: '/appointments', icon: Calendar, show: hasRole('DOCTOR'), color: 'text-[#0a84ff]' },
        { name: 'Video Consultation', path: '/video', icon: Video, show: hasRole('DOCTOR'), color: 'text-[#30d158]' },
        { name: 'My Patients', path: '/patients', icon: HeartPulse, show: hasRole('DOCTOR'), color: 'text-[#ff375f]' },
        { name: 'Medical Records', path: '/medical-records', icon: FileText, show: hasRole('DOCTOR'), color: 'text-[#bf5af2]' },
        { name: 'Prescriptions', path: '/prescriptions', icon: Pill, show: hasRole('DOCTOR'), color: 'text-[#ff375f]' },
      ]
    },
    {
      label: 'Admin',
      links: [
        { name: 'Appointments', path: '/appointments', icon: Calendar, show: hasRole('ADMIN'), color: 'text-[#0a84ff]' },
        { name: 'Find Doctors', path: '/doctors', icon: Stethoscope, show: hasRole('ADMIN'), color: 'text-[#00e5ff]' },
        { name: 'Manage Users', path: '/admin/users', icon: Users, show: hasRole('ADMIN'), color: 'text-[#ffd60a]' },
        { name: 'Register Doctor', path: '/admin/register-doctor', icon: UserCog, show: hasRole('ADMIN'), color: 'text-[#bf5af2]' },
        { name: 'Reports', path: '/reports', icon: BarChart2, show: hasRole('ADMIN'), color: 'text-[#30d158]' },
      ]
    },
    {
      label: 'Account',
      links: [
        { name: 'Settings', path: '/settings', icon: Settings, show: true, color: 'text-theme-muted' },
      ]
    },
  ];

  const visibleSections = sections
    .map(s => ({ ...s, links: s.links.filter(l => l.show) }))
    .filter(s => s.links.length > 0);

  const roleLabel = user?.roles?.[0]?.replace('ROLE_', '') || 'USER';
  const roleColor = roleLabel === 'ADMIN' ? 'text-[#ffd60a]' : roleLabel === 'DOCTOR' ? 'text-[#0a84ff]' : 'text-[#00e5ff]';

  return (
    <div
      className={`w-64 glass-sidebar h-screen fixed left-0 top-0 flex flex-col z-35 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo & Close Button */}
      <div className="p-5 border-b border-black/[0.09] dark:border-white/[0.09] flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-neon-cyan"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)' }}>
              <Activity size={20} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00e5ff] rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-theme-main tracking-tight font-display">
              Care<span className="text-[#00e5ff]">Stream</span>
            </h1>
            <p className="text-[10px] text-theme-muted uppercase tracking-widest font-semibold">Medical Center</p>
          </div>
        </motion.div>

        {/* Close Button on Mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-theme-muted hover:text-theme-main transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-3 overflow-y-auto hide-scrollbar">
        {visibleSections.map((section, si) => (
          <div key={section.label}>
            <p className="text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] px-3 mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link, i) => {
                const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
                const globalIndex = si * 10 + i;
                return (
                  <motion.div key={link.path + link.name} custom={globalIndex} variants={navItemVariants} initial="hidden" animate="visible">
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`group relative flex items-center space-x-3 p-2.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#00e5ff]/12 to-[#0a84ff]/6 border border-[#00e5ff]/15'
                          : 'hover:bg-black/[0.05] dark:hover:bg-white/[0.07] border border-transparent hover:border-black/10 dark:hover:border-white/10'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#00e5ff] rounded-r-full"
                          style={{ boxShadow: '0 0 8px #00e5ff' }}
                          transition={{ type: 'spring', bounce: 0.3 }}
                        />
                      )}
                      <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                        isActive ? 'bg-black/10 dark:bg-white/10' : 'group-hover:bg-black/5 dark:group-hover:bg-white/5'
                      }`}>
                        <link.icon size={16} className={isActive ? link.color : 'text-theme-muted group-hover:text-theme-muted'} />
                      </div>
                      <span className={`flex-1 text-[0.82rem] font-medium transition-colors duration-200 ${
                        isActive ? 'text-[#00e5ff]' : 'text-theme-muted group-hover:text-theme-muted'
                      }`}>{link.name}</span>
                      {isActive && <ChevronRight size={14} className="text-[#00e5ff] opacity-60" />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-black/[0.09] dark:border-white/[0.09] space-y-2">
        <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-neon-cyan flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00e5ff, #bf5af2)' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-semibold text-theme-main truncate">{user?.username || 'User'}</p>
            <p className={`text-xs font-medium truncate ${roleColor}`}>{roleLabel}</p>
          </div>
          <div className="w-2 h-2 bg-[#30d158] rounded-full animate-pulse flex-shrink-0"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-2 rounded-xl bg-[#ff375f]/10 hover:bg-[#ff375f]/20 border border-[#ff375f]/20 hover:border-[#ff375f]/40 text-[#ff375f] transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;

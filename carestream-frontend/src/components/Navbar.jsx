import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const location = useLocation();
  
  // Format the path into a readable title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const title = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Dashboard';

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-8 py-5 mb-6 z-20 relative"
    >
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-theme-main font-display tracking-tight">
          {title}
        </h1>
        <p className="text-[11px] text-theme-muted font-semibold mt-0.5 tracking-wider uppercase">
          CareStream Medical Center
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative group hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
          <input 
            type="text" 
            placeholder="Search patients, doctors, records..." 
            className="pl-9 pr-4 py-2 w-64 bg-black/[0.03] dark:bg-white/[0.03] border border-white/[0.07] rounded-xl text-sm outline-none focus:bg-white/[0.05] focus:border-[#00e5ff]/50 text-theme-main transition-all placeholder:text-theme-muted"
          />
        </div>

        {/* Action Elements */}
        <div className="flex items-center gap-3 pl-2">
          <ThemeToggle />
          <div className="relative">
            <NotificationBell />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

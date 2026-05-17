import { useLocation } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const title = pathParts.length > 0
    ? pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Dashboard';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between py-4 mb-6 z-20 relative"
    >
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Mobile Menu Button — only on screens < lg */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex-shrink-0 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-theme-main hover:bg-[#00e5ff]/10 hover:text-[#00e5ff] transition-all"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-theme-main font-display tracking-tight truncate">
            {title}
          </h1>
          <p className="hidden sm:block text-[10px] text-theme-muted font-semibold mt-0.5 tracking-wider uppercase">
            CareStream Medical Center
          </p>
        </div>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Search — desktop only */}
        <div className="relative group hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-[#00e5ff] transition-colors" />
          <input
            type="text"
            placeholder="Search patients, doctors, records..."
            className="pl-9 pr-4 py-2 w-64 bg-black/[0.03] dark:bg-white/[0.03] border border-white/[0.07] rounded-xl text-sm outline-none focus:bg-white/[0.05] focus:border-[#00e5ff]/50 text-theme-main transition-all placeholder:text-theme-muted"
          />
        </div>

        {/* Theme toggle + Notifications */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

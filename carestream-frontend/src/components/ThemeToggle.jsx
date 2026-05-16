import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border
        ${isDark 
          ? 'bg-yellow-400/5 border-yellow-400/20 hover:bg-yellow-400/10 hover:border-yellow-400/40' 
          : 'bg-teal-400/5 border-teal-400/20 hover:bg-teal-400/10 hover:border-teal-400/40'
        }`}
    >
      <AnimatePresence mode="wait">
        <motion.div key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {isDark
            ? <Sun size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
            : <Moon size={18} className="text-teal-400 drop-shadow-[0_0_8px_rgba(13,148,136,0.4)]" />
          }
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;

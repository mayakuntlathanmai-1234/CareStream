import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Mesh Background */}
      <div className="mesh-bg"></div>

      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Back button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center gap-2 text-theme-muted hover:text-theme-main bg-black/[0.05] dark:bg-white/[0.07] hover:bg-black/[0.1] dark:bg-white/[0.11] backdrop-blur-xl border border-black/[0.1] dark:border-white/[0.14] px-4 py-2 rounded-full text-sm font-medium transition-all">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </motion.div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-black/[0.05] dark:bg-white/[0.07] backdrop-blur-2xl border border-black/[0.1] dark:border-white/[0.14] rounded-2xl p-8 relative overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)', boxShadow: '0 0 20px rgba(0,229,255,0.4)' }}>
              <Activity size={28} className="text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00e5ff] rounded-full animate-pulse" />
            </motion.div>
            <h2 className="text-2xl font-bold text-theme-main" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome Back</h2>
            <p className="text-theme-muted text-sm mt-1">Sign in to access CareStream</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#ff375f]/10 border border-[#ff375f]/20 text-[#ff375f] p-3 rounded-xl text-sm mb-6">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-2">Username</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                  className="input-with-icon" placeholder="Enter your username" />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-theme-muted uppercase tracking-[0.12em] mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="input-glass pl-10 pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-muted transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 text-base font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #0a84ff)', boxShadow: '0 4px 16px rgba(0,229,255,0.25)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-theme-muted text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#00e5ff] font-semibold hover:text-[#00e5ff]/80 transition-colors">
              Register here
            </Link>
          </p>
        </div>

        {/* Bottom glow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-[#00e5ff]/20 blur-2xl rounded-full" />
      </motion.div>
    </div>
  );
}

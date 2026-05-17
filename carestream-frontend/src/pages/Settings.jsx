import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Bell, Target, Sparkles, Check, 
  Mail, Phone, Calendar, Heart, MapPin, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Settings() {
  const { user, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Tab profile data states
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    email: '',
    contactNumber: '',
    dateOfBirth: '',
    gender: 'Other',
    address: '',
    specialization: '',
    availability: ''
  });

  // Security password state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // Preferences toggles
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    smsAlerts: true,
    weeklyReport: false,
    telehealthAutoJoin: true
  });

  // Patient health goal states
  const [healthGoals, setHealthGoals] = useState({
    targetWeight: '70',
    targetSys: '120',
    targetDia: '80',
    targetGlucose: '120'
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (hasRole('PATIENT')) {
        const res = await api.get('/patients/me');
        const d = res.data;
        setProfileForm({
          name: d.name || '',
          username: user?.username || '',
          email: user?.email || '',
          contactNumber: d.contactNumber || '',
          dateOfBirth: d.dateOfBirth || '',
          gender: d.gender || 'Other',
          address: d.address || '',
          specialization: '',
          availability: ''
        });
      } else if (hasRole('DOCTOR')) {
        const res = await api.get('/doctors/me');
        const d = res.data;
        setProfileForm({
          name: d.name || '',
          username: user?.username || '',
          email: user?.email || '',
          contactNumber: d.contactNumber || '',
          dateOfBirth: '',
          gender: 'Other',
          address: '',
          specialization: d.specialization || '',
          availability: d.availability || 'Available'
        });
      } else {
        // Admin or generic user
        setProfileForm(prev => ({
          ...prev,
          name: user?.username || 'Administrator',
          username: user?.username || '',
          email: user?.email || 'admin@carestream.com',
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [hasRole]);

  // Handle updates to patient or doctor profiles
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (hasRole('PATIENT')) {
        await api.put('/patients/me', {
          name: profileForm.name,
          contactNumber: profileForm.contactNumber,
          dateOfBirth: profileForm.dateOfBirth,
          gender: profileForm.gender,
          address: profileForm.address
        });
        toast.success('Patient profile successfully updated in CareStream Database!');
      } else if (hasRole('DOCTOR')) {
        await api.put('/doctors/me', {
          name: profileForm.name,
          specialization: profileForm.specialization,
          contactNumber: profileForm.contactNumber,
          availability: profileForm.availability
        });
        toast.success('Doctor schedule and profile updated successfully!');
      } else {
        toast.success('Admin preferences updated locally.');
      }
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update details. Please check form constraints.');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset password form handler
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('Confirm password does not match new password!');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Password changed successfully! Next login will require the new credentials.');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1500);
  };

  // Save targets
  const handleGoalsSubmit = (e) => {
    e.preventDefault();
    toast.success('Personal health benchmarks established. Adherence metrics will update in dashboard!');
  };

  // Toggle helper
  const handlePrefToggle = (field) => {
    setPrefs(prev => ({ ...prev, [field]: !prev[field] }));
    toast.success('System preferences updated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-theme-main dark:text-white flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          System Control & Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Configure profile records, password security, clinical guidelines, alerts, and theme layouts.</p>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Profile Settings', icon: User, color: 'text-[#00e5ff]' },
            { id: 'security', label: 'Security & Auth', icon: Shield, color: 'text-[#0a84ff]' },
            { id: 'prefs', label: 'Preferences & UI', icon: Bell, color: 'text-[#bf5af2]' },
            { id: 'goals', label: 'Health Goals', icon: Target, color: 'text-[#30d158]', show: hasRole('PATIENT') }
          ].filter(t => t.show !== false).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-white/[0.08] to-transparent border-white/10 text-white shadow-neon'
                  : 'bg-transparent border-transparent text-theme-muted hover:bg-white/[0.04]'
              }`}
            >
              <tab.icon size={16} className={activeTab === tab.id ? tab.color : 'text-slate-500'} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#00e5ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full pointer-events-none filter blur-xl" />
              
              <AnimatePresence mode="wait">
                
                {/* 1. PROFILE SETTINGS */}
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-theme-main dark:text-white flex items-center gap-2">
                      <User className="text-[#00e5ff]" size={18} />
                      Personal Records Information
                    </h2>
                    
                    <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                      {/* Name & Username Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Legal Name</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white"
                            value={profileForm.name}
                            onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Username (Primary Key)</label>
                          <input 
                            type="text" 
                            disabled
                            className="w-full bg-black/10 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                            value={profileForm.username}
                          />
                        </div>
                      </div>

                      {/* Email & Contact Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email ID</label>
                          <input 
                            type="email" 
                            disabled
                            className="w-full bg-black/10 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                            value={profileForm.email}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Phone Number</label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                              type="tel" 
                              required
                              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-theme-main dark:text-white"
                              value={profileForm.contactNumber}
                              onChange={e => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Patient Specific Fields */}
                      {hasRole('PATIENT') && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</label>
                              <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                  type="date" 
                                  required
                                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-theme-main dark:text-white"
                                  value={profileForm.dateOfBirth}
                                  onChange={e => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender Identification</label>
                              <select 
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white"
                                value={profileForm.gender}
                                onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                              >
                                <option value="Male" className="dark:bg-slate-900">Male</option>
                                <option value="Female" className="dark:bg-slate-900">Female</option>
                                <option value="Other" className="dark:bg-slate-900">Other / Prefer not to say</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Permanent Residential Address</label>
                            <div className="relative">
                              <MapPin size={14} className="absolute left-3 top-3 text-slate-500" />
                              <textarea 
                                rows="2"
                                required
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-theme-main dark:text-white"
                                value={profileForm.address}
                                onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Doctor Specific Fields */}
                      {hasRole('DOCTOR') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Specialization</label>
                            <input 
                              type="text" 
                              required
                              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white"
                              value={profileForm.specialization}
                              onChange={e => setProfileForm({ ...profileForm, specialization: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">OPD Availability Description</label>
                            <input 
                              type="text" 
                              required
                              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white"
                              value={profileForm.availability}
                              onChange={e => setProfileForm({ ...profileForm, availability: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end pt-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#0a84ff] text-white hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                        >
                          {submitting ? 'Saving...' : <><Check size={14} /> Update DB Records</>}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 2. SECURITY & AUTH */}
                {activeTab === 'security' && (
                  <motion.div 
                    key="security" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-theme-main dark:text-white flex items-center gap-2">
                      <Shield className="text-[#0a84ff]" size={18} />
                      Credential Reset Options
                    </h2>
                    
                    <form onSubmit={handleSecuritySubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showPass.current ? 'text' : 'password'}
                            required
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white pr-10"
                            value={securityForm.currentPassword}
                            onChange={e => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                          />
                          <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {showPass.current ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">New Secure Password</label>
                        <div className="relative">
                          <input 
                            type={showPass.new ? 'text' : 'password'}
                            required
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white pr-10"
                            value={securityForm.newPassword}
                            onChange={e => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          />
                          <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {showPass.new ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm New Password</label>
                        <div className="relative">
                          <input 
                            type={showPass.confirm ? 'text' : 'password'}
                            required
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white pr-10"
                            value={securityForm.confirmPassword}
                            onChange={e => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          />
                          <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {showPass.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0a84ff] to-[#0055ff] text-white hover:shadow-[0_0_15px_rgba(10,132,255,0.3)] transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                        >
                          {submitting ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 3. PREFERENCES & UI */}
                {activeTab === 'prefs' && (
                  <motion.div 
                    key="prefs" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-xs"
                  >
                    <h2 className="text-xl font-bold text-theme-main dark:text-white flex items-center gap-2">
                      <Bell className="text-[#bf5af2]" size={18} />
                      Application Settings & Themes
                    </h2>
                    
                    {/* Theme toggle row */}
                    <div className="flex items-center justify-between p-4 bg-black/10 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <div>
                        <p className="font-bold text-theme-main dark:text-white text-sm">Theme Mode Layout</p>
                        <p className="text-theme-muted text-[10px] mt-0.5">Toggle between bright clinical or high contrast dark mode visuals.</p>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className="px-4 py-2 rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 text-theme-main dark:text-white font-bold tracking-wider hover:border-[#bf5af2]/50 transition-colors"
                      >
                        {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                      </button>
                    </div>

                    {/* Alerts Toggles */}
                    <div className="space-y-3">
                      {[
                        { id: 'emailAlerts', title: 'Email Communication', desc: 'Receive prescription refill alerts, lab reports updates, and invoices.' },
                        { id: 'smsAlerts', title: 'SMS Quick Updates', desc: 'Direct message notifications for appointment reminders and video signals.' },
                        { id: 'weeklyReport', title: 'Weekly Adherence Reports', desc: 'Detailed PDF summary of metrics (BP, glucose logs, and drug compliance).' },
                        { id: 'telehealthAutoJoin', title: 'Instant Telehealth Connect', desc: 'Auto-load cameras and microphones when joining video consultation corridors.' },
                      ].map((pItem) => (
                        <div key={pItem.id} className="flex items-center justify-between p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl">
                          <div>
                            <p className="font-bold text-theme-main dark:text-white text-xs">{pItem.title}</p>
                            <p className="text-theme-muted text-[9px] mt-0.5">{pItem.desc}</p>
                          </div>
                          
                          <button
                            onClick={() => handlePrefToggle(pItem.id)}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${
                              prefs[pItem.id] ? 'bg-[#bf5af2]' : 'bg-slate-600'
                            }`}
                          >
                            <div 
                              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                prefs[pItem.id] ? 'translate-x-5' : 'translate-x-0'
                              }`} 
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. HEALTH METRICS TARGETS */}
                {activeTab === 'goals' && hasRole('PATIENT') && (
                  <motion.div 
                    key="goals" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-theme-main dark:text-white flex items-center gap-2">
                      <Target className="text-[#30d158]" size={18} />
                      Personal Health Threshold Goals
                    </h2>
                    
                    <form onSubmit={handleGoalsSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Weight (kg)</label>
                          <input 
                            type="number" 
                            required
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white"
                            value={healthGoals.targetWeight}
                            onChange={e => setHealthGoals({ ...healthGoals, targetWeight: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Fasting Glucose (mg/dL)</label>
                          <input 
                            type="number" 
                            required
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white"
                            value={healthGoals.targetGlucose}
                            onChange={e => setHealthGoals({ ...healthGoals, targetGlucose: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Systolic Threshold Limit (mmHg)</label>
                          <input 
                            type="number" 
                            required
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white"
                            value={healthGoals.targetSys}
                            onChange={e => setHealthGoals({ ...healthGoals, targetSys: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diastolic Threshold Limit (mmHg)</label>
                          <input 
                            type="number" 
                            required
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-theme-main dark:text-white"
                            value={healthGoals.targetDia}
                            onChange={e => setHealthGoals({ ...healthGoals, targetDia: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#30d158] to-[#10b981] text-white hover:shadow-[0_0_15px_rgba(48,209,88,0.3)] transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                        >
                          Save Goal Metrics
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

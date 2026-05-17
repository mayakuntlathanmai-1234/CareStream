import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, User, Mail, Lock, Phone, UserCog, Stethoscope, Clock, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const RegisterDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    contactNumber: '',
    specialization: '',
    availability: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/admin/register-doctor', formData);
      toast.success(response.data.message || 'Doctor registered successfully!');
      
      // Reset form on success
      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        contactNumber: '',
        specialization: '',
        availability: '',
      });
      
      // Redirect back to Admin Dashboard after brief delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to register doctor. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <UserCog className="text-[#bf5af2] w-8 h-8" />
            Register New Doctor
          </h1>
          <p className="page-subtitle mt-1">
            Provision secure credentials and configure specializations for medical staff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info / Security Card (Left Side) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-l-4 border-l-[#bf5af2]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#bf5af2]/10 text-[#bf5af2]">
                <Activity size={20} />
              </div>
              <h3 className="text-base font-bold text-theme-main font-display">System Status</h3>
            </div>
            <p className="text-theme-muted text-sm leading-relaxed">
              New doctors added here are fully active in the clinical signaling pool immediately. They can log in using their credentials and start accepting Video Consultations.
            </p>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-[#ff375f]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ff375f]/10 text-[#ff375f]">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-base font-bold text-theme-main font-display">Credential Policy</h3>
            </div>
            <ul className="text-theme-muted text-sm space-y-2 leading-relaxed">
              <li className="flex items-start">
                <span className="text-[#ff375f] mr-2">•</span> Username must be unique across the hospital database.
              </li>
              <li className="flex items-start">
                <span className="text-[#ff375f] mr-2">•</span> Password must be a minimum of 6 characters in length.
              </li>
              <li className="flex items-start">
                <span className="text-[#ff375f] mr-2">•</span> The record is secured by role-based authorization filters.
              </li>
            </ul>
          </div>
        </div>

        {/* Form Panel (Right Side) */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8 relative overflow-hidden">
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#bf5af2]/35 to-transparent"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Account Details Block */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#bf5af2] mb-3">Account Details</h3>

                  <div>
                    <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-2">Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted"><User size={16} /></span>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-with-icon w-full" placeholder="e.g. drkumar" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted"><Mail size={16} /></span>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-with-icon w-full" placeholder="e.g. drkumar@carestream.com" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted"><Lock size={16} /></span>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-with-icon w-full" placeholder="••••••••" required />
                    </div>
                  </div>
                </div>

                {/* Personal / Clinical Information Block */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#bf5af2] mb-3">Clinical Profile</h3>

                  <div>
                    <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted"><User size={16} /></span>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-with-icon w-full" placeholder="e.g. Dr. Arun Kumar" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-2">Specialization</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"><Stethoscope size={15} /></span>
                        <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="input-glass pl-9 w-full" placeholder="Cardiology" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-2">Availability</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"><Clock size={15} /></span>
                        <input type="text" name="availability" value={formData.availability} onChange={handleChange} className="input-glass pl-9 w-full" placeholder="Mon-Fri, 9-5" required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-2">Contact Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted"><Phone size={16} /></span>
                      <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="input-with-icon w-full" placeholder="9876543210" required />
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #bf5af2, #ff375f)', boxShadow: '0 4px 16px rgba(191,90,242,0.25)' }}
                >
                  {loading ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Provisioning...
                    </>
                  ) : (
                    <>
                      <UserCog size={18} />
                      Register Doctor
                    </>
                  )}
                </motion.button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default RegisterDoctor;

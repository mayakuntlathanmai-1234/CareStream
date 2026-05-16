import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Users, Search, RefreshCw, UserCheck, Mail, Phone } from 'lucide-react';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients');
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-theme-main dark:text-white flex items-center gap-2">
            <Users className="text-teal-400" />
            Patient Records
          </h1>
          <p className="text-slate-400 text-sm">Manage and view all registered patients in the system</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text"
              placeholder="Search patients..."
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-theme-main dark:text-white text-sm focus:outline-none focus:border-teal-500/50 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-slate-400 hover:text-theme-main dark:text-white transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-40 bg-black/5 dark:bg-white/5 rounded-lg"></div></td>
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-black/5 dark:bg-white/5 rounded-lg"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-black/5 dark:bg-white/5 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-black/5 dark:bg-white/5 rounded-full"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-20 bg-black/5 dark:bg-white/5 rounded-lg ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                          {patient.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="text-theme-main dark:text-white font-medium group-hover:text-teal-400 transition-colors">{patient.name}</p>
                          <p className="text-slate-500 text-xs">ID: #{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Mail size={12} className="text-teal-500/50" /> {patient.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Phone size={12} className="text-teal-500/50" /> {patient.contactNumber || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 uppercase">
                        {patient.gender || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-teal-400 hover:text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-400/20 hover:bg-teal-400/10 transition-all">
                        View Records
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;

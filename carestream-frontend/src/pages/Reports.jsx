import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, TrendingUp, Users, Calendar, 
  Download, Filter, ChevronDown, ArrowUpRight, 
  ArrowDownRight, PieChart as PieChartIcon, Activity,
  Video, Star
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Cell, Pie
} from 'recharts';

const Reports = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('7D');
  const [isExporting, setIsExporting] = useState(false);

  const periods = [
    { id: 'Today', label: 'Today' },
    { id: '7D', label: '7D' },
    { id: '30D', label: '30D' },
    { id: 'Quarter', label: 'Quarter' },
    { id: 'Year', label: 'Year' },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$5.2M', change: '18.4%', trend: 'up', icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-400/10', path: '/billing', subtext: 'vs last month' },
    { label: 'New Patients', value: '648', change: '12.1%', trend: 'up', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', path: '/patients', subtext: 'growth' },
    { label: 'Appointments', value: '942', change: '8.7%', trend: 'up', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10', path: '/appointments', subtext: 'this month' },
    { label: 'Video Consults', value: '156', change: '34.2%', trend: 'up', icon: Video, color: 'text-orange-400', bg: 'bg-orange-400/10', path: '/video', subtext: 'surge' },
    { label: 'Satisfaction', value: '4.9★', change: '2.1%', trend: 'up', icon: Star, color: 'text-pink-400', bg: 'bg-pink-400/10', path: '/reports', subtext: 'rating' },
  ];

  // Mock data for different periods
  const data = [
    { name: 'Mon', revenue: 4000, appointments: 24, patients: 12 },
    { name: 'Tue', revenue: 3000, appointments: 18, patients: 10 },
    { name: 'Wed', revenue: 2000, appointments: 15, patients: 8 },
    { name: 'Thu', revenue: 2780, appointments: 22, patients: 15 },
    { name: 'Fri', revenue: 1890, appointments: 12, patients: 5 },
    { name: 'Sat', revenue: 2390, appointments: 16, patients: 7 },
    { name: 'Sun', revenue: 3490, appointments: 20, patients: 11 },
  ];

  const pieData = [
    { name: 'General', value: 400, color: '#00e5ff' },
    { name: 'Surgery', value: 300, color: '#0a84ff' },
    { name: 'Cardiology', value: 200, color: '#bf5af2' },
    { name: 'Dental', value: 100, color: '#ff375f' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-theme-main flex items-center gap-2">
            <BarChart2 className="text-[#00e5ff]" />
            Analytics & Reports
          </h2>
          <p className="text-theme-muted text-sm mt-1">Monitor hospital performance and clinical trends</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector */}
          <div className="bg-black/5 dark:bg-white/5 p-1 rounded-xl flex items-center border border-black/10 dark:border-white/10 backdrop-blur-md">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === p.id 
                    ? 'bg-gradient-to-r from-[#00e5ff] to-[#0a84ff] text-white shadow-lg' 
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-theme-main text-sm font-semibold transition-all"
          >
            {isExporting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Activity size={16} />
              </motion.div>
            ) : <Download size={16} />}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(stat.path)}
            className="glass-card p-5 group hover:border-[#00e5ff]/40 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                ↑ {stat.change}
              </div>
            </div>
            <h3 className="text-theme-muted text-[10px] font-bold uppercase tracking-wider relative z-10">{stat.label}</h3>
            <p className="text-2xl font-bold text-theme-main mt-1 relative z-10">{stat.value}</p>
            <p className="text-[9px] text-theme-muted mt-1 relative z-10">{stat.subtext}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-theme-main">Revenue Trend</h3>
              <p className="text-theme-muted text-xs">Financial performance over selected period</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00e5ff]"></div>
                <span className="text-xs text-theme-muted">Revenue</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00e5ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-theme-main mb-2">Department Load</h3>
          <p className="text-theme-muted text-xs mb-8">Patient distribution by specialty</p>
          
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-theme-main">1,240</span>
              <span className="text-[10px] text-theme-muted uppercase font-bold tracking-widest">Total</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-theme-muted">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-theme-main">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-theme-main mb-6">Patient Inflow</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="patients" fill="#0a84ff" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-theme-main mb-6">Appointment Status</h3>
          <div className="space-y-6">
            {[
              { label: 'Completed', value: 85, color: 'bg-green-500' },
              { label: 'Cancelled', value: 8, color: 'bg-red-500' },
              { label: 'Rescheduled', value: 7, color: 'bg-yellow-500' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">{item.label}</span>
                  <span className="text-sm font-bold text-theme-main">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

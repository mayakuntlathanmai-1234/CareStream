import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Video, Star } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import './AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPatients: 0, totalDoctors: 0, totalAppointments: 0, totalRevenue: 0, revenueGrowth: 0, videoConsults: 0, satisfactionScore: 0 });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDateTab, setActiveDateTab] = useState('30D');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, doctorsRes] = await Promise.all([
          api.get('/admin/stats').catch(() => ({ data: {} })),
          api.get('/doctors').catch(() => ({ data: [] }))
        ]);
        setStats(prev => ({ ...prev, ...statsRes.data }));
        setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isDark = theme === 'dark';
  const tickColor = isDark ? '#5a6485' : '#7a88b0';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const tooltipBg = isDark ? '#0e1220' : '#ffffff';
  const tooltipTitle = isDark ? '#f0f4ff' : '#0d1530';
  const tooltipBody = isDark ? '#9ba8cc' : '#3a4870';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 10, padding: 14, font: { size: 11 }, color: tickColor }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        bodyFont: { family: "'Outfit', sans-serif" }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: tickColor } },
      y: { grid: { color: gridColor, lineWidth: 1 }, ticks: { font: { size: 11 }, color: tickColor } }
    }
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₹L)',
        data: [8.2, 9.1, 10.4, 11.8, 13.2, 12.7, 14.1, 15.6, 13.9, 16.2, 14.8, 17.0],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0,229,255,0.75)');
          gradient.addColorStop(1, 'rgba(0,229,255,0.15)');
          return gradient;
        },
        borderRadius: 6,
        borderSkipped: false,
        order: 2
      },
      {
        label: 'Target',
        data: [10, 10, 11, 12, 13, 13, 14, 15, 15, 16, 16, 17],
        type: 'line',
        borderColor: 'rgba(48,209,88,0.7)',
        borderWidth: 1.5,
        borderDash: [5, 4],
        pointRadius: 0,
        tension: 0.4,
        fill: false,
        order: 1
      }
    ]
  };

  const growthData = {
    labels: Array.from({ length: 14 }, (_, i) => 'W' + (i + 1)),
    datasets: [
      {
        label: 'New Patients',
        data: [12, 18, 15, 22, 19, 28, 24, 31, 27, 35, 30, 38, 34, 42],
        borderColor: '#30d158',
        borderWidth: 2,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(48,209,88,0.25)');
          gradient.addColorStop(1, 'rgba(48,209,88,0)');
          return gradient;
        },
        pointRadius: 3,
        pointBackgroundColor: '#30d158',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const donutData = {
    labels: ['OPD', 'IPD', 'Video', 'Tests'],
    datasets: [
      {
        data: [48, 31, 14, 7],
        backgroundColor: ['rgba(0,229,255,0.85)', 'rgba(48,209,88,0.8)', 'rgba(191,90,242,0.8)', 'rgba(255,214,10,0.8)'],
        borderWidth: 0,
        hoverOffset: 5
      }
    ]
  };

  const apptData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Appointments',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 18) + 22),
        backgroundColor: (context) => context.raw > 36 ? 'rgba(0,229,255,0.8)' : 'rgba(10,132,255,0.45)',
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Date Strip */}
      <div className="flex items-center gap-4 bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.09] dark:border-white/[0.09] p-2 rounded-2xl w-fit">
        <span className="text-xs font-semibold text-theme-muted px-2">Period:</span>
        <div className="flex bg-black/20 rounded-xl p-1 relative">
          {['Today', '7D', '30D', 'Quarter', 'Year'].map(t => (
            <button 
              key={t} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 relative z-10 ${activeDateTab === t ? 'text-[#00e5ff]' : 'text-theme-muted hover:text-theme-main'}`}
              onClick={() => setActiveDateTab(t)}
            >
              {activeDateTab === t && (
                <div className="absolute inset-0 bg-white/[0.08] rounded-lg border border-black/10 dark:border-white/10 shadow-[0_0_15px_rgba(0,229,255,0.15)] -z-10"></div>
              )}
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="content">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total Revenue', value: `$${(stats.totalRevenue/100000).toFixed(1)}L`, change: '18.4%', trend: 'up', icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-400/10', path: '/billing', subtext: 'vs last month' },
              { label: 'New Patients', value: stats.totalPatients, change: '12.1%', trend: 'up', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', path: '/patients', subtext: 'growth' },
              { label: 'Appointments', value: stats.totalAppointments, change: '8.7%', trend: 'up', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10', path: '/appointments', subtext: 'this month' },
              { label: 'Video Consults', value: stats.videoConsults, change: '34.2%', trend: 'up', icon: Video, color: 'text-orange-400', bg: 'bg-orange-400/10', path: '/video', subtext: 'surge' },
              { label: 'Satisfaction', value: stats.satisfactionScore + '★', change: '2.1%', trend: 'up', icon: Star, color: 'text-pink-400', bg: 'bg-pink-400/10', path: '/reports', subtext: 'rating' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(stat.path)}
                className="glass-card p-4 group hover:border-[#00e5ff]/40 transition-all cursor-pointer relative overflow-hidden h-fit"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={18} />
                  </div>
                  <div className={`flex items-center gap-1 text-[9px] font-bold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    ↑ {stat.change}
                  </div>
                </div>
                <h3 className="text-theme-muted text-[9px] font-bold uppercase tracking-wider relative z-10">{stat.label}</h3>
                <p className="text-xl font-bold text-theme-main mt-0.5 relative z-10">{stat.value}</p>
                <p className="text-[8px] text-theme-muted mt-0.5 relative z-10">{stat.subtext}</p>
              </motion.div>
            ))}
          </div>

          <div className="bento a2">
            <div className="glass-card c8">
              <div className="ch">
                <div><div className="ct">Revenue Analytics</div><div className="cs">Monthly revenue vs target — 2026</div></div>
                <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                  <span style={{fontSize:'10px',background:'rgba(0,229,255,0.12)',color:'var(--cyan)',border:'1px solid rgba(0,229,255,0.2)',padding:'3px 9px',borderRadius:'20px',fontWeight:600}}>+{stats.revenueGrowth}% MoM</span>
                  <select className="select-glass"><option>2026</option><option>2025</option></select>
                </div>
              </div>
              <div className="ca-lg"><Bar data={revenueData} options={chartOptions}/></div>
            </div>
            <div className="glass-card c4">
              <div className="ch">
                <div><div className="ct">Patient Growth</div><div className="cs">Weekly new registrations</div></div>
                <span style={{fontSize:'10px',background:'rgba(48,209,88,0.12)',color:'var(--mint)',border:'1px solid rgba(48,209,88,0.2)',padding:'3px 9px',borderRadius:'20px',fontWeight:600}}>↑ 12.1%</span>
              </div>
              <div className="ca-lg"><Line data={growthData} options={chartOptions}/></div>
            </div>
          </div>

          <div className="bento a3">
            <div className="glass-card c7">
              <div className="ch">
                <div><div className="ct">Doctor Performance</div><div className="cs">Top 5 by activity · June 2026</div></div>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/doctors'); }} style={{fontSize:'11px',color:'var(--cyan)',fontWeight:600,textDecoration:'none'}}>View all →</a>
              </div>
              <div className="doc-head">
                <div className="dh">Doctor</div><div className="dh">Patients</div>
                <div className="dh">Rating</div><div className="dh">Revenue</div><div className="dh">Tag</div>
              </div>
              {doctors.slice(0,5).map((doc, idx) => (
                <div key={doc.id} className="doc-row" onClick={() => navigate('/doctors')}>
                  <div className="dr-inf"><div className="dr-av" style={{background:idx%2==0?'rgba(255,214,10,0.15)':'rgba(48,209,88,0.15)',color:idx%2==0?'var(--amber)':'var(--mint)'}}>{doc.name?.[0]||'D'}</div><div><div className="dr-n">{doc.name}</div><div className="dr-s">{doc.specialization}</div></div></div>
                  <div className="mono">{148 - idx * 12}</div>
                  <div className="star-row"><span className="stars">★</span><span className="sval">{4.9 - idx * 0.1}</span></div>
                  <div className="rev-wrap"><div className="rev-bar-bg"><div className="rev-bar-fill" style={{width:`${95 - idx * 10}%`,background:idx===0?'linear-gradient(90deg,var(--amber),var(--cyan))':'linear-gradient(90deg,var(--cyan),var(--blue))'}}></div></div><span className="rev-label">₹{4.8 - idx * 0.5}L</span></div>
                  <span className={`badge ${idx===0?'b-top':'b-good'}`}>{idx===0?'Top':'Good'}</span>
                </div>
              ))}
            </div>

            <div className="glass-card c3" style={{display:'flex',flexDirection:'column'}}>
              <div className="ch"><div><div className="ct">Departments</div><div className="cs">Share of appointments</div></div></div>
              <div className="dept-list" style={{flex:1}}>
                {[
                  { name: 'Cardiology', color: 'var(--amber)', pct: 28, val: 148 },
                  { name: 'General', color: 'var(--mint)', pct: 25, val: 132 },
                  { name: 'Dermatology', color: 'var(--cyan)', pct: 22, val: 119 },
                  { name: 'Neurology', color: 'var(--violet)', pct: 18, val: 98 },
                  { name: 'Gynecology', color: 'var(--rose)', pct: 7, val: 37 },
                ].map(dept => (
                  <div key={dept.name} className="dept-item"><div className="d-dot" style={{background:dept.color}}></div><div className="d-name">{dept.name}</div><div className="d-bar-bg"><div className="d-bar-fill" style={{width:`${dept.pct}%`,background:dept.color}}></div></div><div className="d-n">{dept.val}</div><div className="d-p">{dept.pct}%</div></div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{gridColumn:'span 2',display:'flex',flexDirection:'column'}}>
              <div className="ch"><div className="ct">Revenue Split</div></div>
              <div className="donut-section" style={{flex:1}}>
                <div className="donut-canvas-wrap">
                  <Doughnut data={donutData} options={{responsive:false,cutout:'70%',plugins:{legend:{display:false}}}} width={115} height={115}/>
                  <div className="dc-inner"><div className="dc-val">₹17L</div><div className="dc-lbl">Total</div></div>
                </div>
                <div className="donut-legend">
                  <div className="dl-row"><div className="dl-dot" style={{background:'var(--cyan)'}}></div><div className="dl-lbl">OPD</div><div className="dl-val">48%</div></div>
                  <div className="dl-row"><div className="dl-dot" style={{background:'var(--mint)'}}></div><div className="dl-lbl">IPD</div><div className="dl-val">31%</div></div>
                  <div className="dl-row"><div className="dl-dot" style={{background:'var(--violet)'}}></div><div className="dl-lbl">Video</div><div className="dl-val">14%</div></div>
                  <div className="dl-row"><div className="dl-dot" style={{background:'var(--amber)'}}></div><div className="dl-lbl">Tests</div><div className="dl-val">7%</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento a4">
            <div className="glass-card c5">
              <div className="ch">
                <div><div className="ct">Appointment Trends</div><div className="cs">Daily bookings · last 30 days</div></div>
                <span style={{fontSize:'10px',background:'rgba(0,229,255,0.12)',color:'var(--cyan)',border:'1px solid rgba(0,229,255,0.2)',padding:'3px 9px',borderRadius:'20px',fontWeight:600}}>↑ 8.7%</span>
              </div>
              <div className="ca-md"><Bar data={apptData} options={chartOptions}/></div>
            </div>

            <div className="glass-card c4">
              <div className="ch"><div><div className="ct">Patient Regions</div><div className="cs">Top source cities</div></div></div>
              <div className="region-grid">
                {[
                  { city: 'Hyderabad', pct: 42, color: 'var(--cyan)' },
                  { city: 'Secunderabad', pct: 28, color: 'var(--mint)' },
                  { city: 'Warangal', pct: 18, color: 'var(--violet)' },
                  { city: 'Nizamabad', pct: 12, color: 'var(--amber)' }
                ].map(r => (
                  <div key={r.city} className="rg-item"><div className="rg-pct" style={{color:r.color}}>{r.pct}%</div><div className="rg-city">{r.city}</div><div className="rg-bar" style={{width:`${r.pct*2}%`,background:`linear-gradient(90deg,${r.color},transparent)`}}></div></div>
                ))}
              </div>
            </div>

            <div className="glass-card c3">
              <div className="ch">
                <div><div className="ct">Live Activity</div><div className="cs">System events</div></div>
                <span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'10px',color:'var(--rose)',fontWeight:600}}><span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--rose)',display:'inline-block'}} className="live"></span>Live</span>
              </div>
              <div>
                {[
                  { title: 'Dr. Arun Kumar marked unavailable', time: '2 min ago', type: 'Alert', dot: 'var(--rose)' },
                  { title: 'Rohit Mehta booked Video Consult', time: '8 min ago', type: 'New', dot: 'var(--amber)' },
                  { title: 'Payment received ₹1,200 — Arjun Kumar', time: '14 min ago', type: 'Paid', dot: 'var(--mint)' },
                  { title: 'Lab report uploaded — Suresh Patel', time: '31 min ago', type: 'Upload', dot: 'var(--cyan)' },
                  { title: 'Slot cancelled — Meera Iyer 2PM', time: '45 min ago', type: 'Cancel', dot: 'var(--rose)' }
                ].map((act, i) => (
                  <div key={i} className="act-item">
                    <div className="act-dot" style={{background:act.dot, boxShadow: `0 0 6px ${act.dot}`}}></div>
                    <div className="act-body"><div className="act-title">{act.title}</div><div className="act-time">{act.time}</div></div>
                    <div className="act-tag" style={{background:act.type==='Alert'?'rgba(255,55,95,0.1)':'rgba(0,229,255,0.1)',color:act.type==='Alert'?'var(--rose)':'var(--cyan)'}}>{act.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;

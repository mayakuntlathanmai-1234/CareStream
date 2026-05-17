import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Search, FileDown, CheckCircle, Clock, 
  TrendingUp, Activity, DollarSign, ArrowUpRight, Lock, Printer, X
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Billing() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Payment Modal state
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Mock Invoice Database
  const [invoices, setInvoices] = useState([
    { id: 489, name: 'Cardiology Consultation', doctor: 'Dr. Arun Kumar', date: '2026-05-15', amount: 500, status: 'PAID', type: 'Consultation', ref: 'INV-4892' },
    { id: 485, name: 'Blood Glucose & Lipid Panel', doctor: 'Dr. Arun Kumar', date: '2026-05-10', amount: 1200, status: 'PAID', type: 'Diagnostics', ref: 'INV-4859' },
    { id: 492, name: 'Diabetes Medications (Metformin, Atorvastatin)', doctor: 'Pharmacy Center', date: '2026-05-12', amount: 350, status: 'PENDING', type: 'Pharmacy', ref: 'INV-4921' },
    { id: 497, name: 'Follow-up Video Consultation', doctor: 'Dr. Arun Kumar', date: '2026-05-17', amount: 400, status: 'PENDING', type: 'Consultation', ref: 'INV-4978' },
  ]);

  const unpaidInvoices = invoices.filter(i => i.status === 'PENDING');
  const paidInvoices = invoices.filter(i => i.status === 'PAID');
  
  const totalOutstanding = unpaidInvoices.reduce((acc, i) => acc + i.amount, 0);
  const totalPaid = paidInvoices.reduce((acc, i) => acc + i.amount, 0);

  // Form handling for credit card
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-8]/gi, '');
    let matches = val.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i=0, len=match.length; i<len; i+=4) {
      parts.push(match.substring(i, i+4));
    }

    if (parts.length > 0) {
      setCardForm({ ...cardForm, number: parts.join(' ') });
    } else {
      setCardForm({ ...cardForm, number: e.target.value });
    }
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (val.length >= 2) {
      setCardForm({ ...cardForm, expiry: val.substring(0, 2) + '/' + val.substring(2, 4) });
    } else {
      setCardForm({ ...cardForm, expiry: val });
    }
  };

  // Pay invoice simulated gateway
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (cardForm.number.length < 15 || cardForm.name.length < 3 || cardForm.expiry.length < 5 || cardForm.cvv.length < 3) {
      toast.warn('Please fill in complete credit card details');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Update invoice status in local state
      setInvoices(prev => prev.map(inv => inv.id === payingInvoice.id ? { ...inv, status: 'PAID' } : inv));
      toast.success(`Payment of ₹${payingInvoice.amount} processed successfully! Receipt generated.`);
      setPayingInvoice(null);
      setCardForm({ number: '', name: '', expiry: '', cvv: '' });
    }, 2800);
  };

  const filteredInvoices = invoices.filter(i => {
    if (activeTab === 'paid') return i.status === 'PAID';
    if (activeTab === 'pending') return i.status === 'PENDING';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-main dark:text-white flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ffd60a]/15 text-[#ffd60a] shadow-[0_0_15px_rgba(255,214,10,0.15)]">
              <CreditCard size={22} />
            </div>
            Billing & Invoices
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage hospital consultation invoices, pharmacy orders, lab reports bills and pay securely online.</p>
        </div>
      </div>

      {/* Bento Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Outstanding */}
        <div className="glass-card p-6 group hover:border-[#ffd60a]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#ffd60a]/5 to-transparent rounded-full filter blur-lg pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Outstanding</span>
            <div className="p-2 bg-[#ff375f]/15 text-[#ff375f] rounded-xl"><Clock size={16} /></div>
          </div>
          <h2 className="text-3xl font-extrabold text-theme-main dark:text-white">₹{totalOutstanding}</h2>
          <p className="text-slate-500 text-xs mt-1.5">{unpaidInvoices.length} invoices require immediate payment</p>
        </div>

        {/* Total Paid */}
        <div className="glass-card p-6 group hover:border-[#30d158]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#30d158]/5 to-transparent rounded-full filter blur-lg pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paid Invoices</span>
            <div className="p-2 bg-[#30d158]/15 text-[#30d158] rounded-xl"><CheckCircle size={16} /></div>
          </div>
          <h2 className="text-3xl font-extrabold text-theme-main dark:text-white">₹{totalPaid}</h2>
          <p className="text-slate-500 text-xs mt-1.5">Thank you for regular billing compliance</p>
        </div>

        {/* Spend Category Breakdown */}
        <div className="glass-card p-6 group hover:border-[#00e5ff]/30 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00e5ff]/5 to-transparent rounded-full filter blur-lg pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Spend Share</span>
              <span className="text-[10px] text-green-400 font-bold flex items-center gap-0.5"><TrendingUp size={10} /> Analytics</span>
            </div>
            {/* Split progress lines */}
            <div className="space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between text-theme-muted mb-0.5">
                  <span>Diagnostics</span>
                  <span className="font-bold text-theme-main dark:text-white">₹1,200 (49%)</span>
                </div>
                <div className="w-full bg-black/10 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00e5ff] h-full rounded-full" style={{ width: '49%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-theme-muted mb-0.5">
                  <span>Consultations</span>
                  <span className="font-bold text-theme-main dark:text-white">₹900 (37%)</span>
                </div>
                <div className="w-full bg-black/10 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#bf5af2] h-full rounded-full" style={{ width: '37%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Section Layout */}
      <div className="glass-card p-5">
        {/* Table Filters */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 mb-4">
          <div className="flex bg-black/20 rounded-xl p-1 relative">
            {[
              { id: 'all', label: 'All Invoices' },
              { id: 'pending', label: 'Pending' },
              { id: 'paid', label: 'Paid' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 relative ${activeTab === tab.id ? 'text-[#ffd60a]' : 'text-theme-muted hover:text-theme-main'}`}
              >
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-white/[0.08] rounded-lg border border-black/10 dark:border-white/10 shadow-[0_0_15px_rgba(255,214,10,0.15)] -z-10"></div>
                )}
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-theme-muted font-medium">{filteredInvoices.length} invoices total</span>
        </div>

        {/* Invoice Grid/Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-glass">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice / Ref</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Service Details</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Provider</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-4 text-xs font-bold text-slate-500 tracking-wider">
                    {inv.ref}
                    <p className="text-[10px] text-slate-500 font-medium">{new Date(inv.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-theme-main dark:text-white text-sm">{inv.name}</p>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{inv.type}</p>
                  </td>
                  <td className="px-4 py-4 text-xs text-theme-muted font-medium">
                    {inv.doctor}
                  </td>
                  <td className="px-4 py-4 text-sm font-extrabold text-theme-main dark:text-white">
                    ₹{inv.amount}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${inv.status === 'PAID' ? 'bg-[#30d158]/12 text-[#30d158] border-[#30d158]/20' : 'bg-[#ff375f]/12 text-[#ff375f] border-[#ff375f]/20'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Download Receipt"
                      >
                        <FileDown size={13} />
                      </button>
                      {inv.status === 'PENDING' && (
                        <button 
                          onClick={() => setPayingInvoice(inv)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffd60a]/10 hover:bg-[#ffd60a]/20 border border-[#ffd60a]/20 hover:border-[#ffd60a]/40 text-[#ffd60a] rounded-lg text-xs font-bold transition-all"
                        >
                          <CreditCard size={12} />
                          <span>Pay Now</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Card Payment Modal */}
      <AnimatePresence>
        {payingInvoice && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative flex flex-col p-6 space-y-6"
              style={{ background: 'linear-gradient(135deg, rgba(20,28,48,0.95) 0%, rgba(10,15,28,0.98) 100%)' }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setPayingInvoice(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X size={14} />
              </button>

              {/* Title & Info */}
              <div className="text-center pt-2">
                <h3 className="text-lg font-bold text-white tracking-wide">Secure Hospital Gateway</h3>
                <p className="text-xs text-slate-400 mt-1">Paying <span className="font-bold text-[#ffd60a]">{payingInvoice.name}</span></p>
                <p className="text-2xl font-black text-white mt-1.5">₹{payingInvoice.amount}</p>
              </div>

              {/* 3D Glassmorphic Credit Card Mockup */}
              <div className="flex justify-center">
                <div className="w-72 h-44 relative perspective-1000">
                  <motion.div 
                    className="w-full h-full rounded-2xl p-5 shadow-2xl relative preserve-3d transition-transform duration-700 cursor-pointer flex flex-col justify-between"
                    style={{ 
                      transform: isCvvFocused ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      background: 'linear-gradient(135deg, rgba(0,229,255,0.2) 0%, rgba(191,90,242,0.2) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.15)'
                    }}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-slate-300 font-bold">Secure Card</p>
                          <h4 className="text-sm font-bold text-white tracking-wider font-display">CareStream Pay</h4>
                        </div>
                        <div className="w-10 h-7 bg-white/10 rounded-md border border-white/10 flex items-center justify-center font-bold text-slate-300 text-[10px]">VISA</div>
                      </div>
                      
                      {/* Card Number */}
                      <p className="text-base font-black tracking-[0.18em] text-white my-3 font-mono">
                        {cardForm.number || '•••• •••• •••• ••••'}
                      </p>

                      {/* Card Holder & Expiry */}
                      <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-300 font-semibold">
                        <div>
                          <p className="text-[7px] text-slate-400 font-medium">Card Holder</p>
                          <p className="font-bold text-white truncate max-w-[140px] mt-0.5">{cardForm.name || 'Your Full Name'}</p>
                        </div>
                        <div>
                          <p className="text-[7px] text-slate-400 font-medium">Expires</p>
                          <p className="font-bold text-white mt-0.5">{cardForm.expiry || 'MM/YY'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden rotate-y-180">
                      <div className="w-full bg-slate-950 h-8 -mx-5 mt-2" />
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[7px] uppercase tracking-widest text-slate-400 font-bold">
                          <span>Secure Signature</span>
                          <span>CVV</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 h-7 rounded border border-white/5 flex items-center px-2 text-[10px] text-slate-300 font-mono italic">CareStream Verified</div>
                          <div className="w-10 bg-white text-slate-900 h-7 rounded flex items-center justify-center font-extrabold text-xs font-mono shadow-inner">
                            {cardForm.cvv || '•••'}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[7px] tracking-wide text-slate-400 mt-2 font-medium">
                        <span>AUTHORIZED SIGNATURE</span>
                        <span>CS GATEWAY v2.6</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Payment Card Forms */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs relative">
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20 space-y-3 border border-white/5">
                    <div className="w-10 h-10 border-4 border-[#ffd60a] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-xs font-bold tracking-wide animate-pulse">Contacting Bank Gateway...</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><Lock size={10} /> Secure End-to-End Handshake</p>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card Holder Name</label>
                  <input
                    type="text"
                    required
                    value={cardForm.name}
                    onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
                    onFocus={() => setIsCvvFocused(false)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-[#ffd60a]/50"
                    placeholder="e.g. Rohith Sharma"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    value={cardForm.number}
                    onChange={handleCardNumberChange}
                    onFocus={() => setIsCvvFocused(false)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-[#ffd60a]/50"
                    placeholder="4000 1234 5678 9010"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      maxLength="5"
                      value={cardForm.expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setIsCvvFocused(false)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-[#ffd60a]/50"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CVV Code</label>
                    <input
                      type="password"
                      required
                      maxLength="3"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({...cardForm, cvv: e.target.value.replace(/[^0-9]/gi, '')})}
                      onFocus={() => setIsCvvFocused(true)}
                      onBlur={() => setIsCvvFocused(false)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-[#ffd60a]/50"
                      placeholder="•••"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ffd60a] to-[#ffb700] text-slate-900 font-bold hover:shadow-[0_0_20px_rgba(255,214,10,0.35)] transition-all flex items-center justify-center gap-1.5 mt-3"
                >
                  <Lock size={12} /> Pay Outstanding ₹{payingInvoice.amount}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Detail / Receipt Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white text-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col"
            >
              {/* Paper Top Design Accent */}
              <div className="bg-gradient-to-r from-[#ffd60a] to-[#ffb700] h-3 w-full" />
              
              {/* Official Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Care<span className="text-[#ffd60a]">Stream</span>
                  </h2>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Billing Receipt & Summary</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">CareStream Finance Ltd</p>
                  <p className="text-[9px] text-slate-500">Secunderabad, TS</p>
                  <p className="text-[9px] text-[#30d158] font-bold mt-1 uppercase">✓ PAID RECEIPT</p>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="p-6 space-y-4 flex-1">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium">Billed To</p>
                    <p className="font-bold text-slate-800 mt-0.5">CareStream Patient</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Payment Date</p>
                    <p className="font-bold text-slate-800 mt-0.5">{new Date(selectedInvoice.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Transaction Reference</p>
                    <p className="font-bold text-[#ffd60a] mt-0.5">{selectedInvoice.ref}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Status</p>
                    <p className={`font-bold mt-0.5 ${selectedInvoice.status === 'PAID' ? 'text-green-500' : 'text-red-500'}`}>{selectedInvoice.status}</p>
                  </div>
                </div>

                {/* Items breakdown */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Invoice Summary</p>
                  <div className="space-y-2 border-b border-slate-100 pb-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{selectedInvoice.name}</span>
                      <span>₹{selectedInvoice.amount}.00</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 italic">
                      <span>Assigned Provider: {selectedInvoice.doctor}</span>
                      <span>1 Unit</span>
                    </div>
                  </div>
                </div>

                {/* Fees calculation */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{selectedInvoice.amount}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Hospital Service Tax (0%)</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 text-sm pt-1 border-t border-dashed border-slate-100">
                    <span>Total Amount Billed</span>
                    <span className="text-[#ffd60a] font-extrabold text-base">₹{selectedInvoice.amount}.00</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp & Buttons */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-center relative">
                  <div className="absolute inset-0 bg-green-400/5 border border-green-400/20 rounded-full scale-125 -rotate-12 flex items-center justify-center font-bold text-[8px] uppercase tracking-wider text-green-500">Finance Verified</div>
                  <p className="font-serif italic text-xs text-slate-700 relative z-10 pt-1">CareStream Billing</p>
                  <div className="w-16 h-[1px] bg-slate-400 mx-auto mt-0.5" />
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Clearing Office</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors text-xs font-bold"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => { window.print(); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd60a] to-[#ffb700] text-slate-900 hover:shadow-lg transition-all text-xs font-bold"
                  >
                    <Printer size={13} />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

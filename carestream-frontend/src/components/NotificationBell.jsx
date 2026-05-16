import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertCircle, Clock, X } from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { client, connected } = useWebSocket();
  const dropdownRef = useRef(null);

  // We are tapping into the WebSocket client directly to add a second subscription for the dropdown,
  // or we can just listen to the same topic. Actually, since WebSocketContext already shows toasts,
  // we'll just listen to the same events by capturing them.
  // For simplicity, we'll listen globally here as well.
  useEffect(() => {
    if (!connected || !client) return;

    // We can't easily multi-subscribe to the exact same queue without tracking in Context,
    // so we'll just let this component independently subscribe as well for the dropdown list.
    const subs = [];
    
    subs.push(
      client.subscribe('/topic/notifications', (msg) => {
        const data = JSON.parse(msg.body);
        addNotification(data);
      })
    );

    // If we wanted user-specific ones we'd need the username here too.
    
    return () => {
      subs.forEach(s => s.unsubscribe());
    };
  }, [client, connected]);

  const addNotification = (data) => {
    setNotifications(prev => [data, ...prev].slice(0, 20)); // Keep last 20
    if (!isOpen) setUnreadCount(prev => prev + 1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  const clearAll = () => setNotifications([]);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className="relative p-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-glass backdrop-blur-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <Bell size={20} className="text-theme-main dark:text-slate-200" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-teal-500 rounded-full text-[10px] font-bold text-white border border-teal-400"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 right-0 w-80 max-h-[400px] flex flex-col glass-card border border-black/10 dark:border-white/10 overflow-hidden shadow-2xl z-[60]"
          >
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h3 className="font-semibold text-theme-main dark:text-white">Notifications</h3>
              <button onClick={clearAll} className="text-xs text-slate-400 hover:text-teal-400 transition-colors">
                Clear All
              </button>
            </div>

            <div className="overflow-y-auto flex-1 hide-scrollbar max-h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                  <Bell size={24} className="opacity-20" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-4 border-b border-white/5 hover:bg-black/[0.03] dark:bg-white/[0.03] transition-colors flex gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-full h-fit flex-shrink-0 ${
                        n.type === 'SUCCESS' ? 'bg-green-500/20 text-green-400' :
                        n.type === 'WARNING' ? 'bg-amber-500/20 text-amber-400' :
                        n.type === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {n.type === 'SUCCESS' ? <CheckCircle size={14} /> :
                         n.type === 'ERROR' ? <AlertCircle size={14} /> :
                         <Info size={14} />}
                      </div>
                      <div>
                        <p className="text-sm text-theme-main dark:text-slate-200 leading-tight">{n.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

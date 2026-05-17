import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Mesh Background */}
      <div className="mesh-bg"></div>

      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <motion.main
        key="main-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 lg:ml-64 ml-0 p-4 md:p-8 relative z-10 min-h-screen"
      >
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="max-w-[1400px] mx-auto px-2 md:px-8 pb-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;

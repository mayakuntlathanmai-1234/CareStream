import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Mesh Background */}
      <div className="mesh-bg"></div>

      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Mobile Sidebar Backdrop Overlay - z-30 so sidebar z-40 sits on top */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <motion.main
        key="main-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 lg:ml-64 ml-0 relative z-10 min-h-screen overflow-x-hidden"
      >
        <div className="p-4 md:p-8">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="max-w-[1400px] mx-auto pb-8">
            <Outlet />
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;

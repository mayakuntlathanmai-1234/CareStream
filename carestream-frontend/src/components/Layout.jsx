import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Mesh Background */}
      <div className="mesh-bg"></div>

      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <Sidebar />

      <motion.main
        key="main-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 ml-64 p-8 relative z-10 min-h-screen"
      >
        <Navbar />
        <div className="max-w-[1400px] mx-auto px-8 pb-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;

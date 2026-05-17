import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import MedicalRecords from './pages/MedicalRecords';
import DoctorsList from './pages/DoctorsList';
import MyAppointments from './pages/MyAppointments';
import VideoConsultation from './pages/VideoConsultation';
import AiChat from './pages/AiChat';
import PatientsList from './pages/PatientsList';
import Reports from './pages/Reports';
import Home from './pages/Home';
import RegisterDoctor from './pages/RegisterDoctor';
import { useAuth } from './context/AuthContext';

const ComingSoon = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h2 className="text-2xl font-bold text-theme-main mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
    <p className="text-theme-muted mb-6">This feature is coming soon. We're working hard to bring it to you!</p>
    <div className="px-5 py-2 bg-[#00e5ff]/10 border border-[#00e5ff]/20 rounded-full text-[#00e5ff] text-sm font-medium">🚧 Under Construction</div>
  </div>
);

const DashboardRedirect = () => {
  const { hasRole } = useAuth();
  if (hasRole('ADMIN')) return <Navigate to="/admin/dashboard" />;
  if (hasRole('DOCTOR')) return <DoctorDashboard />;
  if (hasRole('PATIENT')) return <PatientDashboard />;
  return <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WebSocketProvider>
          <BrowserRouter>
            <ToastContainer />
            <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/register-doctor" element={
              <ProtectedRoute role="ADMIN">
                <RegisterDoctor />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            } />
            <Route path="/appointments/book" element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            } />
            <Route path="/medical-records" element={
              <ProtectedRoute>
                <MedicalRecords />
              </ProtectedRoute>
            } />
            <Route path="/medical-records/:patientId" element={
              <ProtectedRoute>
                <MedicalRecords />
              </ProtectedRoute>
            } />
            <Route path="/doctors" element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><PatientsList /></ProtectedRoute>} />
            <Route path="/video" element={<ProtectedRoute><VideoConsultation /></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
            {/* Placeholder routes */}
            <Route path="/prescriptions" element={<ProtectedRoute><ComingSoon title="Prescriptions" icon="💊" /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><ComingSoon title="Billing" icon="💳" /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><ComingSoon title="My Patients" icon="🩺" /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><ComingSoon title="Profile Settings" icon="⚙️" /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </BrowserRouter>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

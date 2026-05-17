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
import Prescriptions from './pages/Prescriptions';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import { useAuth } from './context/AuthContext';

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
            {/* New real routes replacing placeholders */}
            <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
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

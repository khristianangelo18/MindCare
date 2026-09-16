import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLogin } from './pages/AdminLogin';
import { AdminRegister } from './pages/AdminRegister';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { PreAssessment } from './pages/PreAssessment';
import { Dashboard } from './pages/Dashboard';
import { Assessment } from './pages/Assessment';
import { AssessmentHistory } from './pages/AssessmentHistory';
import { AssessmentReport } from './pages/AssessmentReport';
import { Recommendations } from './pages/Recommendations';
import { BookAppointment } from './pages/BookAppointment';
import { MyAppointments } from './pages/MyAppointments';
import { SpecialistDashboard } from './pages/SpecialistDashboard';
import { SpecialistProfile } from './pages/SpecialistProfile';
import { EditSpecialistProfile } from './pages/EditSpecialistProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { FAQ } from './pages/FAQ';
import { Resources } from './pages/Resources';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/pre-assessment" element={<PreAssessment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Authenticated Application Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/assessment/history" element={<AssessmentHistory />} />
              <Route path="/assessment/report" element={<AssessmentReport />} />
              <Route path="/assessment/report/:id" element={<AssessmentReport />} />
              <Route path="/assessment-report" element={<AssessmentReport />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/appointments" element={<MyAppointments />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/resources" element={<Resources />} />

              {/* Specialist / Admin specific routes */}
              <Route
                path="/specialist/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Specialist', 'Admin']}>
                    <SpecialistDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/specialist/profile"
                element={
                  <ProtectedRoute allowedRoles={['Specialist', 'Admin']}>
                    <SpecialistProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/specialist/edit-profile"
                element={
                  <ProtectedRoute allowedRoles={['Specialist', 'Admin']}>
                    <EditSpecialistProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

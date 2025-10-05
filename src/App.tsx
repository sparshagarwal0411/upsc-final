import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import FloatingButtons from './components/FloatingButtons';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExamsPage from './pages/ExamsPage';
import NotificationsPage from './pages/NotificationsPage';
import PastPapersPage from './pages/PastPapersPage';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AIStudyAssistancePage from './pages/AIStudyAssistancePage';
import FakeLogin from './pages/FakeLogin';
import FakeLogin2 from './pages/FakeLogin2';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <AccessibilityProvider>
              <NotificationProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
                  <Navbar />
                  <main className="container mx-auto px-4 py-8">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/exams" element={<ExamsPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/past-papers" element={<PastPapersPage />} />
                      <Route path="/resources" element={<ResourcesPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/fake-login" element={<FakeLogin />} />
                      <Route path="/student-login" element={<FakeLogin2 />} />
                      
                      {/* Protected Routes */}
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <ProtectedRoute>
                            <SettingsPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/application-status" 
                        element={
                          <ProtectedRoute>
                            <ApplicationStatusPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/ai-study-assistance" 
                        element={
                          <ProtectedRoute>
                            <AIStudyAssistancePage />
                          </ProtectedRoute>
                        } 
                      />
                    </Routes>
                  </main>
                  <Footer />
                </div>
                <FloatingButtons />
                <Chatbot />
              </NotificationProvider>
            </AccessibilityProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
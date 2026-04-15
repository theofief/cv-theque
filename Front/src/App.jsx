import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import StudentProfilePage from './pages/StudentProfilePage'
import LegalPage from './pages/LegalPage'
import PrivacyPage from './pages/PrivacyPage'
import ContactPage from './pages/ContactPage'
import AuthPage from './pages/AuthPage'
import SchoolPage from './pages/SchoolPage'
import CompanyPage from './pages/CompanyPage'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="/students/:studentId" element={<StudentProfilePage />} />
            <Route path="/schools/:schoolName" element={<SchoolPage />} />
            <Route path="/companies/:companyName" element={<CompanyPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

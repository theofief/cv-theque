import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStoreProvider } from './context/AppStore'
import AppLayout from './layout/AppLayout'
import HomePage from './pages/HomePage'
import ProfileDashboardPage from './pages/ProfileDashboardPage'
import './App.css'

function App() {
  return (
    <AppStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfileDashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppStoreProvider>
  )
}

export default App

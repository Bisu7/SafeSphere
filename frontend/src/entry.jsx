import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css'

// Layout & Context
import ThemeProvider from './components/ThemeContext'
import MainLayout from "./pages/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import ScamDetection from "./pages/ScamDetection";
import PrivacyMonitor from "./pages/PrivacyMonitor";
import FinancialRisk from "./pages/FinancialRisk";
import SecurityAdvisor from "./pages/SecurityAdvisor";
import InstallExtension from "./pages/InstallExtension";
import Login from "./pages/Login";

function SafeSphereApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scam" element={<ScamDetection />} />
            <Route path="/privacy" element={<PrivacyMonitor />} />
            <Route path="/financial" element={<FinancialRisk />} />
            <Route path="/advisor" element={<SecurityAdvisor />} />
            <Route path="/extension" element={<InstallExtension />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <SafeSphereApp />
    </ThemeProvider>
  </StrictMode>,
)

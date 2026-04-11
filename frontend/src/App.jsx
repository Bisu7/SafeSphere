import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Dashboard from "./pages/Dashboard";
import ScamDetection from "./pages/ScamDetection";
import PrivacyMonitor from "./pages/PrivacyMonitor";
import FinancialRisk from "./pages/FinancialRisk";
import SecurityAdvisor from "./pages/SecurityAdvisor";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
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
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
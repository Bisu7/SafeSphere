import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Dashboard from "./pages/Dashboard";
import ScamDetection from "./pages/ScamDetection";
import PrivacyMonitor from "./pages/PrivacyMonitor";
import FinancialRisk from "./pages/FinancialRisk";
import SecurityAdvisor from "./pages/SecurityAdvisor";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/scam" element={<ScamDetection />} />
          <Route path="/privacy" element={<PrivacyMonitor />} />
          <Route path="/financial" element={<FinancialRisk />} />
          <Route path="/advisor" element={<SecurityAdvisor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
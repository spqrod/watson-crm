import { Route, Routes, useLocation } from "react-router-dom";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Header from "./components/Header";
import "./styles/variables.css";
import "./styles/global.css";

function App() {

  const location = useLocation();

  return (
    <div>
      { location.pathname === "/login" ? null : <Header /> }
      <Routes>
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

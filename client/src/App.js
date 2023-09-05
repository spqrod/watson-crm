import { Route, Routes } from "react-router-dom";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Header from "./components/Header";
import "./styles/variables.css";
import "./styles/global.css";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;

import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Header from "./components/Header";
import "./styles/variables.css";
import "./styles/global.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {

  const location = useLocation();
  const navigate = useNavigate();

    const api = {
      checkAuthorization() {
        const fetchURL = "/authorization";
        return fetch(fetchURL);
      },
    };

    const controller = {
      checkAuthorization() {
        api.checkAuthorization()
            .then(res => {
              console.log(res.status);
                if ((res.status === 401) || (res.status === 403))
                  navigate("/login");
            });
        },
    };

  useEffect(() => {
    controller.checkAuthorization();
  }, [location.pathname]);

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
        <Route path="/*" element={<Navigate to="/login"/>}/>
      </Routes>
    </div>
  );
}

export default App;

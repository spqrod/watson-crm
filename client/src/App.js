import { Route, Routes } from "react-router-dom";
import Appointments from "./pages/Appointments";
// import Patients from "./pages/Patients";
import Header from "./components/Header";
import "./styles/variables.css";
import "./styles/global.css";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/appointments" element={<Appointments />} />
        {/* <Route path="/patients" element={<Patients />} /> */}
      </Routes>
    </div>
  );
}

export default App;

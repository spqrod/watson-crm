import { Route, Routes } from "react-router-dom";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </div>
  );
}

export default App;

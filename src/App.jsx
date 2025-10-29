import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ServiciosPage from "./pages/ServiciosPage";
import HabitacionesPage from "./pages/HabitacionesPage";
import ContactoPage from "./pages/ContactoPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Registro";
import PanelOperador from "./operador/PanelOperador";
import PanelAdmin from "./admin/PanelAdmin"; // 🔹 Importamos PanelAdmin

function App() {
  const location = useLocation();

  // Ocultar navbar si estamos en panel de operador o admin
  const esPanelOperador = location.pathname.startsWith("/operador");
  const esPanelAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="bg-black min-h-screen text-white">
      {!esPanelOperador && !esPanelAdmin && <Navbar />}

      <div className={esPanelOperador || esPanelAdmin ? "" : "pt-20"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/habitaciones" element={<HabitacionesPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔹 Panel del operador */}
          <Route path="/operador/*" element={<PanelOperador />} />

          {/* 🔹 Panel del administrador */}
          <Route path="/admin/*" element={<PanelAdmin />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

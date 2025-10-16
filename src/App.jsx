import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ServiciosPage from "./pages/ServiciosPage";
import HabitacionesPage from "./pages/HabitacionesPage";
import ContactoPage from "./pages/ContactoPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Registro";
import PanelOperador from "./operador/PanelOperador";

function App() {
  const location = useLocation();

  // Si la ruta empieza con "/operador", no se muestra el navbar del cliente
  const esPanelOperador = location.pathname.startsWith("/operador");

  return (
    <div className="bg-black min-h-screen text-white">
      {!esPanelOperador && <Navbar />}

      <div className={esPanelOperador ? "" : "pt-20"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/habitaciones" element={<HabitacionesPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔹 Panel del operador */}
          <Route path="/operador/*" element={<PanelOperador />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

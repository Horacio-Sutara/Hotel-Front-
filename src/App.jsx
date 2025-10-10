import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ServiciosPage from "./pages/ServiciosPage";
import HabitacionesPage from "./pages/HabitacionesPage";
import ContactoPage from "./pages/ContactoPage";
import LoginPage from "./pages/Login"; // 🔹 nueva página
import RegisterPage from "./pages/Registro"; // 🔹 nueva página

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/habitaciones" element={<HabitacionesPage />} />
          <Route path="/contacto" element={<ContactoPage />} />

          {/* 🔹 nuevas rutas para login y registro */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";
import MapaDeHabitaciones from "./MapaDeHabitaciones";
import Reservas from "./Reservas";
import AbrirCerrar from "./AbrirCerrar";
import Pagos from "./Pagos";
import Mails from "./Mails";

export default function PanelOperador() {
  const [user, setUser] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🔹 Barra superior */}
      <header className="flex justify-between items-center bg-zinc-900 px-8 py-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Hotel Ramolia</h1>

        <h2 className="text-lg text-gray-400">Panel de Operador</h2>

        {/* Icono de perfil */}
        <div className="relative">
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <User className="text-black w-5 h-5" />
          </button>

          {/* Ventana emergente */}
          {mostrarMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-4 text-gray-300 z-50">
              <p className="text-sm mb-1">
                <span className="font-semibold text-white">Usuario:</span>{" "}
                {user?.username}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold text-white">Email:</span>{" "}
                {user?.email}
              </p>
              <p className="text-sm mb-3">
                <span className="font-semibold text-white">Tipo:</span> Operador
              </p>

              <div className="flex justify-between mt-2">
                <button
                  onClick={() => setMostrarMenu(false)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 🔹 Barra de navegación interna */}
      <nav className="flex justify-center bg-zinc-800 py-3 text-gray-400 text-sm font-medium">
        <ul className="flex gap-8">
          <li>
            <Link
              to="/operador/mapa"
              className="hover:text-white transition-colors duration-200"
            >
              Mapa de Habitaciones
            </Link>
          </li>
          <li>
            <Link
              to="/operador/reservas"
              className="hover:text-white transition-colors duration-200"
            >
              Reservas
            </Link>
          </li>
          <li>
            <Link
              to="/operador/abrir-cerrar"
              className="hover:text-white transition-colors duration-200"
            >
              Abrir / Cerrar
            </Link>
          </li>
          <li>
            <Link
              to="/operador/pagos"
              className="hover:text-white transition-colors duration-200"
            >
              Pagos
            </Link>
          </li>
          <li>
            <Link
              to="/operador/mails"
              className="hover:text-white transition-colors duration-200"
            >
              Mails
            </Link>
          </li>
        </ul>
      </nav>

      {/* 🔹 Contenido dinámico */}
      <main className="p-8 text-gray-300">
        <Routes>
          <Route path="mapa" element={<MapaDeHabitaciones />} />
          <Route path="reservas" element={<Reservas />} />
          <Route path="abrir-cerrar" element={<AbrirCerrar />} />
          <Route path="pagos" element={<Pagos />} />
          <Route path="mails" element={<Mails />} />
        </Routes>
      </main>
    </div>
  );
}

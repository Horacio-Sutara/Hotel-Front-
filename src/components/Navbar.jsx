import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

const Navbar = () => {
  const navLinkClass =
    "text-gray-300 hover:text-white transition-colors duration-200";

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUser(null);
    setMostrarMenu(false);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md z-50 shadow-md">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Hotel Ramolia
        </Link>

        {/* Links de navegación */}
        <ul className="flex gap-6 text-sm font-medium items-center">
          <li>
            <NavLink to="/" className={navLinkClass}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/servicios" className={navLinkClass}>
              Servicios
            </NavLink>
          </li>
          <li>
            <NavLink to="/habitaciones" className={navLinkClass}>
              Reservas
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacto" className={navLinkClass}>
              Contacto
            </NavLink>
          </li>

          {/* Botón de Mis Reservas (solo si hay usuario) */}
          {user && (
            <li>
              <button
                onClick={() => navigate("/mis-reservas")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Mis Reservas
              </button>
            </li>
          )}

          {/* Botón de Panel (solo si hay usuario) */}
{user && (user.tipo === "ADMINISTRADOR" || user.tipo === "OPERADOR") && (
  <li>
    <button
      onClick={() =>
        navigate(
          user.tipo === "ADMINISTRADOR"
            ? "/admin/habitaciones"
            : "/operador/mapa"
        )
      }
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
    >
      {user.tipo === "ADMINISTRADOR"
        ? "Panel administrador"
        : "Panel operador"}
    </button>
  </li>
)}

          {/* Si no hay usuario, mostrar botón de inicio de sesión */}
          {!user && (
            <li>
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
              >
                Iniciar sesión
              </button>
            </li>
          )}

          {/* Si hay usuario, mostrar ícono */}
          {user && (
            <li className="relative">
              <button
                onClick={() => setMostrarMenu(!mostrarMenu)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <User className="text-black w-5 h-5" />
              </button>

              {/* Menú desplegable */}
              {mostrarMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-4 text-gray-300">
                  <p className="text-sm mb-1">
                    <span className="font-semibold text-white">Nombre:</span>{" "}
                    {user.nombre}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold text-white">Email:</span>{" "}
                    {user.email}
                  </p>
                  <p className="text-sm mb-3">
                    <span className="font-semibold text-white">Tipo:</span>{" "}
                    {user.tipo}
                  </p>

                  <div className="flex justify-between">
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
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

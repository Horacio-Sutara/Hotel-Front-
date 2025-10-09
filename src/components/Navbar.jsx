import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const navLinkClass =
    "text-gray-300 hover:text-white transition-colors duration-200";

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md z-50 shadow-md">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Hotel Ramolia
        </Link>
        <ul className="flex gap-6 text-sm font-medium">
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
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

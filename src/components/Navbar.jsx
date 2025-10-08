import { useState } from "react";
import UsuarioIcono from "./UsuarioIcono";

export default function Navbar({ onLoginClick, usuario, onCambiarUsuario }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo-bloque">
        <div className="logo">Hotel Ramolia</div>
        {usuario ? (
          <UsuarioIcono usuario={usuario} onCambiarUsuario={onCambiarUsuario} />
        ) : (
          <button className="btn-login" onClick={onLoginClick}>
            Iniciar sesión
          </button>
        )}
      </div>

      {/* Botón hamburguesa */}
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      <nav className={`nav-links ${isOpen ? "open" : ""}`}>
        <a href="#inicio">Inicio</a>
        <a href="#ubicacion">¿Dónde estamos?</a>
        <a href="#habitaciones">Habitaciones</a>
        <a href="#servicios">Servicios</a>
        <a href="#contacto">Contacto</a>
      </nav>
    </header>
  );
}

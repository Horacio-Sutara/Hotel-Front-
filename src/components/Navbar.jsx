import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo-bloque">
        <div className="logo">Hotel Ramolia</div>
        <button className="btn-login" onClick={onLoginClick}>
          Iniciar sesión
        </button>
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

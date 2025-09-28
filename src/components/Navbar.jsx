import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo">Hotel Ramolia</div>
      <nav className={open ? "nav open" : "nav"}>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Habitaciones</a></li>
          <li><a href="#">Servicios</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </nav>
      <button className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </button>
    </header>
  );
}

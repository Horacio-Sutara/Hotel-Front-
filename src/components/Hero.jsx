import "./Hero.css";
import hotelImage from "../assets/Hotel.jpeg"; // aquí va la foto del hotel
import MensajeDeInicioSesion from "./MensajeDeInicioSesion";
import { useState } from "react";

export default function Hero({ onReservaClick, usuario }) {
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  function handleReservaClick() {
    if (!usuario) {
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 2500);
      return;
    }
    if (onReservaClick) onReservaClick();
  }

  return (
    <section className="hero">
      <div className="hero-image">
        <img src={hotelImage} alt="Hotel Ramolia" />
      </div>
      <div className="hero-text">
        <h1>Bienvenidos al Hotel Ramolia</h1>
        <p>
          “Un refugio de tranquilidad donde cada detalle está pensado para tu bienestar.”
        </p>
        <button className="btn-reserva" onClick={handleReservaClick}>Empezar una reservación</button>
        <MensajeDeInicioSesion mostrar={mostrarMensaje} />
      </div>
    </section>
  );
}

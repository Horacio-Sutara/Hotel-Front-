import { useState } from "react";
import habitacionEstandar from "../assets/Habitacion Estandar.jpg";
import habitacionDeluxe from "../assets/Habitacion Deluxe.jpeg";
import './Habitaciones.css';
export default function Habitaciones() {
  const [tipo, setTipo] = useState("estandar");

  const habitaciones = {
    estandar: {
      nombre: "Habitación Estándar",
      img: habitacionEstandar,
      cama: "Cama Queen",
      caracteristicas: [
        "Habitación de 25 m² con vista interior.",
        "Aire acondicionado y calefacción.",
        "Televisión de 32\" con cable.",
        "Wi-Fi gratuito.",
      ],
      detalles: [
        "Baño privado con ducha.",
        "Armario, escritorio y silla.",
        "Teléfono con llamadas locales.",
        "Servicio de limpieza diario.",
      ],
      servicios: [
        "Acceso al gimnasio.",
        "Servicio a la habitación limitado.",
        "Resguardo de equipaje.",
      ],
    },
    deluxe: {
      nombre: "Habitación Deluxe",
      img: habitacionDeluxe,
      cama: "Cama King",
      caracteristicas: [
        "Habitación de 35 m² con balcón y vista al jardín.",
        "Aire acondicionado y calefacción.",
        "Televisión de 50\" con cable.",
        "Wi-Fi de alta velocidad.",
      ],
      detalles: [
        "Baño completo con secador de cabello.",
        "Minibar y cafetera.",
        "Sofá de descanso y escritorio amplio.",
        "Caja de seguridad digital.",
      ],
      servicios: [
        "Acceso a alberca y gimnasio.",
        "Servicio a la habitación 24 horas.",
        "Recepción y concierge.",
      ],
    },
  };

  const habitacion = habitaciones[tipo];

  return (
    <section id="habitaciones" className="habitaciones">
      <h2>Habitaciones</h2>

      {/* Lista desplegable */}
      <div className="selector">
        <label htmlFor="tipo">Elige una habitación: </label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="estandar">Habitación Estándar</option>
          <option value="deluxe">Habitación Deluxe</option>
        </select>
      </div>

      {/* Tarjeta de habitación */}
      <div className="habitacion-card">
        <div className="habitacion-img-bloque">
          <img src={habitacion.img} alt={habitacion.nombre} />
          {/* Precio justo debajo de la imagen */}
          <div className="habitacion-precio">
            {tipo === "estandar" ? "$120 USD por noche" : "$180 USD por noche"}
          </div>
        </div>
        <div className="habitacion-info">
          <h3>{habitacion.nombre}</h3>
          <p>
            <strong>Tipo de cama:</strong> {habitacion.cama}
          </p>

          <h4>Características</h4>
          <ul>
            {habitacion.caracteristicas.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h4>Detalles de la habitación</h4>
          <ul>
            {habitacion.detalles.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h4>Servicios generales</h4>
          <ul>
            {habitacion.servicios.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

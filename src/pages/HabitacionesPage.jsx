
import { useState } from "react";
import habitacionEstandar from "../assets/Habitacion Estandar.jpg";
import habitacionDeluxe from "../assets/Habitacion Deluxe.jpeg";
import portadaHabitaciones from "../assets/fotodehabitacion.png";

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
      precio: "$120.000 por noche",
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
      precio: "$180.000 por noche",
    },
  };

  const habitacion = habitaciones[tipo];

  return (
    <section id="habitaciones" className="min-h-screen bg-zinc-950 text-white py-0 px-0">
      {/* Imagen de portada */}
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={portadaHabitaciones}
          alt="Portada habitaciones"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-5xl font-bold text-center mb-10 text-white-400">
          Habitaciones
        </h2>

        {/* Selector de tipo */}
        <div className="flex flex-col items-center mb-12">
          <label htmlFor="tipo" className="text-gray-300 mb-3 text-lg">
            Elegí una habitación:
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="bg-zinc-800 text-white px-5 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white-400 transition"
          >
            <option value="estandar">Habitación Estándar</option>
            <option value="deluxe">Habitación Deluxe</option>
          </select>
        </div>

        {/* Tarjeta de habitación */}
        <div className="bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Imagen y precio */}
          <div className="relative md:w-1/2">
            <img
              src={habitacion.img}
              alt={habitacion.nombre}
              className="w-full h-80 md:h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-center">
              <p className="text-2xl md:text-3xl text-white-400 font-semibold">
                {habitacion.precio}
              </p>
            </div>
          </div>

          {/* Información */}
          <div className="md:w-1/2 p-8 space-y-6">
            <h3 className="text-3xl font-semibold text-white-400">
              {habitacion.nombre}
            </h3>
            <p className="text-gray-300">
              <strong className="text-white">Tipo de cama:</strong> {habitacion.cama}
            </p>

            <div>
              <h4 className="text-xl font-semibold mb-2 text-white">
                Características
              </h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {habitacion.caracteristicas.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2 text-white">
                Detalles de la habitación
              </h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {habitacion.detalles.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2 text-white">
                Servicios generales
              </h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {habitacion.servicios.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

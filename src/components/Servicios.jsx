import { useState } from "react";
import foto1 from "../assets/Pileta.jpg";
import foto2 from "../assets/restaurant.jpg";
import foto3 from "../assets/salon de juegos.jpg";
import foto4 from "../assets/salon de spa.jpg";
import foto5 from "../assets/Gimnasio.jpg";      
import foto6 from "../assets/lavanderia.jpg";         

const serviciosHotel = [
  "Recepción 24 horas",
  "Wi-Fi gratuito en todo el hotel",
  "Desayuno buffet incluido",
  "Gimnasio y alberca",
  "Servicio de lavandería",
  "Estacionamiento privado",
  "Salon de spa",
  "Restaurante y bar",
];

const fotos = [
  { src: foto1, alt: "Pileta" },
  { src: foto2, alt: "Restaurante" },
  { src: foto3, alt: "Salón de juegos" },
  { src: foto4, alt: "Salón de spa" },
  { src: foto5, alt: "Gimnasio" },      
  { src: foto6, alt: "Lavandería" },         
];

export default function Servicios() {
  const [fotoSeleccionada, setFotoSeleccionada] = useState(0);

  return (
    <section className="servicios">
      <h2>Servicios del Hotel</h2>
      <div className="servicios-contenido">
        {/* Servicios a la izquierda */}
        <div className="servicios-lista">
          <h3>¿Qué ofrecemos?</h3>
          <ul>
            {serviciosHotel.map((servicio, i) => (
              <li key={i}>{servicio}</li>
            ))}
          </ul>
        </div>
        {/* Línea divisoria */}
        <div className="servicios-divisor"></div>
        {/* Fotos y selector a la derecha */}
        <div className="servicios-fotos">
          <img
            src={fotos[fotoSeleccionada].src}
            alt={fotos[fotoSeleccionada].alt}
            className="servicio-img"
          />
          <div className="selector-fotos">
            {fotos.map((foto, i) => (
              <button
                key={i}
                className={fotoSeleccionada === i ? "activo" : ""}
                onClick={() => setFotoSeleccionada(i)}
                aria-label={`Ver foto ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
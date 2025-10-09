
import ServiceCard from "../components/ServiceCard";
import piscina from "../assets/Pileta.jpg";
import gimnasio from "../assets/Gimnasio.jpg";
import lavanderia from "../assets/lavanderia.jpg";
import restaurant from "../assets/restaurant.jpg";
import juegos from "../assets/salon de juegos.jpg";
import spa from "../assets/salon de spa.jpg";
import portadaServicios from "../assets/fotodeservicio.png";

const services = [
  {
    title: "Piscina",
    image: piscina,
    description:
      "Abierta todos los días desde las 09:00 hasta las 20:00. De uso exclusivo para los huéspedes, cuenta con solárium, reposeras y una galería exterior ambientada con quincho, parrilla y horno de barro. Ideal para relajarse y disfrutar del día.",
  },
  {
    title: "Gimnasio",
    image: gimnasio,
    description:
      "Espacio moderno con equipos de entrenamiento cardiovascular y de fuerza. Abierto de 06:00 a 22:00, climatizado y con música ambiental. Contamos con zona de estiramiento y duchas para después del entrenamiento.",
  },
  {
    title: "Lavandería",
    image: lavanderia,
    description:
      "Servicio completo de lavado, secado y planchado disponible de lunes a sábado. Contamos con opción express y retiro directo desde la habitación, pensado para tu comodidad durante tu estadía.",
  },
  {
    title: "Restaurante",
    image: restaurant,
    description:
      "Nuestro restaurante ofrece una experiencia gourmet con platos regionales e internacionales, elaborados con ingredientes frescos. Abierto para desayunos, almuerzos y cenas, con un ambiente cálido y moderno.",
  },
  {
    title: "Salón de Juegos",
    image: juegos,
    description:
      "Un espacio ideal para disfrutar con amigos o familia. Contamos con mesas de pool, ping pong, metegol y juegos de mesa. Abierto todos los días de 10:00 a 23:00, con servicio de bebidas y snacks.",
  },
  {
    title: "Spa",
    image: spa,
    description:
      "Un oasis de relajación. Disfrutá de masajes, sauna seco, tratamientos faciales y corporales. Nuestro personal especializado te brindará una experiencia de bienestar inigualable.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white py-0">
      {/* Imagen de portada */}
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={portadaServicios}
          alt="Portada servicios"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-center mb-8 text-white-400">Servicios</h1>
        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto text-lg">
          Descubrí todos los servicios que ofrece Hotel Ramolia para hacer de tu estadía una experiencia inolvidable.
        </p>

        {services.map((s, i) => (
          <ServiceCard key={i} {...s} reverse={i % 2 !== 0} />
        ))}
      </div>
    </div>
  );
}

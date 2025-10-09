import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <h1 className="text-black text-6xl font-bold mb-6">Bienvenido a Hotel Ramolia</h1>
      <p className="text-lg md:text-2xl text-black mb-10 max-w-2xl">
        Tradición, elegancia y confort en el corazón de la Ciudad de Salta.
      </p>
      <Link to="/habitaciones">
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition">
          Reservar ahora
        </button>
      </Link>
    </div>
  );
};

export default Hero;

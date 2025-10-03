import "./Hero.css";
import hotelImage from "../assets/Hotel.jpeg"; // aquí va la foto del hotel

export default function Hero({ onReservaClick }) {
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
        <button className="btn-reserva" onClick={onReservaClick}>Empezar una reservación</button>
      </div>
    </section>
  );
}

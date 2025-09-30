import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ubicacion from "./components/Ubicacion";
import Habitaciones from "./components/Habitaciones";
import Servicios from "./components/Servicios";
import Contacto from "./components/Contacto"; // Importa el componente

function App() {
  return (
    <>
      <Navbar />
      <section id="inicio">
        <Hero />
      </section>
      <section id="ubicacion">
        <Ubicacion />
      </section>
      <section id="habitaciones">
        <Habitaciones />
      </section>
      <section id="servicios">
        <Servicios />
      </section>
      <section id="contacto">{/* Sección de contacto */}
        <Contacto />
      </section>
    </>
  );
}

export default App;

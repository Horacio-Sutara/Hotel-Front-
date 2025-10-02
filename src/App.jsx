import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ubicacion from "./components/Ubicacion";
import Habitaciones from "./components/Habitaciones";
import Servicios from "./components/Servicios";
import Contacto from "./components/Contacto";
import InicioSesion from "./components/InicioSesion";

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(false);

  return (
    <>
      {!mostrarLogin && (
        <Navbar onLoginClick={() => setMostrarLogin(true)} />
      )}
      {mostrarLogin ? (
        <InicioSesion
          onRegisterClick={() => setMostrarLogin(false)}
          onLoginSuccess={() => setMostrarLogin(false)}
        />
      ) : (
        <>
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
          <section id="contacto">
            <Contacto />
          </section>
        </>
      )}
    </>
  );
}

export default App;

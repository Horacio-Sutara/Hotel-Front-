import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ubicacion from "./components/Ubicacion";
import Habitaciones from "./components/Habitaciones";
import Servicios from "./components/Servicios";
import Contacto from "./components/Contacto";
import LoginNuevo from "./components/LoginNuevo";
import RegistroNuevo from "./components/RegistroNuevo";

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Abrir login
  const handleAbrirLogin = () => {
    setMostrarLogin(true);
    setShowRegistro(false);
  };

  // Cerrar login
  const handleCerrarLogin = () => {
    setMostrarLogin(false);
  };

  // Abrir registro desde login
  const handleAbrirRegistro = () => {
    setShowRegistro(true);
    setMostrarLogin(false);
  };

  // Volver al login desde registro
  const handleVolverLogin = () => {
    setShowRegistro(false);
    setMostrarLogin(true);
  };

  // Confirmar login exitoso
  const handleLoginSuccess = (datosUsuario) => {
    setUsuario(datosUsuario);
    setMostrarLogin(false);
    setShowRegistro(false);
  };

  // Cerrar sesión y volver a la página principal
  const handleCerrarSesion = () => {
    setUsuario(null);
    setMostrarLogin(false);
    setShowRegistro(false);
  };

  return (
    <>
      {/* Mostrar solo login o registro, o la página principal con navbar */}
      {mostrarLogin && !showRegistro ? (
        <LoginNuevo
          onRegisterClick={handleAbrirRegistro}
          onLoginSuccess={handleLoginSuccess}
          onClose={handleCerrarLogin}
        />
      ) : showRegistro ? (
        <RegistroNuevo onVolverLogin={handleVolverLogin} />
      ) : (
        <>
          <Navbar onLoginClick={handleAbrirLogin} usuario={usuario} onCambiarUsuario={handleCerrarSesion} />
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

import { useState } from "react";
import "./InicioSesion.css";

export default function InicioSesion({ onRegisterClick, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función para obtener el tipo de usuario
  function getTipoUsuario(correo) {
    if (correo.endsWith(".com.ad")) return "administrador";
    if (correo.endsWith(".com.op")) return "operador";
    if (correo.endsWith(".com")) return "usuario";
    return "desconocido";
  }

  function handleLogin(e) {
    e.preventDefault();
    const tipo = getTipoUsuario(email);
    // Por ahora solo usamos "usuario"
    if (tipo === "usuario") {
      // Volver a la página principal
      if (onLoginSuccess) onLoginSuccess();
    } else {
      alert("Solo se permite el acceso de usuarios por ahora.");
    }
  }

  return (
    <div className="login-container">
      <h1 className="hotel-title">Hotel Ramolia</h1>
      <div className="login-box">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Inicia sesión con tu dirección email</h2>
          <input
            type="email"
            placeholder="Dirección de email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="btn-brown" type="submit">Iniciar sesión</button>
          <p>
            ¿No tienes cuenta?{" "}
            <span className="link" onClick={onRegisterClick}>
              Registrarte ahora
            </span>
          </p>
        </form>
        <div className="login-divider"></div>
        <div className="login-info">
          <h2>Tener una cuenta te da muchas posibilidades</h2>
          <ul>
            <li>Descuentos</li>
            <li>Atención personalizada</li>
            <li>Acceso a eventos exclusivos para socios</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

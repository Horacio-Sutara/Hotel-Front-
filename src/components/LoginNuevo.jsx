import { useState } from "react";


export default function LoginNuevo({ onRegisterClick, onLoginSuccess }) {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Determinar tipo de usuario según el email
  let tipo = "cliente";
    if (email.endsWith(".com.op")) tipo = "operador";
    else if (email.endsWith(".com.ad")) tipo = "administrador";
    // Aquí iría la lógica de login
    if (onLoginSuccess) onLoginSuccess({ usuario, email, tipo });
  }

  return (
    <div className="login-nuevo-container">
      <h1 className="login-nuevo-title">Hotel Ramolia</h1>
      <div className="login-nuevo-box">
        <form className="login-nuevo-form" onSubmit={handleSubmit}>
          <h2>Inicia sesión con tu dirección email</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
          />
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
            ¿No tienes cuenta? <span className="login-nuevo-link" onClick={onRegisterClick}>Registrarte ahora</span>
          </p>
        </form>
        <div className="login-nuevo-divider" />
        <div className="login-nuevo-info">
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

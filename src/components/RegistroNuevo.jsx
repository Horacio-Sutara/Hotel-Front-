import { useState } from "react";

export default function RegistroNuevo({ onVolverLogin }) {
  const [form, setForm] = useState({
    email: "",
    usuario: "",
    nombre: "",
    apellido: "",
    dni: "",
    nacimiento: "",
    telefono: "",
    password: "",
    confirmar: ""
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    // Validaciones básicas
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Ingrese un email válido.");
      return;
    }
    if (form.usuario.length < 4) {
      setError("El usuario debe tener al menos 4 caracteres.");
      return;
    }
    if (form.nombre.length < 2) {
      setError("Ingrese un nombre válido.");
      return;
    }
    if (form.apellido.length < 2) {
      setError("Ingrese un apellido válido.");
      return;
    }
    if (!/^\d{7,8}$/.test(form.dni)) {
      setError("El DNI debe tener 7 u 8 dígitos numéricos.");
      return;
    }
    if (!form.nacimiento) {
      setError("Ingrese su fecha de nacimiento.");
      return;
    }
    if (!/^\d{8,}$/.test(form.telefono.replace(/\D/g, ""))) {
      setError("Ingrese un teléfono móvil válido (mínimo 8 dígitos).");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden. Deben ser iguales para avanzar.");
      return;
    }
    setExito(true);
    setTimeout(() => {
      if (onVolverLogin) onVolverLogin();
    }, 2000);
  }

  return (
    <div className="registro-nuevo-container">
      <h1 className="registro-nuevo-title">Hotel Ramolia</h1>
      <div className="registro-nuevo-box">
        <div className="registro-nuevo-col">
          <form className="registro-nuevo-form" onSubmit={handleSubmit}>
            <h2>Registro de usuario</h2>
            <input
              type="email"
              name="email"
              placeholder="Dirección de email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="usuario"
              placeholder="Usuario"
              value={form.usuario}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="dni"
              placeholder="Dni"
              value={form.dni}
              onChange={handleChange}
              required
            />
          </form>
        </div>
        <div className="registro-nuevo-divider"></div>
        <div className="registro-nuevo-col">
          <form className="registro-nuevo-form" onSubmit={handleSubmit}>
            <label style={{fontWeight:'bold',marginTop:'8px'}}>Fecha de nacimiento</label>
            <input
              type="date"
              name="nacimiento"
              value={form.nacimiento}
              onChange={handleChange}
              required
              className="registro-nuevo-fecha"
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono móvil"
              value={form.telefono}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmar"
              placeholder="Confirmar contraseña"
              value={form.confirmar}
              onChange={handleChange}
              required
            />
            {error && <div className="registro-nuevo-error">{error}</div>}
            <button className="btn-brown" type="submit">Registrarse</button>
          </form>
          {exito && (
            <div className="registro-nuevo-modal-exito">
              <div className="registro-nuevo-modal-contenido">
                <div className="registro-nuevo-cargando-icono"></div>
                <span style={{color:'#22c98d',fontWeight:'bold',marginTop:'8px',display:'block',textAlign:'center'}}>Registro exitoso. Inicia sesión ahora.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

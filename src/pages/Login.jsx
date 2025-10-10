import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ usuario: "", email: "", contraseña: "" });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!form.usuario || !form.email || !form.contraseña) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    if (form.usuario.trim().split(" ").length < 1 || form.usuario.length < 3) {
      setMensaje("El usuario debe tener al menos 3 caracteres y una palabra");
      return;
    }

    if (!validarEmail(form.email)) {
      setMensaje("El email no tiene un formato válido");
      return;
    }

    // Simula el login
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        username: form.usuario,
        email: form.email,
        tipo: "Cliente",
      })
    );

    navigate("/"); // redirige al inicio
    window.location.reload(); // refresca navbar
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-100">Iniciar Sesión</h2>

      {location.state?.mensaje && (
        <p className="text-green-400 mb-4">{location.state.mensaje}</p>
      )}
      {mensaje && <p className="text-red-400 mb-4">{mensaje}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <label className="block mb-3 text-gray-300">Usuario</label>
        <input
          type="text"
          name="usuario"
          value={form.usuario}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none"
        />

        <label className="block mb-3 text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none"
        />

        <label className="block mb-3 text-gray-300">Contraseña</label>
        <input
          type="password"
          name="contraseña"
          value={form.contraseña}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white mb-6 focus:ring-2 focus:ring-gray-600 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
        >
          Iniciar Sesión
        </button>

        <p className="mt-6 text-center text-gray-400 text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-white hover:underline font-semibold"
          >
            Registrarse aquí
          </Link>
        </p>
      </form>
    </div>
  );
}

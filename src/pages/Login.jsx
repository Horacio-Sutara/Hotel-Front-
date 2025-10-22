import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ nombre: "", email: "", contraseña: "" });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.contraseña) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    if (form.nombre.length < 3) {
      setMensaje("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!validarEmail(form.email)) {
      setMensaje("El email no tiene un formato válido");
      return;
    }

    // 🔹 Caso Operador (nombre especial)
    if (
      form.nombre === "Horacio" &&
      form.email === "prueba@gmail.com" &&
      form.contraseña === "1234"
    ) {
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          tipo: "Operador",
        })
      );
      navigate("/operador");
      return;
    }

    // 🔹 Caso cliente común
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        nombre: form.nombre,
        email: form.email,
        tipo: "Cliente",
      })
    );

    navigate("/");
    window.location.reload();
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
        <label className="block mb-3 text-gray-300">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
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

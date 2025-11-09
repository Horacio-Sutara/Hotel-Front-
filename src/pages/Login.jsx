import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ nombre: "", email: "", contraseña: "" });
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false); // 🔹 Evita doble clics

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;

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

    // 🔹 Casos especiales: Operador
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
          tipo: "OPERADOR",
        })
      );
      navigate("/operador");
      return;
    }

    // 🔹 Casos especiales: Administrador
    if (
      form.nombre === "Pablo" &&
      form.email === "admin@gmail.com" &&
      form.contraseña === "1234"
    ) {
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          tipo: "ADMINISTRADOR",
        })
      );
      navigate("/admin");
      return;
    }

    // 🔹 Login de cliente desde la API
    setEnviando(true);
    setMensaje("");

try {
  const userData = {
    nombre: form.nombre,
    correo: form.email,
    contraseña: form.contraseña,
  };

  const response = await fetch("http://127.0.0.1:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const usuario = await response.json();
  console.log(usuario);

  if (!response.ok) {
    // Si la API devuelve un error (como 401), muestra el mensaje que venga del backend
    setMensaje(usuario.error || "Error en el login");
    setEnviando(false);
    return;
  }

  // Si llegamos aquí, el login fue exitoso
  localStorage.setItem(
    "usuario",
    JSON.stringify({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      numero_documento: usuario.numero_documento,
      telefono: usuario.telefono,
      pais_emision: usuario.pais_emision,
      email: usuario.correo,
      tipo: usuario.rol,
      id: usuario.id,
    })
  );

  // Mensaje de éxito
  setMensaje("Inicio de sesión exitoso, redirigiendo...");


  setTimeout(() => {
    if (usuario.rol === "ADMINISTRADOR") {
      navigate("/admin");
    } else if (usuario.rol === "OPERADOR") {
      navigate("/operador");
    } else {
      navigate("/"); // CLIENTE u otro
    }
    window.location.reload();
  }, 1000);
  



} catch (error) {
  console.error("Error en el login:", error);
  setMensaje("No se pudo conectar con el servidor.");
  setEnviando(false);
}

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-100">Iniciar Sesión</h2>

      {location.state?.mensaje && (
        <p className="text-green-400 mb-4">{location.state.mensaje}</p>
      )}
      {mensaje && (
  <p
    className={`mb-4 text-center ${
      mensaje.toLowerCase().includes("exitoso")
        ? "text-green-400"
        : "text-red-400"
    }`}
  >
    {mensaje}
  </p>
)}

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
          disabled={enviando}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
        />

        <label className="block mb-3 text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={enviando}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
        />

        <label className="block mb-3 text-gray-300">Contraseña</label>
        <input
          type="password"
          name="contraseña"
          value={form.contraseña}
          onChange={handleChange}
          disabled={enviando}
          className="w-full p-3 rounded bg-gray-800 text-white mb-6 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={enviando}
          className={`w-full font-semibold py-3 rounded-lg transition-all ${
            enviando
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-300"
          }`}
        >
          {enviando ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
              <span>Ingresando...</span>
            </div>
          ) : (
            "Iniciar Sesión"
          )}
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

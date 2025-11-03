import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    pais: "",
    email: "",
    dni: "",
    telefono: "", // 🔹 Nuevo campo opcional
    contraseña: "",
    confirmar: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarNombre = (nombre) =>
    nombre.trim().split(" ").length >= 1 && nombre.length >= 3;

  const validarDNI = (dni, pais) => {
    if (!/^\d+$/.test(dni)) return false;
    switch (pais) {
      case "Argentina":
        return /^\d{8}$/.test(dni);
      case "Chile":
        return /^\d{9}$/.test(dni);
      case "México":
        return /^\d{10}$/.test(dni);
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (enviando) return;

    if (
      !form.nombre ||
      !form.apellido ||
      !form.pais ||
      !form.email ||
      !form.dni ||
      !form.contraseña ||
      !form.confirmar
    ) {
      setMensaje("Todos los campos obligatorios deben completarse");
      return;
    }

    if (!validarNombre(form.nombre)) {
      setMensaje("El nombre debe tener al menos una palabra y 3 caracteres");
      return;
    }

    if (!validarNombre(form.apellido)) {
      setMensaje("El apellido debe tener al menos una palabra y 3 caracteres");
      return;
    }

    if (!validarEmail(form.email)) {
      setMensaje("El email no tiene un formato válido");
      return;
    }

    if (!validarDNI(form.dni, form.pais)) {
      setMensaje(`El DNI no es válido para ${form.pais}`);
      return;
    }

    if (form.contraseña !== form.confirmar) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    const userData = {
      nombre: form.nombre,
      apellido: form.apellido,
      correo: form.email,
      contraseña: form.contraseña,
      tipo_documento: "DNI",
      numero_documento: form.dni,
      pais_emision: form.pais,
      telefono: form.telefono || "", // 🔹 Solo se envía si existe
      rol: "CLIENTE",
    };

    setEnviando(true);
    setMensaje("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setMensaje("Faltan datos en la petición.");
        } else if (response.status === 402) {
          setMensaje("Este correo ya está registrado.");
        } else {
          setMensaje(data.message || "Error al registrar el usuario.");
        }
        setEnviando(false);
        return;
      }

      setMensaje("Registro exitoso, redirigiendo...");
      setTimeout(() => {
        navigate("/login", {
          state: { mensaje: "Registro exitoso. Debes iniciar sesión ahora." },
        });
      }, 1000);
    } catch (error) {
      console.error("Error en el registro:", error);
      setMensaje("No se pudo conectar con el servidor.");
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-100">Registro</h2>

      {mensaje && <p className="text-red-400 mb-4">{mensaje}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-gray-300">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              disabled={enviando}
              className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-300">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              disabled={enviando}
              className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <label className="block mb-2 text-gray-300">País</label>
        <select
          name="pais"
          value={form.pais}
          onChange={handleChange}
          disabled={enviando}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
        >
          <option value="">Seleccionar país</option>
          <option value="Argentina">Argentina</option>
          <option value="Chile">Chile</option>
          <option value="México">México</option>
          <option value="Peru">Perú</option>
          <option value="Otro">Otro</option>
        </select>

        <label className="block mb-2 text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={enviando}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
        />

        <label className="block mb-2 text-gray-300">DNI</label>
        <input
          type="text"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          disabled={enviando}
          placeholder={
            form.pais === "Argentina"
              ? "8 dígitos"
              : form.pais === "Chile"
              ? "9 dígitos"
              : form.pais === "México"
              ? "10 dígitos"
              : "Número"
          }
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
        />

        {/* 🔹 Campo opcional de teléfono */}
        <label className="block mb-2 text-gray-300">Teléfono (opcional)</label>
        <input
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          disabled={enviando}
          placeholder="Ej: +54 11 1234-5678"
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
        />

        <label className="block mb-2 text-gray-300">Contraseña</label>
        <input
          type="password"
          name="contraseña"
          value={form.contraseña}
          onChange={handleChange}
          disabled={enviando}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none disabled:opacity-50"
        />

        <label className="block mb-2 text-gray-300">Confirmar contraseña</label>
        <input
          type="password"
          name="confirmar"
          value={form.confirmar}
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
              <span>Registrando...</span>
            </div>
          ) : (
            "Registrarse"
          )}
        </button>
      </form>
    </div>
  );
}

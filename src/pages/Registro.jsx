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
    contraseña: "",
    confirmar: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarNombre = (nombre) =>
    nombre.trim().split(" ").length >= 1 && nombre.length >= 3;

  const validarDNI = (dni, pais) => {
    if (!/^\d+$/.test(dni)) return false; // solo números
    switch (pais) {
      case "Argentina":
        return /^\d{8}$/.test(dni);
      case "Chile":
        return /^\d{9}$/.test(dni);
      case "México":
        return /^\d{10}$/.test(dni);
      default:
        return true; // otros países: cualquier número
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.apellido ||
      !form.pais ||
      !form.email ||
      !form.dni ||
      !form.contraseña ||
      !form.confirmar
    ) {
      setMensaje("Todos los campos son obligatorios");
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
      setMensaje(
        `El DNI no es válido para ${form.pais}`
      );
      return;
    }

    if (form.contraseña !== form.confirmar) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    // Simula guardado
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        pais: form.pais,
        email: form.email,
        tipo: "Cliente",
      })
    );

    navigate("/login", {
      state: { mensaje: "Registro exitoso. Debes iniciar sesión ahora." },
    });
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
              className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-300">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none"
            />
          </div>
        </div>

        <label className="block mb-2 text-gray-300">País</label>
        <select
          name="pais"
          value={form.pais}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none"
        >
          <option value="">Seleccionar país</option>
          <option value="Argentina">Argentina</option>
          <option value="Chile">Chile</option>
          <option value="México">México</option>
          <option value="Otro">Otro</option>
        </select>

        <label className="block mb-2 text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none"
        />

        <label className="block mb-2 text-gray-300">DNI</label>
        <input
          type="text"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          placeholder={
            form.pais === "Argentina"
              ? "8 dígitos"
              : form.pais === "Chile"
              ? "9 dígitos"
              : form.pais === "México"
              ? "10 dígitos"
              : "Número"
          }
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none"
        />

        <label className="block mb-2 text-gray-300">Contraseña</label>
        <input
          type="password"
          name="contraseña"
          value={form.contraseña}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-gray-600 outline-none"
        />

        <label className="block mb-2 text-gray-300">Confirmar contraseña</label>
        <input
          type="password"
          name="confirmar"
          value={form.confirmar}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white mb-6 focus:ring-2 focus:ring-gray-600 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

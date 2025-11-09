import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";

// 🔹 Imágenes locales
import estandar1 from "../assets/estandar/foto1.png";
import estandar2 from "../assets/estandar/foto2.png";
import estandar3 from "../assets/estandar/foto3.png";
import deluxe1 from "../assets/deluxe/foto1.png";
import deluxe2 from "../assets/deluxe/foto2.png";
import deluxe3 from "../assets/deluxe/foto3.png";
import suite1 from "../assets/suite/foto1.png";
import suite2 from "../assets/suite/foto2.png";
import suite3 from "../assets/suite/foto3.png";

export default function CrudHabitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionesCerradas, setHabitacionesCerradas] = useState([]);
  const [mostrarCerradas, setMostrarCerradas] = useState(false);

  const [nueva, setNueva] = useState({
    nombre: "",
    tipo: "",
    descripcion: "",
    precio: "",
    capacidad: "",
    imagen_url: "",
  });

  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({});
  const admin = JSON.parse(localStorage.getItem("usuario"));
  const ADMIN_ID = admin?.id;

  const imagenesLocales = {
    ESTANDAR: [estandar1, estandar2, estandar3],
    DELUXE: [deluxe1, deluxe2, deluxe3],
    SUITE: [suite1, suite2, suite3],
  };

  const obtenerImagenLocal = (tipo) => {
    const grupo = imagenesLocales[tipo?.toUpperCase()] || imagenesLocales.ESTANDAR;
    return grupo[Math.floor(Math.random() * grupo.length)];
  };

  const verificarImagen = async (url) => {
    if (!url) return false;
    try {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  };

  // 🔹 Obtener habitaciones activas
  const fetchHabitacionesActivas = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/habitaciones/activas");
      const data = await res.json();
      setHabitaciones(data);
    } catch (error) {
      console.error("Error al obtener habitaciones activas:", error);
    }
  };

  // 🔹 Obtener habitaciones cerradas
  const fetchHabitacionesCerradas = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/habitaciones");
      const data = await res.json();
      const cerradas = data.filter((h) => h.estado === "CERRADA");
      setHabitacionesCerradas(cerradas);
    } catch (error) {
      console.error("Error al obtener habitaciones cerradas:", error);
    }
  };

  // 🔹 Alternar mostrar u ocultar lista de cerradas
  const handleMostrarCerradas = () => {
    if (!mostrarCerradas) fetchHabitacionesCerradas();
    setMostrarCerradas(!mostrarCerradas);
  };

  useEffect(() => {
    fetchHabitacionesActivas();
  }, []);

  // 🔹 Agregar nueva habitación
  const agregarHabitacion = async () => {
    if (!nueva.precio || !nueva.capacidad) {
      alert("El precio y la capacidad son obligatorios.");
      return;
    }

    const tipo = nueva.tipo || "ESTANDAR";
    const imagenValida = await verificarImagen(nueva.imagen_url);
    const imagenFinal = imagenValida ? nueva.imagen_url : obtenerImagenLocal(tipo);

    const habitacionAPI = {
      nombre: nueva.nombre,
      tipo,
      descripcion: nueva.descripcion,
      precio: nueva.precio,
      capacidad: nueva.capacidad,
      imagen_url: imagenFinal,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/habitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitacionAPI),
      });

      const result = await response.json();

      if (response.ok) {
        fetchHabitacionesActivas();
        setNueva({
          nombre: "",
          tipo: "",
          descripcion: "",
          precio: "",
          capacidad: "",
          imagen_url: "",
        });
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error al agregar habitación:", error);
      alert("Error al conectar con la API");
    }
  };

  // 🔹 Guardar edición
  const guardarEdicion = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/habitaciones/${id}?admin_id=${ADMIN_ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData || {}),
        }
      );

      const result = await response.json();

      if (response.ok) {
        fetchHabitacionesActivas();
        setEditando(null);
      } else {
        alert(result.error || "Error al editar habitación");
      }
    } catch (error) {
      console.error("Error al editar habitación:", error);
      alert("Error al conectar con la API");
    }
  };

  // 🔹 Cerrar habitación
  const handleCerrarHabitacion = async (idHabitacion) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/habitaciones/${idHabitacion}?admin_id=${ADMIN_ID}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Habitación cerrada correctamente");
        fetchHabitacionesActivas();
      } else {
        alert("Error al cerrar: " + data.error);
      }
    } catch (error) {
      console.error("Error al cerrar habitación:", error);
    }
  };

  // 🔹 Restaurar habitación cerrada → disponible
  const handleRestaurarHabitacion = async (idHabitacion) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/habitaciones/${idHabitacion}?admin_id=${ADMIN_ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: "DISPONIBLE" }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Habitación restaurada correctamente");
        fetchHabitacionesCerradas();
        fetchHabitacionesActivas();
      } else {
        alert("Error al restaurar: " + data.error);
      }
    } catch (error) {
      console.error("Error al restaurar habitación:", error);
    }
  };

  return (
    <div className="p-6">
      {/* 🔹 Formulario */}
      <div className="bg-zinc-900 p-4 rounded-lg text-white mb-6">
        <h2 className="text-2xl font-semibold mb-4">Agregar nueva habitación</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nueva.nombre}
          onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full mb-2 border border-zinc-700"
        />

        <select
          value={nueva.tipo}
          onChange={(e) => setNueva({ ...nueva, tipo: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full mb-2 border border-zinc-700"
        >
          <option value="">Seleccionar tipo</option>
          <option value="ESTANDAR">Estándar</option>
          <option value="DELUXE">Deluxe</option>
          <option value="SUITE">Suite</option>
        </select>

        <textarea
          placeholder="Descripción"
          value={nueva.descripcion}
          onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full mb-2 border border-zinc-700"
        />

        <input
          type="number"
          placeholder="Precio"
          value={nueva.precio}
          onChange={(e) => setNueva({ ...nueva, precio: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full mb-2 border border-zinc-700"
        />

        <input
          type="number"
          placeholder="Capacidad"
          value={nueva.capacidad}
          onChange={(e) => setNueva({ ...nueva, capacidad: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full mb-2 border border-zinc-700"
        />

        <input
          type="text"
          placeholder="URL Imagen"
          value={nueva.imagen_url}
          onChange={(e) => setNueva({ ...nueva, imagen_url: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full mb-2 border border-zinc-700"
        />

        <button
          onClick={agregarHabitacion}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* 🔹 Habitaciones activas */}
      <div className="bg-zinc-900 p-4 rounded-lg text-white mb-6">
        <h2 className="text-2xl font-semibold mb-4">Habitaciones activas</h2>
        <ul>
          {habitaciones.map((h) => (
            <li
              key={h.id}
              className="flex justify-between items-center bg-zinc-800 p-2 rounded mb-2"
            >
              {editando === h.id ? (
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="text"
                    value={editData.nombre || ""}
                    onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                    className="bg-zinc-700 px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    value={editData.precio || ""}
                    onChange={(e) => setEditData({ ...editData, precio: e.target.value })}
                    className="bg-zinc-700 px-2 py-1 rounded"
                  />
                  <select
                    value={editData.estado || "DISPONIBLE"}
                    onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
                    className="bg-zinc-700 px-2 py-1 rounded"
                  >
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="OCUPADA">Ocupada</option>
                    <option value="CERRADA">Cerrada</option>
                  </select>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => guardarEdicion(h.id)}
                      className="bg-green-600 px-2 py-1 rounded"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditando(null)}
                      className="bg-red-600 px-2 py-1 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-semibold">{h.nombre}</p>
                    <p>Tipo: {h.tipo}</p>
                    <p>Estado: {h.estado}</p>
                    <p>Precio: ${h.precio}</p>
                    <p>Capacidad: {h.capacidad}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditando(h.id);
                        setEditData(h);
                      }}
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleCerrarHabitacion(h.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Botón para mostrar/ocultar cerradas */}
      <button
        onClick={handleMostrarCerradas}
        className="mb-4 bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
      >
        {mostrarCerradas ? "Ocultar habitaciones cerradas" : "Mostrar habitaciones cerradas"}
      </button>

      {/* 🔹 Habitaciones cerradas */}
      {mostrarCerradas && (
        <div className="bg-red-900 p-4 rounded-lg text-white">
          <h2 className="text-2xl font-semibold mb-4">Habitaciones cerradas</h2>
          {habitacionesCerradas.length === 0 ? (
            <p className="text-zinc-300">No hay habitaciones cerradas.</p>
          ) : (
            <ul>
              {habitacionesCerradas.map((h) => (
                <li
                  key={h.id}
                  className="flex justify-between items-center bg-zinc-800 p-2 rounded mb-2"
                >
                  <div>
                    <p className="font-semibold">{h.nombre}</p>
                    <p>Tipo: {h.tipo}</p>
                    <p>Precio: ${h.precio}</p>
                  </div>
                  <button
                    onClick={() => handleRestaurarHabitacion(h.id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md"
                  >
                    Restaurar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

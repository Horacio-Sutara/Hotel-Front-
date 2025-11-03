import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function CrudHabitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [nueva, setNueva] = useState({
    nombre: "",
    tipo: "",
    descripcion: "",
    precio: "",
    capacidad: "",
    estado: "DISPONIBLE",
    imagen_url: "",
    caracteristicas: "",
    detalles: "",
    servicios: "",
    preview: null,
  });

  // Traer habitaciones desde la API al cargar la página
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/habitaciones")
      .then((res) => res.json())
      .then((data) => setHabitaciones(data))
      .catch((err) => console.error("Error al cargar habitaciones:", err));
  }, []);

  // Función para agregar habitación
  const agregarHabitacion = async () => {
    if (!nueva.precio || !nueva.capacidad) {
      alert("El precio y la capacidad son obligatorios.");
      return;
    }

    // Prepara los datos según la API
    const habitacionAPI = {
      nombre: nueva.nombre,
      tipo: nueva.tipo || "ESTANDAR",
      descripcion: nueva.descripcion,
      precio: nueva.precio,
      capacidad: nueva.capacidad,
      estado: nueva.estado,
      imagen_url: nueva.imagen_url || nueva.preview || "",
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/habitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitacionAPI),
      });

      const result = await response.json();

      if (response.ok) {
        // Si se creó correctamente, agregar a la lista local
        setHabitaciones([...habitaciones, { ...habitacionAPI, id: result.id || Date.now() }]);
        // Resetear formulario
        setNueva({
          nombre: "",
          tipo: "",
          descripcion: "",
          precio: "",
          capacidad: "",
          estado: "DISPONIBLE",
          imagen_url: "",
          caracteristicas: "",
          detalles: "",
          servicios: "",
          preview: null,
        });
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error al agregar habitación:", error);
      alert("Error al conectar con la API");
    }
  };

  const eliminarHabitacion = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/habitaciones/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHabitaciones(habitaciones.filter((h) => h.id !== id));
      } else {
        alert("Error al eliminar la habitación");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Previsualización y Formulario */}
      <div className="md:w-1/2 bg-zinc-900 p-4 rounded-lg shadow text-white flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-4">Agregar nueva habitación</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nueva.nombre}
          onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <input
          type="text"
          placeholder="Tipo"
          value={nueva.tipo}
          onChange={(e) => setNueva({ ...nueva, tipo: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <textarea
          placeholder="Descripción"
          value={nueva.descripcion}
          onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <textarea
          placeholder="Características (una por línea)"
          value={nueva.caracteristicas}
          onChange={(e) => setNueva({ ...nueva, caracteristicas: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <textarea
          placeholder="Detalles (una por línea)"
          value={nueva.detalles}
          onChange={(e) => setNueva({ ...nueva, detalles: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <textarea
          placeholder="Servicios generales (una por línea)"
          value={nueva.servicios}
          onChange={(e) => setNueva({ ...nueva, servicios: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <input
          type="number"
          placeholder="Precio"
          value={nueva.precio}
          onChange={(e) => setNueva({ ...nueva, precio: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <input
          type="number"
          placeholder="Capacidad"
          value={nueva.capacidad}
          onChange={(e) => setNueva({ ...nueva, capacidad: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <input
          type="text"
          placeholder="URL Imagen"
          value={nueva.imagen_url}
          onChange={(e) => setNueva({ ...nueva, imagen_url: e.target.value })}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setNueva({ ...nueva, preview: URL.createObjectURL(file) });
          }}
          className="bg-zinc-800 px-3 py-2 rounded w-full border border-zinc-700"
        />

        <button
          onClick={agregarHabitacion}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          <Plus size={16} /> Agregar
        </button>

        {/* Preview */}
        <div className="mt-4 bg-zinc-800 rounded-xl overflow-hidden shadow p-4">
          {nueva.preview && (
            <img src={nueva.preview} alt="preview" className="w-full h-64 object-cover rounded" />
          )}
          <h3 className="text-xl font-semibold mt-2">{nueva.nombre || "Nombre de la habitación"}</h3>
          <p><strong>Tipo:</strong> {nueva.tipo || "ESTANDAR"}</p>
          <p><strong>Precio:</strong> {nueva.precio ? `$${nueva.precio}` : "$0"}</p>
          <p><strong>Capacidad:</strong> {nueva.capacidad || "0"}</p>
          <div>
            <h4 className="font-semibold">Características:</h4>
            <ul className="list-disc list-inside">
              {nueva.caracteristicas
                ? nueva.caracteristicas.split("\n").map((c, i) => <li key={i}>{c}</li>)
                : <li>Ej: Aire acondicionado, Wi-Fi, Televisión</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Detalles:</h4>
            <ul className="list-disc list-inside">
              {nueva.detalles
                ? nueva.detalles.split("\n").map((d, i) => <li key={i}>{d}</li>)
                : <li>Ej: Baño privado, Escritorio</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Servicios:</h4>
            <ul className="list-disc list-inside">
              {nueva.servicios
                ? nueva.servicios.split("\n").map((s, i) => <li key={i}>{s}</li>)
                : <li>Ej: Gimnasio, Room service</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Listado de habitaciones */}
      <div className="md:w-1/2 bg-zinc-900 p-4 rounded-lg shadow text-white">
        <h2 className="text-2xl font-semibold mb-4">Habitaciones existentes</h2>
        <ul>
          {habitaciones.map((h) => (
            <li key={h.id} className="flex justify-between items-center bg-zinc-800 p-2 rounded mb-2">
              <div>
                <p className="font-semibold">{h.nombre}</p>
                <p>Tipo: {h.tipo}</p>
                <p>Precio: ${h.precio}</p>
                <p>Capacidad: {h.capacidad}</p>
              </div>
              <button onClick={() => eliminarHabitacion(h.id)} className="text-red-500 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

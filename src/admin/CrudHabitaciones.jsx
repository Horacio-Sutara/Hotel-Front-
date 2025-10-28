import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function CrudHabitaciones() {
  const [habitaciones, setHabitaciones] = useState([
    { id: 1, nombre: "Habitación Estándar", precio: 50000, tipo: "Estándar" },
    { id: 2, nombre: "Habitación Deluxe", precio: 80000, tipo: "Deluxe" },
    { id: 3, nombre: "Habitación Suite", precio: 120000, tipo: "Suite" },
  ]);
  const [nueva, setNueva] = useState({ nombre: "", precio: "", tipo: "" });

  const agregarHabitacion = () => {
    if (!nueva.nombre || !nueva.precio || !nueva.tipo) return;
    const id = habitaciones.length + 1;
    setHabitaciones([...habitaciones, { id, ...nueva }]);
    setNueva({ nombre: "", precio: "", tipo: "" });
  };

  const eliminarHabitacion = (id) => {
    setHabitaciones(habitaciones.filter((h) => h.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-white">CRUD de Habitaciones</h2>

      <div className="mb-6 bg-zinc-900 p-4 rounded-lg shadow">
        <h3 className="text-gray-300 mb-3 font-medium">Agregar nueva habitación</h3>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nueva.nombre}
            onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })}
            className="bg-zinc-800 text-white px-3 py-2 rounded w-48 border border-zinc-700 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Precio"
            value={nueva.precio}
            onChange={(e) => setNueva({ ...nueva, precio: e.target.value })}
            className="bg-zinc-800 text-white px-3 py-2 rounded w-36 border border-zinc-700 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Tipo"
            value={nueva.tipo}
            onChange={(e) => setNueva({ ...nueva, tipo: e.target.value })}
            className="bg-zinc-800 text-white px-3 py-2 rounded w-36 border border-zinc-700 focus:outline-none"
          />
          <button
            onClick={agregarHabitacion}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-800 text-gray-400">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Precio</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {habitaciones.map((h) => (
            <tr key={h.id} className="border-b border-zinc-700 hover:bg-zinc-800/60">
              <td className="p-3">{h.id}</td>
              <td className="p-3">{h.nombre}</td>
              <td className="p-3">{h.tipo}</td>
              <td className="p-3">${h.precio.toLocaleString()}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => eliminarHabitacion(h.id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

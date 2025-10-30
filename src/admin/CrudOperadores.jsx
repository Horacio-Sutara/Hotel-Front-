import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function CrudOperadores() {
  const [operadores, setOperadores] = useState([
    { id: 1, nombre: "Juan Pérez", email: "juan@hotel.com", rol: "Recepcionista" },
    { id: 2, nombre: "María López", email: "maria@hotel.com", rol: "Encargada" },
  ]);
  const [nuevo, setNuevo] = useState({ nombre: "", email: "", rol: "" });

  const agregarOperador = () => {
    if (!nuevo.nombre || !nuevo.email || !nuevo.rol) return;
    const id = operadores.length + 1;
    setOperadores([...operadores, { id, ...nuevo }]);
    setNuevo({ nombre: "", email: "", rol: "" });
  };

  const eliminarOperador = (id) => {
    setOperadores(operadores.filter((op) => op.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-white">CRUD de Operadores</h2>

      <div className="mb-6 bg-zinc-900 p-4 rounded-lg shadow">
        <h3 className="text-gray-300 mb-3 font-medium">Agregar nuevo operador</h3>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-700 focus:outline-none"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={nuevo.email}
            onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
            className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-700 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Rol"
            value={nuevo.rol}
            onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
            className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-700 focus:outline-none"
          />
          <button
            onClick={agregarOperador}
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
            <th className="p-3">Email</th>
            <th className="p-3">Rol</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {operadores.map((op) => (
            <tr key={op.id} className="border-b border-zinc-700 hover:bg-zinc-800/60">
              <td className="p-3">{op.id}</td>
              <td className="p-3">{op.nombre}</td>
              <td className="p-3">{op.email}</td>
              <td className="p-3">{op.rol}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => eliminarOperador(op.id)}
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

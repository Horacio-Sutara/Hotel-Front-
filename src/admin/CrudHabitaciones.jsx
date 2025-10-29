import { useState } from "react";

export default function HabitacionesCrud() {
  const [habitaciones, setHabitaciones] = useState([
    { id: 1, nombre: "Habitación 1", tipo: "Estándar", descripcion: "Cómoda habitación estándar con cama doble." },
    { id: 2, nombre: "Habitación 2", tipo: "Deluxe", descripcion: "Habitación Deluxe con vista al jardín." },
    { id: 3, nombre: "Habitación 3", tipo: "Suite", descripcion: "Suite amplia con sala de estar y jacuzzi." },
    { id: 4, nombre: "Habitación 4", tipo: "Estándar", descripcion: "Habitación funcional para estadías cortas." },
    { id: 5, nombre: "Habitación 5", tipo: "Deluxe", descripcion: "Habitación Deluxe con balcón privado." },
    { id: 6, nombre: "Habitación 6", tipo: "Suite", descripcion: "Suite ejecutiva con escritorio y minibar." },
    { id: 7, nombre: "Habitación 7", tipo: "Estándar", descripcion: "Habitación cómoda con cama queen." },
    { id: 8, nombre: "Habitación 8", tipo: "Deluxe", descripcion: "Habitación con detalles de lujo y vista panorámica." },
    { id: 9, nombre: "Habitación 9", tipo: "Suite", descripcion: "Suite con diseño moderno y amenities premium." },
    { id: 10, nombre: "Habitación 10", tipo: "Estándar", descripcion: "Habitación simple con baño privado." },
  ]);

  const [nuevaHabitacion, setNuevaHabitacion] = useState({
    nombre: "",
    tipo: "",
    descripcion: "",
  });

  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", tipo: "", descripcion: "" });

  const handleAgregar = () => {
    if (!nuevaHabitacion.nombre || !nuevaHabitacion.tipo || !nuevaHabitacion.descripcion) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nueva = {
      id: habitaciones.length + 1,
      ...nuevaHabitacion,
    };

    setHabitaciones([...habitaciones, nueva]);
    setNuevaHabitacion({ nombre: "", tipo: "", descripcion: "" });
  };

  const handleEliminar = (id) => {
    setHabitaciones(habitaciones.filter((h) => h.id !== id));
  };

  const handleEditar = (habitacion) => {
    setEditandoId(habitacion.id);
    setEditData({ nombre: habitacion.nombre, tipo: habitacion.tipo, descripcion: habitacion.descripcion });
  };

  const handleGuardarEdicion = () => {
    setHabitaciones(
      habitaciones.map((h) =>
        h.id === editandoId ? { ...h, ...editData } : h
      )
    );
    setEditandoId(null);
    setEditData({ nombre: "", tipo: "", descripcion: "" });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">CRUD de Habitaciones</h1>

      {/* Formulario de nueva habitación */}
      <div className="bg-zinc-900 shadow-md rounded-2xl p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4">Agregar nueva habitación</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre de habitación"
            className="border rounded-lg p-2"
            value={nuevaHabitacion.nombre}
            onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, nombre: e.target.value })}
          />
          <select
            className="border rounded-lg p-2"
            value={nuevaHabitacion.tipo}
            onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, tipo: e.target.value })}
          >
            <option value="">Seleccionar tipo</option>
            <option value="Estándar">Estándar</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
          <input
            type="text"
            placeholder="Descripción"
            className="border rounded-lg p-2"
            value={nuevaHabitacion.descripcion}
            onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, descripcion: e.target.value })}
          />
        </div>
        <button
          onClick={handleAgregar}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Agregar Habitación
        </button>
      </div>

      {/* Tabla de habitaciones */}
      <div className="overflow-x-auto bg-zinc-900 shadow-md rounded-2xl">
        <table className="min-w-full border-collapse">
          <thead className="bg-white text-black">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Nombre</th>
              <th className="border p-3 text-left">Tipo</th>
              <th className="border p-3 text-left">Descripción</th>
              <th className="border p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((h) => (
              <tr key={h.id} className="hover:bg-zinc-800/60">
                <td className="border p-3">{h.id}</td>

                <td className="border p-3">
                  {editandoId === h.id ? (
                    <input
                      type="text"
                      className="border rounded p-1 w-full"
                      value={editData.nombre}
                      onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                    />
                  ) : (
                    h.nombre
                  )}
                </td>

                <td className="border p-3">
                  {editandoId === h.id ? (
                    <select
                      className="border rounded p-1 w-full"
                      value={editData.tipo}
                      onChange={(e) => setEditData({ ...editData, tipo: e.target.value })}
                    >
                      <option value="Estándar">Estándar</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                    </select>
                  ) : (
                    h.tipo
                  )}
                </td>

                <td className="border p-3">
                  {editandoId === h.id ? (
                    <input
                      type="text"
                      className="border rounded p-1 w-full"
                      value={editData.descripcion}
                      onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                    />
                  ) : (
                    h.descripcion
                  )}
                </td>

                <td className="border p-3 text-center">
                  {editandoId === h.id ? (
                    <button
                      onClick={handleGuardarEdicion}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditar(h)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => handleEliminar(h.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

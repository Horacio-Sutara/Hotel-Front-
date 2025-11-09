import { useState, useEffect } from "react";

export default function AbrirCerrar() {
  const [habitaciones, setHabitaciones] = useState([]);

  // 🔹 Obtener el operador logueado
  const operador = JSON.parse(localStorage.getItem("usuario"));
  const operadorId = operador?.id;

  // 🔹 Cargar habitaciones desde la API
  const fetchHabitaciones = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/habitaciones");
      const data = await res.json();

      // Filtrar las habitaciones cerradas
      const activas = data.filter((hab) => hab.estado !== "CERRADA");
      setHabitaciones(activas);
    } catch (error) {
      console.error("Error al cargar habitaciones:", error);
    }
  };

  useEffect(() => {
    fetchHabitaciones();
  }, []);

  // 🔹 Cambiar estado de una habitación (para mantenimiento o disponibilidad)
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/habitaciones/estado/${id}?trabajador_id=${operadorId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log(data.mensaje);
        fetchHabitaciones(); // 🔄 Actualiza la lista después del cambio
      } else {
        console.error("Error al actualizar:", data.error);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  // 🔹 Nueva función: liberar una reserva cuando cumplió su tiempo
  const liberarReserva = async (idHabitacion) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reservas/liberar/${idHabitacion}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_operador: operadorId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Reserva liberada correctamente:", data.mensaje);
        fetchHabitaciones();
      } else {
        console.error("❌ Error al liberar la reserva:", data.error);
      }
    } catch (error) {
      console.error("Error al conectar con la API de reservas:", error);
    }
  };

  // 🔹 Nueva función toggle mantenimiento
  const toggleMantenimiento = (hab) => {
    const nuevoEstado =
      hab.estado === "MANTENIMIENTO" ? "DISPONIBLE" : "MANTENIMIENTO";
    cambiarEstado(hab.id, nuevoEstado);
  };

  if (!habitaciones || habitaciones.length === 0) {
    return <p className="text-white">Cargando habitaciones...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4">
        Estado de Habitaciones
      </h2>

      <table className="w-full text-center text-white bg-gray-600 rounded overflow-hidden">
        <thead className="bg-white text-black">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {habitaciones.map((hab) => (
            <tr key={hab.id}>
              <td>{hab.id}</td>
              <td>{hab.nombre}</td>
              <td>{hab.tipo}</td>
              <td
                className={`font-bold ${
                  hab.estado === "DISPONIBLE"
                    ? "text-green-400"
                    : hab.estado === "OCUPADA"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {hab.estado}
              </td>
              <td className="flex justify-center gap-3 py-2">
                {/* 🔹 Botón Liberar */}
                <button
                  onClick={() => liberarReserva(hab.id)}
                  disabled={hab.estado !== "OCUPADA"}
                  className={`px-3 py-1 rounded text-white ${
                    hab.estado !== "OCUPADA"
                      ? "bg-green-800 opacity-60 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Liberar
                </button>

                {/* 🔹 Botón Mantenimiento (toggle) */}
                <button
                  onClick={() => toggleMantenimiento(hab)}
                  className={`px-3 py-1 rounded text-black ${
                    hab.estado === "MANTENIMIENTO"
                      ? "bg-yellow-400 hover:bg-yellow-300"
                      : "bg-yellow-300 hover:bg-yellow-400"
                  }`}
                >
                  {hab.estado === "MANTENIMIENTO"
                    ? "Quitar mantenimiento"
                    : "Mantenimiento"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

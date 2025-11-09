import { useState, useEffect } from "react";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Cargar reservas activas desde la API
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reservas/detalle");
        if (!res.ok) throw new Error("Error al obtener las reservas");
        const data = await res.json();
        setReservas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  // 🔹 Formatear fecha
  const formatearFecha = (fecha) => {
    try {
      const f = new Date(fecha);
      return f.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    } catch {
      return fecha;
    }
  };

  if (loading)
    return <p className="text-white text-center">Cargando reservas...</p>;

  if (error)
    return (
      <p className="text-red-500 text-center">
        Error al cargar reservas: {error}
      </p>
    );

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4 text-center">
        Reservas Activas
      </h2>

      {reservas.length === 0 ? (
        <p className="text-white text-center">No hay reservas activas.</p>
      ) : (
        <table className="w-full text-center text-white bg-gray-600 rounded overflow-hidden">
          <thead className="bg-white text-black">
            <tr>
              <th>Cliente</th>
              <th>Habitación</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Huéspedes</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r, idx) => (
              <tr key={idx} className="border-b border-gray-400">
                <td>{r.cliente}</td>
                <td>{r.nombre_habitacion}</td>
                <td>{formatearFecha(r.fecha_entrada)}</td>
                <td>{formatearFecha(r.fecha_salida)}</td>
                <td>{r.numero_huespedes}</td>
                <td>{r.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

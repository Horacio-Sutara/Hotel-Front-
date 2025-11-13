import { useState, useEffect } from "react";

export default function Pagos() {
  const [facturas, setFacturas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Obtener el operador logueado
  const operador = JSON.parse(localStorage.getItem("usuario"));
  const operadorId = operador?.id;

  // Cargar facturas pendientes al montar
  useEffect(() => {
    if (operadorId) obtenerFacturas();
  }, [operadorId]);

  const obtenerFacturas = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/facturas/pendientes?empleado_id=${operadorId}`, {
        method: "GET", // 🔹 Debe ser POST, no GET
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al obtener facturas");

      const data = await response.json();

      const facturasConDatos = data.map((f) => ({
        id: f.id,
        id_reserva: f.id_reserva,
        cliente: `Cliente ${f.id_reserva}`,
        habitacion: f.id_reserva,
        monto: f.monto_total,
        metodo: f.metodo_pago,
        limite: generarFechaLimite(f.fecha_emision),
        estado: f.estado_factura,
      }));

      setFacturas(facturasConDatos);
    } catch (error) {
      console.error(error);
      setMensaje("Error al cargar las facturas.");
    }
  };

  const generarFechaLimite = (fechaEmision) => {
    const fecha = new Date(fechaEmision);
    fecha.setDate(fecha.getDate() + 3);
    return fecha.toISOString().split("T")[0];
  };

  const actualizarEstadoFactura = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/facturas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          estado_factura: nuevoEstado,
          empleado_id:operadorId , // ✅ corregido
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || "Error al actualizar factura.");
        return;
      }

      setMensaje(data.mensaje || "Factura actualizada con éxito.");

      // Actualiza el estado local
      setFacturas((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, estado: nuevoEstado } : f
        )
      );
    } catch (error) {
      console.error(error);
      setMensaje("Error de conexión con el servidor.");
    }
  };

  const estaVencida = (fechaLimite) => {
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    return limite < hoy;
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Facturas Pendientes</h2>

      {mensaje && (
        <p className="mb-2 bg-gray-700 text-center py-2 rounded">{mensaje}</p>
      )}

      <table className="w-full text-center bg-gray-500 rounded overflow-hidden">
        <thead className="bg-white text-black">
          <tr>
            <th>N° Factura</th>
            <th>Cliente</th>
            <th>Habitación</th>
            <th>Monto</th>
            <th>Método</th>
            <th>Fecha Límite</th>
            <th>Acción</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {facturas.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-3 text-center">
                No hay facturas pendientes.
              </td>
            </tr>
          ) : (
            facturas.map((f) => (
              <tr key={f.id}>
                <td>#{f.id_reserva}</td>
                <td>{f.cliente}</td>
                <td>{f.habitacion}</td>
                <td>${f.monto}</td>
                <td>{f.metodo}</td>
                <td style={{ color: estaVencida(f.limite) ? "red" : "white" }}>
                  {f.limite}
                </td>
                <td className="flex justify-center gap-2 py-1">
                  <button
                    onClick={() => actualizarEstadoFactura(f.id, "PAGADA")}
                    className="bg-green-600 text-white text-sm px-2 py-1 rounded disabled:opacity-50"
                    disabled={f.estado !== "PENDIENTE"}
                  >
                    Pagada
                  </button>
                  <button
                    onClick={() => actualizarEstadoFactura(f.id, "ANULADA")}
                    className="bg-red-600 text-white text-sm px-2 py-1 rounded disabled:opacity-50"
                    disabled={f.estado !== "PENDIENTE"}
                  >
                    Anulada
                  </button>
                </td>
                <td>{f.estado}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

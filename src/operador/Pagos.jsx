import { useState, useEffect } from "react";

const initialPagos = [
  { id: 102, cliente: "Juan Pérez", habitacion: 102, monto: 120, metodo:"Online", limite:"Antes 14:30", estado:"Pendiente" }
];

export default function Pagos() {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("pagos");
    if (stored) {
      setPagos(JSON.parse(stored));
    } else {
      setPagos(initialPagos);
      localStorage.setItem("pagos", JSON.stringify(initialPagos));
    }
  }, []);

  const actualizarPagos = (nuevos) => {
    setPagos(nuevos);
    localStorage.setItem("pagos", JSON.stringify(nuevos));
  };

  const procesarPago = (id, aprobado) => {
    const nuevosPagos = pagos.map(p =>
      p.id === id ? { ...p, estado: aprobado ? "Aceptado" : "Rechazado" } : p
    );
    actualizarPagos(nuevosPagos);

    // 🔹 Sincroniza Reservas y Habitaciones
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || {};

    const reserva = reservas.find(r => r.id === id);
    if (reserva) {
      if (aprobado) {
        reserva.estado = "Pago confirmado - Habitación ocupada";
        habitaciones[`hab-${reserva.habitacion}`] = {
          estado: "ocupada",
          cliente: reserva.cliente,
          salida: reserva.salida
        };
      } else {
        reserva.estado = "Pago rechazado";
        habitaciones[`hab-${reserva.habitacion}`] = {
          estado: "disponible",
          cliente: "",
          salida: ""
        };
      }
    }

    localStorage.setItem("reservas", JSON.stringify(reservas));
    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
  };

  // 🔹 Borrar historial visual
  const borrarHistorial = () => {
    const filtrados = pagos.filter(p => p.estado === "Pendiente");
    setPagos(filtrados);
  };

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4 flex justify-between items-center">
        Pagos
        <button
          onClick={borrarHistorial}
          className="bg-red-600 px-3 py-1 rounded text-white text-sm"
        >
          Borrar historial
        </button>
      </h2>

      <table className="w-full text-center bg-gray-500 rounded overflow-hidden">
        <thead className="bg-white text-black">
          <tr>
            <th>Reserva</th><th>Cliente</th><th>Habitación</th><th>Monto</th>
            <th>Método</th><th>Límite</th><th>Acción</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map(p => (
            <tr key={p.id}>
              <td>#{p.id}</td>
              <td>{p.cliente}</td>
              <td>{p.habitacion}</td>
              <td>${p.monto}</td>
              <td>{p.metodo}</td>
              <td>{p.limite}</td>
              <td className="flex justify-center gap-2 py-1">
                <button
                  onClick={() => procesarPago(p.id, true)}
                  className="bg-green-600 text-white text-sm px-2 py-1 rounded disabled:opacity-50"
                  disabled={p.estado !== "Pendiente"}
                >
                  Aceptar
                </button>
                <button
                  onClick={() => procesarPago(p.id, false)}
                  className="bg-red-600 text-white text-sm px-2 py-1 rounded disabled:opacity-50"
                  disabled={p.estado !== "Pendiente"}
                >
                  Rechazar
                </button>
              </td>
              <td>{p.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

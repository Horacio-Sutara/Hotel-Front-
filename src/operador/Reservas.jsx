import { useState, useEffect } from "react";

const initialReservas = [
  { id: 102, cliente: "Juan Pérez", habitacion: 102, entrada: "03/09", salida: "06/09", estado: "Esperando confirmación de pago" }
];

export default function Reservas() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("reservas");
    if (stored) {
      setReservas(JSON.parse(stored));
    } else {
      setReservas(initialReservas);
      localStorage.setItem("reservas", JSON.stringify(initialReservas));
    }
  }, []);

  const actualizarReservas = (nuevas) => {
    setReservas(nuevas);
    localStorage.setItem("reservas", JSON.stringify(nuevas));
  };

  const liberarHabitacion = (id) => {
    const nuevas = reservas.map(r =>
      r.id === id ? { ...r, estado: "Habitación liberada" } : r
    );
    actualizarReservas(nuevas);

    const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || {};
    const reserva = reservas.find(r => r.id === id);
    if (reserva) {
      habitaciones[`hab-${reserva.habitacion}`] = {
        estado: "disponible",
        cliente: "",
        salida: ""
      };
    }
    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
  };

  // 🔹 Borrar historial visual
  const borrarHistorial = () => {
    const filtradas = reservas.filter(r => !["Pago rechazado","Habitación liberada"].includes(r.estado));
    setReservas(filtradas);
  };

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4 flex justify-between items-center">
        Reservas Activas
        <button
          onClick={borrarHistorial}
          className="bg-red-600 px-3 py-1 rounded text-white text-sm"
        >
          Borrar historial
        </button>
      </h2>

      <table className="w-full text-center text-white bg-gray-500 rounded overflow-hidden">
        <thead className="bg-white text-black">
          <tr>
            <th>Cliente</th>
            <th>Habitación</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Estado / Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td>{r.cliente}</td>
              <td>{r.habitacion}</td>
              <td>{r.entrada}</td>
              <td>{r.salida}</td>
              <td>
                {r.estado === "Pago confirmado - Habitación ocupada" ? (
                  <button
                    onClick={() => liberarHabitacion(r.id)}
                    className="bg-orange-500 px-3 py-1 rounded text-white text-sm"
                  >
                    Liberar
                  </button>
                ) : (
                  r.estado
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

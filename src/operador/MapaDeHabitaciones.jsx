import { useState, useEffect } from "react";

const initialHabitaciones = {
  "hab-101": { estado: "disponible", cliente: "", salida: "" },
  "hab-102": { estado: "reserva", cliente: "Juan Pérez", salida: "06/09" },
  "hab-103": { estado: "disponible", cliente: "", salida: "" },
  "hab-104": { estado: "disponible", cliente: "", salida: "" },
  "hab-105": { estado: "disponible", cliente: "", salida: "" },
  "hab-106": { estado: "disponible", cliente: "", salida: "" },
  "hab-107": { estado: "disponible", cliente: "", salida: "" },
  "hab-108": { estado: "disponible", cliente: "", salida: "" },
  "hab-109": { estado: "disponible", cliente: "", salida: "" },
  "hab-110": { estado: "disponible", cliente: "", salida: "" },
  "hab-201": { estado: "disponible", cliente: "", salida: "" },
  "hab-202": { estado: "disponible", cliente: "", salida: "" },
  "hab-203": { estado: "disponible", cliente: "", salida: "" },
  "hab-204": { estado: "disponible", cliente: "", salida: "" },
  "hab-205": { estado: "disponible", cliente: "", salida: "" },
  "hab-206": { estado: "disponible", cliente: "", salida: "" },
  "hab-207": { estado: "disponible", cliente: "", salida: "" },
  "hab-208": { estado: "disponible", cliente: "", salida: "" },
  "hab-209": { estado: "disponible", cliente: "", salida: "" },
  "hab-210": { estado: "disponible", cliente: "", salida: "" },
};

export default function MapaDeHabitaciones() {
  const [habitaciones, setHabitaciones] = useState({});

  // 🔹 Cargar estado desde localStorage o inicial
  useEffect(() => {
    const stored = localStorage.getItem("habitaciones");
    if (stored) {
      setHabitaciones(JSON.parse(stored));
    } else {
      setHabitaciones(initialHabitaciones);
      localStorage.setItem("habitaciones", JSON.stringify(initialHabitaciones));
    }
  }, []);

  const getTooltip = (id) => {
    const hab = habitaciones[id];
    switch (hab.estado) {
      case "disponible":
        return "Disponible";
      case "reserva":
        return `Reserva en confirmación\nCliente: ${hab.cliente}`;
      case "ocupada":
        return `Ocupada\nCliente: ${hab.cliente}\nSalida: ${hab.salida}`;
      case "cerrada":
        return "Cerrada por mantenimiento";
      default:
        return "";
    }
  };

  if (!habitaciones || Object.keys(habitaciones).length === 0) return null;

  return (
    <div className="space-y-8">
      {[1, 2].map((piso) => (
        <div key={piso}>
          <h3 className="text-xl font-bold text-white mb-2">Piso {piso}</h3>
          <div className="grid grid-cols-10 gap-2">
            {Object.keys(habitaciones)
              .filter((h) => h.startsWith(`hab-${piso}`))
              .map((habId) => (
                <div
                  key={habId}
                  className={`relative p-4 rounded text-center font-bold border-2 ${
                    habitaciones[habId].estado === "disponible"
                      ? "border-green-500 text-green-400"
                      : habitaciones[habId].estado === "reserva"
                      ? "border-orange-500 text-orange-400"
                      : habitaciones[habId].estado === "ocupada"
                      ? "border-red-500 text-red-400"
                      : "border-gray-500 text-gray-400"
                  }`}
                  title={getTooltip(habId)}
                >
                  {habId.split("-")[1]}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

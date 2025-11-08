import { useState, useEffect } from "react";

export default function MapaDeHabitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/habitaciones");
        if (!res.ok) throw new Error("Error al obtener habitaciones");
        const data = await res.json();
        // 🔹 Ordenamos por ID ascendente
        const ordenadas = data.sort((a, b) => a.id - b.id);
        setHabitaciones(ordenadas);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchHabitaciones();
  }, []);

  const getColor = (estado) => {
    switch (estado) {
      case "DISPONIBLE":
        return "border-green-500 text-green-400";
      case "OCUPADA":
        return "border-red-500 text-red-400";
      case "MANTENIMIENTO":
        return "border-yellow-500 text-yellow-400";
      default:
        return "border-gray-500 text-gray-400";
    }
  };

  const getTooltip = (habitacion) => {
    return `Estado: ${habitacion.estado}\nNombre: ${habitacion.nombre}\nTipo: ${habitacion.tipo}`;
  };

  if (!habitaciones.length) {
    return <p className="text-white text-center mt-4">Cargando habitaciones...</p>;
  }

  // 🔹 Agrupamos las habitaciones por piso según su id
  const pisos = {};
  habitaciones.forEach((hab) => {
    const piso = hab.id < 200 ? 1 : 2; // 👈 Ajusta según tu DB
    if (!pisos[piso]) pisos[piso] = [];
    pisos[piso].push(hab);
  });

  // 🔹 Ordenamos cada piso por id también (por si acaso)
  Object.keys(pisos).forEach((p) => {
    pisos[p].sort((a, b) => a.id - b.id);
  });

  return (
    <div className="space-y-8">
      {Object.keys(pisos).map((piso) => (
        <div key={piso}>
          <h3 className="text-xl font-bold text-white mb-2">Piso {piso}</h3>
          <div className="grid grid-cols-10 gap-2">
            {pisos[piso].map((hab) => (
              <div
                key={hab.id}
                className={`relative p-4 rounded text-center font-bold border-2 transition-transform transform hover:scale-105 ${getColor(hab.estado)}`}
                title={getTooltip(hab)}
              >
                {hab.id}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

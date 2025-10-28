import { useState } from "react";

export default function Consultas() {
  const [filtro, setFiltro] = useState("");
  const [resultados, setResultados] = useState([]);

  const datosEjemplo = [
    { id: 1, habitacion: "101", operador: "María", estado: "Ocupada", monto: 45000 },
    { id: 2, habitacion: "102", operador: "Luis", estado: "Libre", monto: 0 },
    { id: 3, habitacion: "103", operador: "Ana", estado: "Reservada", monto: 30000 },
    { id: 4, habitacion: "104", operador: "Carlos", estado: "Ocupada", monto: 52000 },
  ];

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (!filtro.trim()) {
      setResultados(datosEjemplo);
      return;
    }
    const filtrados = datosEjemplo.filter(
      (d) =>
        d.habitacion.includes(filtro) ||
        d.operador.toLowerCase().includes(filtro.toLowerCase()) ||
        d.estado.toLowerCase().includes(filtro.toLowerCase())
    );
    setResultados(filtrados);
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">🔍 Consultas Parametrizadas</h2>

      <form
        onSubmit={manejarBusqueda}
        className="flex items-center gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Buscar por habitación, operador o estado..."
          className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition"
        >
          Buscar
        </button>
      </form>

      {resultados.length > 0 ? (
        <table className="w-full border border-zinc-700 text-gray-300">
          <thead className="bg-zinc-800">
            <tr>
              <th className="py-2 border-b border-zinc-700">Habitación</th>
              <th className="py-2 border-b border-zinc-700">Operador</th>
              <th className="py-2 border-b border-zinc-700">Estado</th>
              <th className="py-2 border-b border-zinc-700">Monto ($)</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-800 transition">
                <td className="py-2 text-center">{r.habitacion}</td>
                <td className="py-2 text-center">{r.operador}</td>
                <td className="py-2 text-center">{r.estado}</td>
                <td className="py-2 text-center">{r.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 text-center mt-4">
          No se encontraron resultados. Intenta otra búsqueda.
        </p>
      )}
    </div>
  );
}

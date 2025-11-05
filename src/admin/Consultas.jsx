import { useState, useEffect } from "react";

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarNoRespondidas, setMostrarNoRespondidas] = useState(false);

  // 🔹 Suponiendo que el id del admin está guardado en localStorage al hacer login
  const adminId = localStorage.getItem("id");

  // Cargar consultas
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/consultas")
      .then((res) => res.json())
      .then((data) => setConsultas(data))
      .catch((err) => console.error("Error al cargar consultas:", err));
  }, []);

  // Cargar respuestas (solo si hay adminId)
  useEffect(() => {
    if (adminId) {
      fetch(`http://127.0.0.1:5000/api/respuestas_consultas?admin_id=${adminId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setRespuestas(data);
          else console.warn("Respuesta inesperada:", data);
        })
        .catch((err) => console.error("Error al cargar respuestas:", err));
    }
  }, [adminId]);

  // Filtrado según botón activado
  const consultasFiltradas = mostrarNoRespondidas
    ? consultas.filter((c) => c.estado === "PENDIENTE")
    : consultas;

  return (
    <div className="bg-zinc-900 p-8 rounded-lg shadow-lg space-y-12">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        Consultas de Clientes
      </h2>

      {/* ---------- Sección Consultas ---------- */}
      <div>
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setMostrarNoRespondidas(!mostrarNoRespondidas)}
            className={`px-6 py-3 rounded text-white font-medium transition ${
              mostrarNoRespondidas
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-zinc-700 hover:bg-zinc-600"
            }`}
          >
            {mostrarNoRespondidas ? "Mostrar todas" : "Mostrar no respondidas"}
          </button>
        </div>

        {consultasFiltradas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-zinc-700 text-gray-300 text-lg">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">Email</th>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">Nombre</th>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">Teléfono</th>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">Estado</th>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">Mensaje</th>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">Fecha Envío</th>
                </tr>
              </thead>
              <tbody>
                {consultasFiltradas.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-zinc-800 transition border-b border-zinc-800"
                  >
                    <td className="py-4 px-6">{r.email}</td>
                    <td className="py-4 px-6">{r.nombre}</td>
                    <td className="py-4 px-6">{r.telefono || "N/A"}</td>
                    <td
                      className={`py-4 px-6 font-semibold ${
                        r.estado === "PENDIENTE"
                          ? "text-yellow-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {r.estado}
                    </td>
                    <td className="py-4 px-6">{r.mensaje}</td>
                    <td className="py-4 px-6">
                      {r.fecha_envio
                        ? new Date(r.fecha_envio).toLocaleString()
                        : "Sin fecha"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-6 text-lg">
            No hay consultas para mostrar.
          </p>
        )}
      </div>

      {/* ---------- Sección Respuestas ---------- */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-white text-center">
          Respuestas a Consultas
        </h3>

        {respuestas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-zinc-700 text-gray-300 text-lg">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">ID Consulta</th>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">ID Operador</th>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">Mensaje</th>
                  <th className="py-4 px-6 border-b border-zinc-700 text-left">Fecha Respuesta</th>
                </tr>
              </thead>
              <tbody>
                {respuestas.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-zinc-800 transition border-b border-zinc-800"
                  >
                    <td className="py-4 px-6">{r.id_consulta}</td>
                    <td className="py-4 px-6">{r.id_operador}</td>
                    <td className="py-4 px-6">{r.mensaje}</td>
                    <td className="py-4 px-6">
                      {r.fecha_respuesta
                        ? new Date(r.fecha_respuesta).toLocaleString()
                        : "Sin fecha"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-6 text-lg">
            No hay respuestas registradas.
          </p>
        )}
      </div>
    </div>
  );
}

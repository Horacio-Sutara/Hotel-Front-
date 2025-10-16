import { useState, useEffect } from "react";

export default function AbrirCerrar() {
  const [habitaciones, setHabitaciones] = useState({});
  const [seleccionada, setSeleccionada] = useState("");
  const [lista, setLista] = useState([]);

  // 🔹 Cargar habitaciones y lista desde localStorage
  useEffect(() => {
    const storedHabitaciones = localStorage.getItem("habitaciones");
    const storedLista = localStorage.getItem("listaHabitaciones");

    if (storedHabitaciones) setHabitaciones(JSON.parse(storedHabitaciones));
    if (storedLista) setLista(JSON.parse(storedLista));
  }, []);

  // 🔹 Guardar habitaciones en localStorage
  const actualizarHabitaciones = (nuevas) => {
    setHabitaciones(nuevas);
    localStorage.setItem("habitaciones", JSON.stringify(nuevas));
  };

  // 🔹 Guardar lista en localStorage
  const actualizarLista = (nuevaLista) => {
    setLista(nuevaLista);
    localStorage.setItem("listaHabitaciones", JSON.stringify(nuevaLista));
  };

  const agregarHabitacion = () => {
    if (!seleccionada || lista.includes(seleccionada)) return;
    const nuevaLista = [...lista, seleccionada];
    actualizarLista(nuevaLista);
    setSeleccionada("");
  };

  const abrir = (id) => {
    const nuevas = {
      ...habitaciones,
      [id]: { ...habitaciones[id], estado: "disponible" },
    };
    actualizarHabitaciones(nuevas);
  };

  const cerrar = (id) => {
    const nuevas = {
      ...habitaciones,
      [id]: { ...habitaciones[id], estado: "cerrada" },
    };
    actualizarHabitaciones(nuevas);
  };

  const borrar = (id) => {
    const nuevaLista = lista.filter((h) => h !== id);
    actualizarLista(nuevaLista);
  };

  if (!habitaciones || Object.keys(habitaciones).length === 0) return null;

  const todas = Object.keys(habitaciones);

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4">
        Abrir / Cerrar Habitaciones
      </h2>

      <div className="mb-4 flex gap-2">
        <select
          value={seleccionada}
          onChange={(e) => setSeleccionada(e.target.value)}
          className="p-2 rounded border bg-amber-50 text-black"
        >
          <option value="">Seleccionar habitación</option>
          {todas.map((id) => (
            <option key={id} value={id}>
              {id.split("-")[1]}
            </option>
          ))}
        </select>

        <button
          onClick={agregarHabitacion}
          className="px-3 py-1 border rounded bg-white text-black"
        >
          Añadir
        </button>
      </div>

      <table className="w-full text-center text-white bg-gray-500 rounded overflow-hidden">
        <thead className="bg-white text-black">
          <tr>
            <th>Habitación</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((hab) => {
            const estado = habitaciones[hab]?.estado || "desconocido";
            return (
              <tr key={hab}>
                <td>{hab.split("-")[1]}</td>
                <td
                  className={`font-bold ${
                    estado === "disponible" ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {estado}
                </td>
                <td className="flex justify-center gap-4 py-2">
                  <button
                    onClick={() => abrir(hab)}
                    disabled={estado === "disponible"}
                    className={`px-2 py-1 rounded text-white ${
                      estado === "disponible"
                        ? "bg-green-800 opacity-60 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    Abrir
                  </button>

                  <button
                    onClick={() => cerrar(hab)}
                    disabled={estado === "cerrada"}
                    className={`px-2 py-1 rounded text-white ${
                      estado === "cerrada"
                        ? "bg-red-800 opacity-60 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    Cerrar
                  </button>

                  <button
                    onClick={() => borrar(hab)}
                    className="px-2 py-1 bg-white text-black rounded hover:bg-gray-200"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

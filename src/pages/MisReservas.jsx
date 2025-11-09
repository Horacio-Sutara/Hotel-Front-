import { useEffect, useState } from "react";

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const user = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/reservas/cliente/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setReservas(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al obtener reservas:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const cancelarReserva = async (idReserva) => {
    if (window.confirm("¿Seguro que deseas cancelar esta reserva?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/reservas/${idReserva}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setReservas((prev) => prev.filter((r) => r.id !== idReserva));
          alert("Reserva cancelada correctamente.");
        } else {
          alert("No se pudo cancelar la reserva.");
        }
      } catch (error) {
        console.error("Error al cancelar reserva:", error);
      }
    }
  };

  if (!user) {
    return (
      <p className="text-center mt-20 text-white">
        Debes iniciar sesión para ver tus reservas.
      </p>
    );
  }

  if (loading) {
    return <p className="text-center mt-20 text-white">Cargando reservas...</p>;
  }

  // Función para filtrar reservas según el estado o fecha
  const reservasFiltradas = reservas.filter((reserva) => {
    const hoy = new Date();
    const entrada = new Date(reserva.fecha_entrada);
    const salida = new Date(reserva.fecha_salida);

    if (filtro === "futuras") {
      return reserva.estado === "RESERVADA" || entrada >= hoy;
    } else if (filtro === "pasadas") {
      return salida < hoy;
    }
    return true; // todas
  });

  return (
    <div className="max-w-5xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Mis Reservas</h1>

      {/* Filtros */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setFiltro("todas")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            filtro === "todas"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro("futuras")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            filtro === "futuras"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Futuras
        </button>
        <button
          onClick={() => setFiltro("pasadas")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            filtro === "pasadas"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Pasadas
        </button>
      </div>

      {/* Listado */}
      {reservasFiltradas.length === 0 ? (
        <p className="text-center text-gray-400">No se encontraron reservas.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reservasFiltradas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-zinc-900 p-4 rounded-xl shadow-lg border border-zinc-700"
            >
              <img
                src={reserva.imagen_habitacion}
                alt={reserva.nombre_habitacion}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold mb-1">{reserva.nombre_habitacion}</h2>
              <p className="text-sm text-gray-300">
                <strong>Desde:</strong>{" "}
                {new Date(reserva.fecha_entrada).toLocaleDateString()} <br />
                <strong>Hasta:</strong>{" "}
                {new Date(reserva.fecha_salida).toLocaleDateString()} <br />
                <strong>Huéspedes:</strong> {reserva.numero_huespedes} <br />
                <strong>Estado:</strong>{" "}
                <span
                  className={`font-bold ${
                    reserva.estado === "RESERVADA" ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {reserva.estado}
                </span>
              </p>

              {reserva.estado === "RESERVADA" && new Date(reserva.fecha_entrada) > new Date() && (
                <button
                  onClick={() => cancelarReserva(reserva.id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full"
                >
                  Cancelar Reserva
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";

export default function Mails({ operadorId }) {
  const [consultas, setConsultas] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  // 🔹 Cargar consultas al iniciar
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/consultas")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((c) => ({
          id: c.id,
          cliente: c.nombre,
          mensaje: c.mensaje,
          respondida: c.estado === "RESPONDIDO",
          respuesta: c.respuesta || "",
        }));
        setConsultas(mapped);
      })
      .catch((err) => console.error("Error al cargar consultas:", err));
  }, []);

  // 🔹 Función para enviar respuesta
  const responder = async (idConsulta, texto) => {
    if (!texto.trim()) {
      alert("El mensaje no puede estar vacío.");
      return;
    }
    if (loadingIds.includes(idConsulta)) return;

    setLoadingIds((prev) => [...prev, idConsulta]);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/respuestas_consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_operador: operadorId,
          id_consulta: idConsulta,
          mensaje: texto,
        }),
      });

      const data = await response.json();

      // ✅ Verificar respuesta del backend
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permiso para responder esta consulta (403).");
        } else if (response.status === 404) {
          throw new Error("Consulta no encontrada (404).");
        } else {
          throw new Error(data.error || "Error al responder la consulta.");
        }
      }

      // ✅ Si el servidor confirmó la creación
      console.log("Respuesta enviada correctamente:", data.mensaje);
      alert("Respuesta enviada correctamente ✅");

      // Actualiza estado local
      setConsultas((prev) =>
        prev.map((c) =>
          c.id === idConsulta
            ? { ...c, respondida: true, respuesta: texto }
            : c
        )
      );
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      alert(error.message);
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== idConsulta));
    }
  };

  // 🔹 Borrar consultas respondidas (opcional)
  const borrarRespondidas = () => {
    setConsultas((prev) => prev.filter((c) => !c.respondida));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-white font-bold mb-6">Consultas</h2>

      <div className="space-y-5">
        {consultas.map((c) => (
          <div
            key={c.id}
            className="bg-white text-black rounded-xl shadow-md p-5 border border-gray-200"
          >
            <p className="font-bold text-lg mb-1">{c.cliente}:</p>
            <p className="mb-3 font-medium">Mensaje: {c.mensaje}</p>

            {/* Si no fue respondida aún */}
            {!c.respondida && (
              <>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Responder..."
                  value={c.respuesta}
                  onChange={(e) =>
                    setConsultas((prev) =>
                      prev.map((x) =>
                        x.id === c.id
                          ? { ...x, respuesta: e.target.value }
                          : x
                      )
                    )
                  }
                  rows={3}
                ></textarea>
                <button
                  className={`px-4 py-2 rounded-md border text-white ${
                    loadingIds.includes(c.id)
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                  onClick={() => responder(c.id, c.respuesta)}
                  disabled={loadingIds.includes(c.id)}
                >
                  {loadingIds.includes(c.id) ? "Enviando..." : "Enviar"}
                </button>
              </>
            )}

            {/* Si ya fue respondida */}
            {c.respondida && (
              <p className="mt-3 font-bold text-green-600">
                Respuesta enviada: {c.respuesta}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        className="mt-6 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
        onClick={borrarRespondidas}
      >
        Borrar historial de mails
      </button>
    </div>
  );
}

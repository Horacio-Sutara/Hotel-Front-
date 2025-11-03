import { useState, useEffect } from "react";

export default function Mails({ operadorId }) {
  const [consultas, setConsultas] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); // Para evitar doble click

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/consultas")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(c => ({
          id: c.id,
          cliente: c.nombre,
          mensaje: c.mensaje,
          respondida: c.estado === "RESPONDIDO",
          respuesta: c.respuesta || ""
        }));
        setConsultas(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  const responder = async (id, texto) => {
    if (!texto.trim()) return alert("El mensaje no puede estar vacío.");
    if (loadingIds.includes(id)) return;
    setLoadingIds(prev => [...prev, id]);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/respuestas_consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_consulta: id,
          id_operador: operadorId,
          mensaje: texto
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data[1] || "Error al responder consulta");

      setConsultas(prev =>
        prev.map(c =>
          c.id === id ? { ...c, respondida: true, respuesta: texto } : c
        )
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== id));
    }
  };

  const borrarRespondidas = () => {
    setConsultas(prev => prev.filter(c => !c.respondida));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-white font-bold mb-6">Consultas</h2>
      <div className="space-y-5">
        {consultas.map(c => (
          <div
            key={c.id}
            className="bg-white text-black rounded-xl shadow-md p-5 border border-gray-200"
          >
            <p className="font-bold text-lg mb-1">{c.cliente}:</p>
            <p className="mb-3 font-medium">Mensaje: {c.mensaje}</p>

            {!c.respondida && (
              <>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Responder..."
                  value={c.respuesta}
                  onChange={e =>
                    setConsultas(prev =>
                      prev.map(x =>
                        x.id === c.id ? { ...x, respuesta: e.target.value } : x
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

            {c.respondida && (
              <p className="mt-3 font-bold text-green-600">
                Respuesta: {c.respuesta}
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

import { useState } from "react";

const initialConsultas = [
  { id:1, cliente:"Ana López", mensaje:"¿Hay habitaciones con vista al mar?", respondida:false, respuesta:"" }
];

export default function Mails() {
  const [consultas, setConsultas] = useState(initialConsultas);

  const responder = (id, texto) => {
    setConsultas(prev => prev.map(c => c.id===id ? {...c, respondida:true, respuesta:texto} : c));
  };

  const borrarRespondidas = () => {
    setConsultas(prev => prev.filter(c => !c.respondida));
  };

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4">Consultas</h2>
      <div className="space-y-4">
        {consultas.map(c => (
          <div key={c.id} className="border p-4 rounded bg-white text-black">
            <p className="font-bold">{c.cliente}:</p>
            <p>{c.mensaje}</p>
            {!c.respondida && (
              <>
                <textarea className="w-full border p-2 rounded mb-2" placeholder="Responder..." onChange={e => c.respuesta=e.target.value}></textarea>
                <button className="bg-black text-white px-3 py-1 border rounded" onClick={()=>responder(c.id, c.respuesta)}>Enviar</button>
              </>
            )}
            {c.respondida && <p className="mt-2 font-bold text-green-600">Respuesta: {c.respuesta}</p>}
          </div>
        ))}
      </div>
      <button className="mt-4 px-3 py-1  rounded bg-red-500 text-white" onClick={borrarRespondidas}>Borrar historial de mails</button>
    </div>
  );
}

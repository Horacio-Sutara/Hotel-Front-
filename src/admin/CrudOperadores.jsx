import { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";

export default function CrudOperadores() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", email: "", rol: "" });
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  // 🔹 Cargar clientes desde la API
  const cargarUsuarios = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/users");
      const data = await res.json();
      if (!res.ok) throw new Error("Error al cargar usuarios");
      setUsuarios(data.filter(u => u.rol === "CLIENTE" || u.rol === "OPERADOR"));
    } catch (error) {
      console.error(error);
      setMensaje("No se pudieron cargar los usuarios.");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 🔹 Agregar operador a un cliente
  const asignarOperador = async (usuario) => {
    if (enviando) return;
    setEnviando(true);
    setMensaje("");

    if (!usuario.rol || usuario.rol === "ADMINISTRADOR") {
      setMensaje("No se puede asignar a un administrador.");
      setEnviando(false);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: "OPERADOR" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "No se pudo asignar el operador.");
        setEnviando(false);
        return;
      }

      setMensaje("Cliente asignado como operador correctamente.");
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con la API.");
    } finally {
      setEnviando(false);
    }
  };

  // 🔹 Desasignar operador (volver a cliente)
  const desasignarOperador = async (usuario) => {
    if (enviando) return;
    setEnviando(true);
    setMensaje("");

    if (!usuario.rol || usuario.rol === "ADMINISTRADOR") {
      setMensaje("No se puede desasignar un administrador.");
      setEnviando(false);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: "CLIENTE" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "No se pudo desasignar el operador.");
        setEnviando(false);
        return;
      }

      setMensaje("Operador desactivado correctamente.");
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con la API.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">CRUD de Operadores</h2>

      {mensaje && (
        <p
          className={`mb-4 text-center ${
            mensaje.toLowerCase().includes("correctamente")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {mensaje}
        </p>
      )}

      <button
        onClick={cargarUsuarios}
        disabled={enviando}
        className="mb-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        <RefreshCw size={16} /> Actualizar lista
      </button>

      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-800 text-gray-400">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rol</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr
              key={u.id}
              className="border-b border-zinc-700 hover:bg-zinc-800/60"
            >
              <td className="p-3">{u.id}</td>
              <td className="p-3">{u.nombre}</td>
              <td className="p-3">{u.correo}</td>
              <td className="p-3">{u.rol}</td>
              <td className="p-3 text-center flex justify-center gap-2">
                {u.rol === "CLIENTE" && (
                  <button
                    onClick={() => asignarOperador(u)}
                    disabled={enviando}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white flex items-center gap-1"
                  >
                    <Plus size={14} /> Asignar
                  </button>
                )}
                {u.rol === "OPERADOR" && (
                  <button
                    onClick={() => desasignarOperador(u)}
                    disabled={enviando}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Desactivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

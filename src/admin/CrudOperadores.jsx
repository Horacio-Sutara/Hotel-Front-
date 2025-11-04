import { useState, useEffect } from "react";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioRol, setUsuarioRol] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    rol: "OPERADOR",
  });
  const [mensaje, setMensaje] = useState("");
  const [bloqueoClick, setBloqueoClick] = useState(false);

  const admin= JSON.parse(localStorage.getItem("usuario"));

  const adminId = admin.id; // ⚠️ ID real del administrador logueado (ajústalo según tu DB)

  // 🔹 Obtener usuarios activos (operadores y administradores)
  const obtenerUsuarios = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/users");
      const data = await resp.json();

      if (resp.ok) {
        // Mostrar todos los usuarios para que se puedan promocionar
        setUsuarios(data);
      } else {
        setMensaje(data.error || "Error al obtener usuarios");
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setMensaje("Error en la conexión con la API");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // 🔹 Cambiar estado activo/inactivo
  const toggleActivo = async (usuario) => {
    if (bloqueoClick) return;
    setBloqueoClick(true);

    try {
      const resp = await fetch(`http://127.0.0.1:5000/api/users/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_admin: adminId,
          id: usuario.id,
          activo: !usuario.activo,
        }),
      });

      const data = await resp.json();
      if (resp.ok) {
        setMensaje("Estado del usuario actualizado correctamente ✅");
        obtenerUsuarios();
      } else {
        setMensaje(data.error || "Error al actualizar estado del usuario ❌");
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setMensaje("Error en la conexión con la API");
    } finally {
      setTimeout(() => setBloqueoClick(false), 1000);
    }
  };

  // 🔹 Actualizar rol (buscando usuario por sus datos)
  const actualizarRolUsuario = async (e) => {
    e.preventDefault();
    if (bloqueoClick) return;
    setBloqueoClick(true);

    try {
      // 1️⃣ Buscar usuario en la API
      const respUsuarios = await fetch("http://127.0.0.1:5000/api/users");
      const usuariosData = await respUsuarios.json();

      const usuarioEncontrado = usuariosData.find(
        (u) =>
          u.nombre.toLowerCase() === usuarioRol.nombre.toLowerCase() &&
          u.apellido.toLowerCase() === usuarioRol.apellido.toLowerCase() &&
          u.correo.toLowerCase() === usuarioRol.correo.toLowerCase() &&
          u.contraseña === usuarioRol.contraseña
      );

      if (!usuarioEncontrado) {
        setMensaje("❌ No se encontró ningún usuario con esos datos");
        setBloqueoClick(false);
        return;
      }

      // 2️⃣ Enviar actualización con id_admin e id del usuario
      const resp = await fetch(
        `http://127.0.0.1:5000/api/users/${usuarioEncontrado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_admin: adminId,
            id: usuarioEncontrado.id,
            nombre: usuarioEncontrado.nombre,
            apellido: usuarioEncontrado.apellido,
            rol: usuarioRol.rol,
            activo: true,
          }),
        }
      );

      let data;
      try {
        data = await resp.json();
      } catch {
        const texto = await resp.text();
        console.warn("Respuesta no JSON:", texto);
        data = { error: texto };
      }

      if (resp.ok) {
        setMensaje("✅ Rol actualizado correctamente");
        setMostrarModal(false);
        obtenerUsuarios();
      } else {
        setMensaje(data.error || "❌ Error al actualizar el rol del usuario");
      }
    } catch (err) {
      console.error("Error al actualizar rol:", err);
      setMensaje("Error en la conexión con la API");
    } finally {
      setTimeout(() => setBloqueoClick(false), 1000);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Gestión de Operadores y Administradores
      </h2>

      {mensaje && (
        <p
          className={`mb-4 text-center font-semibold ${
            mensaje.includes("✅")
              ? "text-green-400"
              : mensaje.includes("❌")
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {mensaje}
        </p>
      )}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Cambiar Rol de Usuario
        </button>

        <button
          onClick={obtenerUsuarios}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Actualizar Lista
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 bg-gray-900 rounded-lg">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-3 py-2 border border-gray-700">ID</th>
              <th className="px-3 py-2 border border-gray-700">Nombre</th>
              <th className="px-3 py-2 border border-gray-700">Apellido</th>
              <th className="px-3 py-2 border border-gray-700">Correo</th>
              <th className="px-3 py-2 border border-gray-700">Rol</th>
              <th className="px-3 py-2 border border-gray-700">Activo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-gray-800 transition text-gray-100"
              >
                <td className="border border-gray-700 px-3 py-2">{u.id}</td>
                <td className="border border-gray-700 px-3 py-2">{u.nombre}</td>
                <td className="border border-gray-700 px-3 py-2">
                  {u.apellido}
                </td>
                <td className="border border-gray-700 px-3 py-2">{u.correo}</td>
                <td className="border border-gray-700 px-3 py-2">{u.rol}</td>
                <td className="border border-gray-700 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={u.activo}
                    onChange={() => toggleActivo(u)}
                    className="w-5 h-5 accent-green-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para cambiar rol */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-gray-900 text-white rounded-lg p-6 w-[400px] shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Actualizar Rol de Usuario
            </h3>
            <form onSubmit={actualizarRolUsuario} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none"
                value={usuarioRol.nombre}
                onChange={(e) =>
                  setUsuarioRol({ ...usuarioRol, nombre: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none"
                value={usuarioRol.apellido}
                onChange={(e) =>
                  setUsuarioRol({ ...usuarioRol, apellido: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Correo"
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none"
                value={usuarioRol.correo}
                onChange={(e) =>
                  setUsuarioRol({ ...usuarioRol, correo: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none"
                value={usuarioRol.contraseña}
                onChange={(e) =>
                  setUsuarioRol({ ...usuarioRol, contraseña: e.target.value })
                }
                required
              />
              <select
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none"
                value={usuarioRol.rol}
                onChange={(e) =>
                  setUsuarioRol({ ...usuarioRol, rol: e.target.value })
                }
              >
                <option value="OPERADOR">Operador</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-700 px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Actualizar Rol
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="bg-red-700 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";

export default function UsuariosAdmin() {
  const [clientes, setClientes] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [bloqueoClick, setBloqueoClick] = useState(false);

  const admin = JSON.parse(localStorage.getItem("usuario"));
  const adminId = admin?.id;

  // 🔹 Obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const tipo = mostrarInactivos ? "_inactivos" : "";
      const [respClientes, respOperadores, respAdmins] = await Promise.all([
        fetch(`http://127.0.0.1:5000/api/users/clientes${tipo}`),
        fetch(`http://127.0.0.1:5000/api/users/operadores${tipo}`),
        fetch(`http://127.0.0.1:5000/api/users/administradores${tipo}`),
      ]);

      setClientes(await respClientes.json());
      setOperadores(await respOperadores.json());
      setAdministradores(await respAdmins.json());
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setMensaje("Error: no se pudo conectar con la API");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, [mostrarInactivos]);

  // 🔹 Editar datos del usuario
  const editarUsuario = (usuario) => {
    setUsuarioSeleccionado({ ...usuario });
    setMostrarModal(true);
  };

  // 🔹 Actualizar datos
  const actualizarUsuario = async (e) => {
    e.preventDefault();
    if (bloqueoClick) return;
    setBloqueoClick(true);

    try {
      const resp = await fetch(
        `http://127.0.0.1:5000/api/users/${usuarioSeleccionado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_admin: adminId,
            nombre: usuarioSeleccionado.nombre,
            apellido: usuarioSeleccionado.apellido,
            correo: usuarioSeleccionado.correo,
            telefono: usuarioSeleccionado.telefono,
            pais_emision: usuarioSeleccionado.pais_emision,
            rol: usuarioSeleccionado.rol,
            contraseña: usuarioSeleccionado.contraseña,
          }),
        }
      );

      const data = await resp.json();

      if (resp.ok) {
        setMensaje("Usuario actualizado con éxito");
        setMostrarModal(false);
        obtenerUsuarios();
      } else {
        setMensaje(data.error || "Error al actualizar usuario");
      }
    } catch (err) {
      console.error("Error:", err);
      setMensaje("Error en la conexión con la API");
    } finally {
      setTimeout(() => setBloqueoClick(false), 1200);
    }
  };

  // 🔹 Cambiar estado activo/inactivo
  const cambiarActivo = async (usuario) => {
    if (usuario.id === adminId) {
      setMensaje("No puedes desactivar tu propio usuario administrador");
      return;
    }

    try {
      if (usuario.activo) {
        // 🔸 Dar de baja (DELETE)
        const resp = await fetch(
          `http://127.0.0.1:5000/api/users/${usuario.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_admin: adminId }),
          }
        );
        const data = await resp.json();
        if (resp.ok) {
          setMensaje("Usuario dado de baja correctamente");
          obtenerUsuarios();
        } else {
          setMensaje(data.error || "Error al dar de baja al usuario");
        }
      } else {
        // 🔹 Reactivar (PUT)
        const resp = await fetch(
          `http://127.0.0.1:5000/api/users/${usuario.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_admin: adminId,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              correo: usuario.correo,
              telefono: usuario.telefono,
              pais_emision: usuario.pais_emision,
              rol: usuario.rol,
              contraseña: usuario.contraseña,
              activo: true,
            }),
          }
        );
        const data = await resp.json();
        if (resp.ok) {
          setMensaje("Usuario reactivado correctamente");
          obtenerUsuarios();
        } else {
          setMensaje(data.error || "Error al reactivar usuario");
        }
      }
    } catch (err) {
      console.error("Error al cambiar estado del usuario:", err);
      setMensaje("Error en la conexión con la API");
    }
  };

  const renderTabla = (titulo, lista) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2 text-blue-400">{titulo}</h3>
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
              <th className="px-3 py-2 border border-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length > 0 ? (
              lista.map((u) => (
                <tr key={u.id} className="hover:bg-gray-800 transition">
                  <td className="border border-gray-700 px-3 py-2">{u.id}</td>
                  <td className="border border-gray-700 px-3 py-2">
                    {u.nombre}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {u.apellido}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {u.correo}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">{u.rol}</td>
                  <td className="border border-gray-700 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={u.activo}
                      onChange={() => cambiarActivo(u)}
                      disabled={u.id === adminId}
                      className="w-5 h-5 cursor-pointer accent-green-600"
                    />
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-center">
                    <button
                      onClick={() => editarUsuario(u)}
                      className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-white"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-3 text-gray-400 italic"
                >
                  No hay usuarios en esta categoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Gestión de Usuarios (Clientes / Operadores / Administradores)
      </h2>

      {mensaje && (
        <p
          className={`mb-4 text-center font-semibold ${
            mensaje.toLowerCase().includes("éxito") ||
            mensaje.toLowerCase().includes("correctamente")
              ? "text-green-400"
              : mensaje.toLowerCase().includes("error")
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {mensaje}
        </p>
      )}

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setMostrarInactivos(!mostrarInactivos)}
          className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded"
        >
          {mostrarInactivos ? "Mostrar Activos" : "Mostrar Inactivos"}
        </button>

        <button
          onClick={obtenerUsuarios}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Actualizar Listas
        </button>
      </div>

      {renderTabla("Clientes", clientes)}
      {renderTabla("Operadores", operadores)}
      {renderTabla("Administradores", administradores)}

      {mostrarModal && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-gray-900 text-white rounded-lg p-6 w-[420px] shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Editar Usuario
            </h3>
            <form onSubmit={actualizarUsuario} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={usuarioSeleccionado.nombre}
                onChange={(e) =>
                  setUsuarioSeleccionado({
                    ...usuarioSeleccionado,
                    nombre: e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-2 rounded border border-gray-600"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={usuarioSeleccionado.apellido}
                onChange={(e) =>
                  setUsuarioSeleccionado({
                    ...usuarioSeleccionado,
                    apellido: e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-2 rounded border border-gray-600"
              />
              <input
                type="email"
                placeholder="Correo"
                value={usuarioSeleccionado.correo}
                onChange={(e) =>
                  setUsuarioSeleccionado({
                    ...usuarioSeleccionado,
                    correo: e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-2 rounded border border-gray-600"
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={usuarioSeleccionado.telefono || ""}
                onChange={(e) =>
                  setUsuarioSeleccionado({
                    ...usuarioSeleccionado,
                    telefono: e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-2 rounded border border-gray-600"
              />
              <input
                type="text"
                placeholder="País"
                value={usuarioSeleccionado.pais_emision || ""}
                onChange={(e) =>
                  setUsuarioSeleccionado({
                    ...usuarioSeleccionado,
                    pais_emision: e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-2 rounded border border-gray-600"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={usuarioSeleccionado.contraseña || ""}
                onChange={(e) =>
                  setUsuarioSeleccionado({
                    ...usuarioSeleccionado,
                    contraseña: e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-2 rounded border border-gray-600"
              />

              <select
                value={usuarioSeleccionado.rol}
                onChange={(e) =>
                  setUsuarioSeleccionado({
                    ...usuarioSeleccionado,
                    rol: e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-2 rounded border border-gray-600"
              >
                <option value="CLIENTE">Cliente</option>
                <option value="OPERADOR">Operador</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-700 px-4 py-2 rounded hover:bg-green-600"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="bg-red-700 px-4 py-2 rounded hover:bg-red-600"
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

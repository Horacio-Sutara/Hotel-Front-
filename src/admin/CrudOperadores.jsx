import { useState, useEffect } from "react";

export default function UsuariosAdmin() {
  const [clientes, setClientes] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    pais: "",
    correo: "",
    numero_documento: "",
    telefono: "",
    contraseña: "",
    confirmar: "",
    rol: "CLIENTE",
  });
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

  // 🔹 Editar usuario
  const editarUsuario = (usuario) => {
    setUsuarioSeleccionado({ ...usuario });
    setMostrarModal(true);
  };

  // 🔹 Actualizar usuario existente
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
    } catch {
      setMensaje("Error en la conexión con la API");
    } finally {
      setTimeout(() => setBloqueoClick(false), 1200);
    }
  };

// 🔹 Crear nuevo usuario
const crearUsuario = async (e) => {
  e.preventDefault();
  if (bloqueoClick) return;
  setBloqueoClick(true);
  setMensaje("");

  const {
    nombre,
    apellido,
    pais,
    correo,
    numero_documento,
    contraseña,
    confirmar,
    telefono,
    rol,
  } = nuevoUsuario;

  // 🔸 Validaciones básicas
  if (
    !nombre ||
    !apellido ||
    !pais ||
    !correo ||
    !numero_documento ||
    !contraseña ||
    !confirmar
  ) {
    setMensaje("Todos los campos obligatorios deben completarse");
    setBloqueoClick(false);
    return;
  }

  // Validar formato de correo
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    setMensaje("El correo ingresado no es válido");
    setBloqueoClick(false);
    return;
  }

  // Validar que el documento sea numérico
  if (isNaN(numero_documento)) {
    setMensaje("El número de documento debe contener solo números");
    setBloqueoClick(false);
    return;
  }

  // Validar longitud mínima de contraseña
  if (contraseña.length < 4) {
    setMensaje("La contraseña debe tener al menos 4 caracteres");
    setBloqueoClick(false);
    return;
  }

  // Validar coincidencia de contraseñas
  if (contraseña !== confirmar) {
    setMensaje("Las contraseñas no coinciden");
    setBloqueoClick(false);
    return;
  }

  const userData = {
    id_admin: adminId,
    nombre,
    apellido,
    correo,
    contraseña,
    tipo_documento: "DNI",
    numero_documento,
    pais_emision: pais,
    telefono: telefono || "",
    rol,
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      setMensaje("Usuario creado con éxito");
      setMostrarCrear(false);
      obtenerUsuarios();
    } else {
      setMensaje(data.error || "Error al crear usuario");
    }
  } catch {
    setMensaje("Error en la conexión con la API");
  } finally {
    setBloqueoClick(false);
  }
};

  // 🔹 Cambiar activo/inactivo
  const cambiarActivo = async (usuario) => {
    if (usuario.id === adminId) {
      setMensaje("No puedes desactivar tu propio usuario administrador");
      return;
    }

    try {
      const method = usuario.activo ? "DELETE" : "PUT";
      const body = usuario.activo
        ? { id_admin: adminId }
        : {
            id_admin: adminId,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            telefono: usuario.telefono,
            pais_emision: usuario.pais_emision,
            rol: usuario.rol,
            contraseña: usuario.contraseña,
            activo: true,
          };

      const resp = await fetch(
        `http://127.0.0.1:5000/api/users/${usuario.id}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await resp.json();

      if (resp.ok) {
        setMensaje(
          usuario.activo
            ? "Usuario dado de baja correctamente"
            : "Usuario reactivado correctamente"
        );
        obtenerUsuarios();
      } else {
        setMensaje(data.error || "Error al cambiar estado del usuario");
      }
    } catch {
      setMensaje("Error en la conexión con la API");
    }
  };

  // 🔹 Render tabla
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
                  <td className="border border-gray-700 px-3 py-2">{u.nombre}</td>
                  <td className="border border-gray-700 px-3 py-2">{u.apellido}</td>
                  <td className="border border-gray-700 px-3 py-2">{u.correo}</td>
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
        <p className="mb-4 text-center font-semibold text-yellow-400">
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

        <div className="flex gap-3">
          <button
            onClick={obtenerUsuarios}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            Actualizar Listas
          </button>
          <button
            onClick={() => setMostrarCrear(true)}
            className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded"
          >
            Crear Usuario
          </button>
        </div>
      </div>

      {renderTabla("Clientes", clientes)}
      {renderTabla("Operadores", operadores)}
      {renderTabla("Administradores", administradores)}

      {/* 🔹 Modal Editar Usuario */}
{mostrarModal && usuarioSeleccionado && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
    <div className="bg-gray-900 text-white rounded-lg p-6 w-[420px] border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Editar Usuario
      </h3>
      <form onSubmit={actualizarUsuario} className="space-y-3">
        <input
          type="text"
          value={usuarioSeleccionado.nombre}
          onChange={(e) =>
            setUsuarioSeleccionado({
              ...usuarioSeleccionado,
              nombre: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="text"
          value={usuarioSeleccionado.apellido}
          onChange={(e) =>
            setUsuarioSeleccionado({
              ...usuarioSeleccionado,
              apellido: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="email"
          value={usuarioSeleccionado.correo}
          onChange={(e) =>
            setUsuarioSeleccionado({
              ...usuarioSeleccionado,
              correo: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="text"
          value={usuarioSeleccionado.telefono || ""}
          onChange={(e) =>
            setUsuarioSeleccionado({
              ...usuarioSeleccionado,
              telefono: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <select
          value={usuarioSeleccionado.rol}
          onChange={(e) =>
            setUsuarioSeleccionado({
              ...usuarioSeleccionado,
              rol: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        >
          <option value="CLIENTE">Cliente</option>
          <option value="OPERADOR">Operador</option>
          <option value="ADMINISTRADOR">Administrador</option>
        </select>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500"
          >
            Guardar
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


{/* 🔹 Modal Crear Usuario */}
{mostrarCrear && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
    <div className="bg-gray-900 text-white rounded-lg p-6 w-[420px] border border-gray-700 relative">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Crear Nuevo Usuario
      </h3>

      {/* 🔸 Mensaje dentro del modal */}
      {mensaje && (
        <p
          className={`text-center mb-3 font-semibold ${
            mensaje.includes("éxito") || mensaje.includes("creado")
              ? "text-green-400"
              : "text-red-500"
          }`}
        >
          {mensaje}
        </p>
      )}

      <form onSubmit={crearUsuario} className="space-y-3">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoUsuario.nombre}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="text"
          placeholder="Apellido"
          value={nuevoUsuario.apellido}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="text"
          placeholder="País"
          value={nuevoUsuario.pais}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, pais: e.target.value })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="email"
          placeholder="Correo"
          value={nuevoUsuario.correo}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="text"
          placeholder="DNI"
          value={nuevoUsuario.numero_documento}
          onChange={(e) =>
            setNuevoUsuario({
              ...nuevoUsuario,
              numero_documento: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="text"
          placeholder="Teléfono (opcional)"
          value={nuevoUsuario.telefono}
          onChange={(e) =>
            setNuevoUsuario({
              ...nuevoUsuario,
              telefono: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevoUsuario.contraseña}
          onChange={(e) =>
            setNuevoUsuario({
              ...nuevoUsuario,
              contraseña: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={nuevoUsuario.confirmar}
          onChange={(e) =>
            setNuevoUsuario({
              ...nuevoUsuario,
              confirmar: e.target.value,
            })
          }
          className="w-full bg-gray-800 p-2 rounded"
        />

        <select
          value={nuevoUsuario.rol}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
          }
          className="w-full bg-gray-800 p-2 rounded"
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
            Crear
          </button>
          <button
            type="button"
            onClick={() => setMostrarCrear(false)}
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

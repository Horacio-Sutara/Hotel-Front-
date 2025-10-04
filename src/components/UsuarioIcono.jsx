import React, { useState } from "react";
import "./UsuarioIcono.css";

export default function UsuarioIcono({ usuario, onCambiarUsuario }) {
  const [showModal, setShowModal] = useState(false);
  const [cerrando, setCerrando] = useState(false);

  if (!usuario) return null;


  // Extraer nombre del email si no hay campo nombre
  const nombre = usuario.nombre || usuario.email.split("@")[0];

  // Color del icono según tipo de usuario
  let colorIcono = "#6d4c41"; // marrón cliente
  if (usuario.tipo === "operador") colorIcono = "#d32f2f"; // rojo operador
  else if (usuario.tipo === "administrador") colorIcono = "#1976d2"; // azul admin

  return (
    <div className="usuario-icono-container">
      <div
        className="usuario-icono"
        onClick={() => setShowModal(true)}
        title="Ver perfil"
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="20" fill={colorIcono} />
          <circle cx="20" cy="15" r="7" fill="#f5f1e3" />
          <ellipse cx="20" cy="30" rx="10" ry="7" fill="#f5f1e3" />
        </svg>
      </div>
      {showModal && (
        <div className="usuario-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="usuario-modal" onClick={e => e.stopPropagation()}>
            <h2>Perfil de usuario</h2>
            <div className="usuario-datos">
              <p><strong>Nombre:</strong> {nombre}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Tipo de usuario:</strong> {usuario.tipo ? usuario.tipo : 'cliente'}</p>
            </div>
            <button className="btn-brown" onClick={() => {
              setCerrando(true);
              setTimeout(() => {
                setShowModal(false);
                setCerrando(false);
                if(onCambiarUsuario) onCambiarUsuario();
              }, 1800);
            }} style={{marginBottom: '10px'}}>Cerrar sesión</button>
            <button className="btn-brown" onClick={() => setShowModal(false)}>Cerrar</button>
            {cerrando && (
              <div className="usuario-cargando-icono" style={{marginTop: '18px'}}></div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

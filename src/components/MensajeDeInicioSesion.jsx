import React from "react";
import "./MensajeDeInicioSesion.css";

export default function MensajeDeInicioSesion({ mostrar }) {
  if (!mostrar) return null;
  return (
    <div className="mensaje-inicio-sesion">
      INICIE SESIÓN PRIMERO PARA RESERVAR
    </div>
  );
}

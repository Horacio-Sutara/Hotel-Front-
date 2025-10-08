import  { useState } from "react";
import ModalReservaExitosa from "./ModalReservaExitosa";

export default function Reservas({ onCerrar }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [habitaciones, setHabitaciones] = useState(1);
  const [tipoHabitacion, setTipoHabitacion] = useState("estandar");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errorFecha, setErrorFecha] = useState("");

  function fechasValidas() {
    if (!checkin || !checkout) return false;
    const fechaIngreso = new Date(checkin);
    const fechaEgreso = new Date(checkout);
    if (fechaIngreso >= fechaEgreso) return false;
    return true;
  }

  function handleReservar() {
    if (!fechasValidas()) {
      setErrorFecha("La fecha de ingreso debe ser anterior a la de egreso y no pueden ser iguales.");
      return;
    }
    setErrorFecha("");
    setMostrarModal(true);
  }

  function handleCerrarModal() {
    setMostrarModal(false);
    if (onCerrar) {
      onCerrar();
    }
  }

  return (
    <>
      <div className="reservas-bloque">
        <div className="reservas-campos">
          <div className="reservas-grupo">
            <span className="reservas-label">FECHAS DE ESTADÍA</span>
            <div className="reservas-fechas">
              <div>
                <label>Ingreso</label>
                <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} />
              </div>
              <div>
                <label>Egreso</label>
                <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} />
              </div>
            </div>
            {errorFecha && (
              <div style={{ color: '#000000ff', marginTop: '8px', fontWeight: 'bold', fontSize: '0.98rem' }}>
                {errorFecha}
              </div>
            )}
          </div>
          <div className="reservas-grupo">
            <span className="reservas-label">HABITACIONES Y HUÉSPEDES</span>
            <div className="reservas-huespedes">
              <div>
                <label>Adultos</label>
                <div className="reservas-contador">
                  <button type="button" onClick={() => setAdultos(Math.max(1, adultos-1))}>-</button>
                  <span>{adultos}</span>
                  <button type="button" onClick={() => setAdultos(adultos+1)}>+</button>
                </div>
              </div>
              <div>
                <label>Niños</label>
                <div className="reservas-contador">
                  <button type="button" onClick={() => setNinos(Math.max(0, ninos-1))}>-</button>
                  <span>{ninos}</span>
                  <button type="button" onClick={() => setNinos(ninos+1)}>+</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <label>Habitaciones</label>
                    <select value={habitaciones} onChange={e => setHabitaciones(Number(e.target.value))}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Tipo de habitación</label>
                    <select value={tipoHabitacion} onChange={e => setTipoHabitacion(e.target.value)}>
                      <option value="estandar">Estándar</option>
                      <option value="deluxe">Deluxe</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="reservas-btn" type="button" onClick={handleReservar}>RESERVAR AHORA</button>
        <button className="reservas-cerrar" type="button" onClick={onCerrar}>Cancelar</button>
      </div>
      <ModalReservaExitosa mostrar={mostrarModal} onClose={handleCerrarModal} />
    </>
  );
}

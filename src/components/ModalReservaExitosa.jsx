
export default function ModalReservaExitosa({ mostrar, onClose }) {
  if (!mostrar) return null;
  return (
    <div className="modal-reserva-overlay">
      <div className="modal-reserva">
        <h2>¡Reservación realizada con éxito!</h2>
        <p>Tu reserva ha sido registrada correctamente.</p>
        <button className="modal-reserva-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

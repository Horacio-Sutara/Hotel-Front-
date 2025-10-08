
export default function Contacto() {
  return (
    <section className="contacto">
      <h2>Contacto</h2>
      <div className="contacto-bloque">
        <form className="contacto-form">
          <input type="text" placeholder="Tu nombre" required />
          <input type="email" placeholder="Tu email" required />
          <textarea placeholder="Escribe tu mensaje" rows={4} required />
          <button type="submit">Enviar</button>
        </form>
        <div className="contacto-info">
          <div>
            <span className="icono">&#128222;</span>
            <span>+54 11 1234-5678</span>
          </div>
          <div>
            <span className="icono">&#9993;</span>
            <span>hotel@ejemplo.com</span>
          </div>
        </div>
      </div>
    </section>
  );
}
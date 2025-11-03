import { useEffect, useState } from "react";
import L from "leaflet";
import portadaContacto from "../assets/fotodecontacto.png";

export default function ContactoPage() {
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Eliminar mapa previo (React Strict Mode)
    const existingMap = document.getElementById("map");
    if (existingMap && existingMap._leaflet_id) {
      existingMap._leaflet_id = null;
    }

    // Coordenadas fijas: Salta, Argentina
    const coordenadasHotel = [-24.740727, -65.391735];
    const map = L.map("map").setView(coordenadasHotel, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker(coordenadasHotel)
      .addTo(map)
      .bindPopup("📍 Aquí está el Hotel Ramolia")
      .openPopup();

    return () => map.remove();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (enviando) return; // Evita doble envío
    setEnviando(true);
    setMensaje("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: e.target.nombre.value,
          email: e.target.email.value,
          telefono: e.target.telefono.value,
          mensaje: e.target.mensaje.value,
          estado: "PENDIENTE",
        }),
      });

      if (res.ok) {
        setMensaje("Consulta enviada correctamente");
        e.target.reset();
      } else {
        setMensaje("Error al enviar la consulta. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen flex flex-col items-center py-0">
      {/* Imagen de portada */}
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={portadaContacto}
          alt="Portada contacto"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="w-full flex flex-col items-center py-10">
        {/* Mapa */}
        <section className="w-full max-w-6xl text-center mb-12">
          <h2 className="text-3xl font-semibold text-white mb-4">
            ¿Dónde estamos?
          </h2>
          <p className="text-gray-400 mb-6">
            Nos encontramos en el corazón de la ciudad de Salta, rodeados de
            paisajes únicos y lugares turísticos.
          </p>
          <div
            id="map"
            className="w-full h-96 rounded-xl shadow-lg border border-gray-800"
          ></div>
        </section>

        {/* Contacto */}
        <section className="w-full max-w-4xl px-6">
          <h2 className="text-3xl font-semibold text-white text-center mb-6">
            Contacto
          </h2>

          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg grid md:grid-cols-2 gap-10">
            {/* Formulario */}
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                required
                className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Tu email"
                required
                className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Tu teléfono (opcional)"
                className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <textarea
                name="mensaje"
                placeholder="Escribe tu mensaje..."
                rows={4}
                required
                className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                disabled={enviando}
                className={`bg-white text-black font-medium py-2 rounded-lg transition ${
                  enviando
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-600"
                }`}
              >
                {enviando ? "Enviando..." : "Enviar"}
              </button>

              {mensaje && (
  <p className="text-center mt-3 text-green-500">{mensaje}</p>
)}
            </form>

            {/* Información */}
            <div className="flex flex-col justify-center space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">📞</span>
                <span>+54 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">📧</span>
                <span>hotel@ejemplo.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">📍</span>
                <span>Av. Corrientes 1234, Salta, Argentina</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

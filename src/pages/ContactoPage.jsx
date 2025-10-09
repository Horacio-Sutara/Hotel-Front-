
import { useEffect } from "react";
import L from "leaflet";
import portadaContacto from "../assets/fotodecontacto.png";

export default function ContactoPage() {
  useEffect(() => {
    // Eliminar mapa previo (React Strict Mode)
    const existingMap = document.getElementById("map");
    if (existingMap && existingMap._leaflet_id) {
      existingMap._leaflet_id = null;
    }

    // Crear mapa centrado en Buenos Aires
    const map = L.map("map").setView([-34.6037, -58.3816], 13);

    // Capa base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Marcador principal
    L.marker([-34.6037, -58.3816])
      .addTo(map)
      .bindPopup("📍 Aquí está el Hotel Ramolia")
      .openPopup();

    // Intentar ubicar al usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 15);
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("📍 Tú estás aquí")
            .openPopup();
        },
        () => console.warn("No se pudo obtener la ubicación del usuario")
      );
    }

    return () => map.remove();
  }, []);

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
            Nos encontramos en el corazón de la ciudad, a pasos de todo lo que
            necesitás.
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
            <form
              className="flex flex-col space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Mensaje enviado ✅");
              }}
            >
              <input
                type="text"
                placeholder="Tu nombre"
                required
                className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="email"
                placeholder="Tu email"
                required
                className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <textarea
                placeholder="Escribe tu mensaje..."
                rows={4}
                required
                className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-600 text-black font-medium py-2 rounded-lg transition"
              >
                Enviar
              </button>
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
                <span>Av. Corrientes 1234, Buenos Aires</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


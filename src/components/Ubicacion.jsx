import { useEffect } from "react";
import L from "leaflet";
import "./Ubicacion.css";

export default function Ubicacion() {
  useEffect(() => {
    // Verificar si ya existe un mapa y eliminarlo (React Strict Mode)
    const existingMap = document.getElementById("map");
    if (existingMap._leaflet_id) {
      existingMap._leaflet_id = null;
    }

    // Crear mapa con coordenadas de referencia (ej: Buenos Aires)
    const map = L.map("map").setView([-34.6037, -58.3816], 13);

    // Capa base de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Marcador en ubicación por defecto (ejemplo hotel)
    L.marker([-34.6037, -58.3816])
      .addTo(map)
      .bindPopup("📍 Aquí está el Hotel Ramolia")
      .openPopup();

    // Intentar geolocalización del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          map.setView([lat, lng], 15);

          L.marker([lat, lng])
            .addTo(map)
            .bindPopup("📍 Tú estás aquí")
            .openPopup();
        },
        () => {
          console.warn("No se pudo obtener tu ubicación");
        }
      );
    }

    // Limpieza al desmontar
    return () => {
      map.remove();
    };
  }, []);

  return (
    <section id="ubicacion" className="ubicacion-section">
      <h2>¿Dónde estamos?</h2>
      <div id="map" className="map-container"></div>
    </section>
  );
}

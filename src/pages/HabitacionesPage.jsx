import { useState, useEffect } from "react";
import habitacionEstandar from "../assets/Habitacion Estandar.jpg";
import habitacionDeluxe from "../assets/Habitacion Deluxe.jpeg";
import habitacionSuite from "../assets/Habitacion Suite.webp";
import portadaHabitaciones from "../assets/fotodehabitacion.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendarDark.css";

export default function Habitaciones() {
  const [tipo, setTipo] = useState("estandar");
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [reserva, setReserva] = useState({
    fechas: [new Date(), new Date()],
    adultos: 1,
    ninos: 0,
  });
  const [paso, setPaso] = useState(0);
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
  });
  const [pago, setPago] = useState({
    tarjetaRaw: "",
    tarjetaFormateada: "",
    vencimiento: "",
    cvv: "",
    cardType: null,
    cardValid: false,
    expiryValid: false,
    cvvValid: false,
  });

  const diasOcupados = ["2025-10-10", "2025-10-11", "2025-10-14", "2025-10-15"];
  const pasosTexto = ["Revisar Reserva", "Datos Personales", "Método de Pago"];

  // ---------- Habitaciones predeterminadas ----------
  const habitacionesPredeterminadas = {
    estandar: {
      nombre: "Habitación Estándar",
      img: habitacionEstandar,
      descripcion: "Habitación cómoda para 2 personas con baño privado y Wi-Fi.",
      precio: "$120.000 por noche",
      capacidad: 2,
    },
    deluxe: {
      nombre: "Habitación Deluxe",
      img: habitacionDeluxe,
      descripcion: "Habitación espaciosa con balcón, ideal para 3 personas.",
      precio: "$180.000 por noche",
      capacidad: 3,
    },
    suite: {
      nombre: "Suite Premium",
      img: habitacionSuite,
      descripcion: "Suite de lujo con vista panorámica y espacio para 4 personas.",
      precio: "$250.000 por noche",
      capacidad: 4,
    },
  };

  const [habitaciones, setHabitaciones] = useState(habitacionesPredeterminadas);

  // ---------- Traer habitaciones de la API ----------
  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/habitaciones");
        const data = await res.json();

        // Suponiendo que la API devuelve un array de habitaciones con id, nombre, descripcion, precio, capacidad y optional img
        const nuevasHabitaciones = {};
        data.forEach((h) => {
          // Para evitar conflictos de key, usamos id de la API
          nuevasHabitaciones[`api_${h.id}`] = {
            nombre: h.nombre,
            img: h.img || habitacionEstandar, // si no tiene imagen, usamos estándar
            descripcion: h.descripcion,
            precio: h.precio,
            capacidad: h.capacidad,
          };
        });

        // Combinamos las predeterminadas con las de API
        setHabitaciones({ ...habitacionesPredeterminadas, ...nuevasHabitaciones });
      } catch (error) {
        console.error("Error al obtener habitaciones de la API:", error);
      }
    };

    fetchHabitaciones();
  }, []);

  const habitacion = habitaciones[tipo];

  const tileClassName = ({ date }) => {
    const fechaISO = date.toISOString().split("T")[0];
    return diasOcupados.includes(fechaISO)
      ? "bg-red-500 text-white rounded-full"
      : "bg-green-600 text-white rounded-full";
  };

  // ---------- Handlers y validaciones de pago (igual que tu código original) ----------
  const detectCardType = (numbersOnly) => {
    if (!numbersOnly) return null;
    if (/^4/.test(numbersOnly)) return "Visa";
    if (/^5[1-5]/.test(numbersOnly)) return "Mastercard";
    if (/^3[47]/.test(numbersOnly)) return "Amex";
    if (/^6(?:011|5)/.test(numbersOnly)) return "Discover";
    return "Desconocida";
  };

  const formatCardNumber = (numbersOnly, type) => {
    if (!numbersOnly) return "";
    if (type === "Amex") {
      const part1 = numbersOnly.slice(0, 4);
      const part2 = numbersOnly.slice(4, 10);
      const part3 = numbersOnly.slice(10, 15);
      return [part1, part2, part3].filter(Boolean).join(" ");
    } else return numbersOnly.match(/.{1,4}/g)?.join(" ") ?? numbersOnly;
  };

  const luhnCheck = (numStr) => {
    if (!numStr) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = numStr.length - 1; i >= 0; i--) {
      let digit = parseInt(numStr[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const requiredCardLength = (type) => (type === "Amex" ? 15 : 16);
  const requiredCvvLength = (type) => (type === "Amex" ? 4 : 3);

  const handleCardInput = (e) => {
    let raw = e.target.value.replace(/\D/g, "");
    const type = detectCardType(raw);
    if (raw.length > requiredCardLength(type)) raw = raw.slice(0, requiredCardLength(type));
    const formatted = formatCardNumber(raw, type);
    const cardValid = raw.length === requiredCardLength(type) && luhnCheck(raw);
    setPago((p) => ({
      ...p,
      tarjetaRaw: raw,
      tarjetaFormateada: formatted,
      cardType: type,
      cardValid,
      cvvValid: p.cvv ? p.cvv.length === requiredCvvLength(type) : false,
    }));
  };

  const handleExpiryInput = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = raw.length >= 3 ? raw.slice(0, 2) + "/" + raw.slice(2) : raw.length === 2 ? raw + "/" : raw;
    let expiryValid = false;
    if (formatted.length === 5) {
      const mm = parseInt(formatted.slice(0, 2), 10);
      const yy = parseInt(formatted.slice(3), 10);
      expiryValid = mm >= 1 && mm <= 12;
      if (expiryValid) {
        const now = new Date();
        const fullYear = 2000 + yy;
        expiryValid = new Date(fullYear, mm, 0, 23, 59, 59) >= new Date(now.getFullYear(), now.getMonth(), 1);
      }
    }
    setPago((p) => ({ ...p, vencimiento: formatted, expiryValid }));
  };

  const handleCvvInput = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    const value = digits.slice(0, requiredCvvLength(pago.cardType));
    setPago((p) => ({ ...p, cvv: value, cvvValid: value.length === requiredCvvLength(pago.cardType) }));
  };

  const isPaymentReady = () => pago.cardValid && pago.expiryValid && pago.cvvValid;

  const handleConfirmarPago = () => {
    if (!isPaymentReady()) return alert("Completa correctamente los datos de la tarjeta.");
    alert("¡Reserva y pago confirmados!");
    setPaso(0);
    setPago({ tarjetaRaw: "", tarjetaFormateada: "", vencimiento: "", cvv: "", cardType: null, cardValid: false, expiryValid: false, cvvValid: false });
    setUsuario({ nombre: "", apellido: "", dni: "", telefono: "", email: "" });
  };

  // ---------- Validaciones datos personales ----------
  const isNombreValido = /^[a-zA-Z]{2,50}$/.test(usuario.nombre);
  const isApellidoValido = /^[a-zA-Z]{2,50}$/.test(usuario.apellido);
  const isDniValido = /^\d{8}$/.test(usuario.dni);
  const isTelefonoValido = /^\d{8,15}$/.test(usuario.telefono);
  const isEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email);
  const datosPersonalesValidos = isNombreValido && isApellidoValido && isDniValido && isTelefonoValido && isEmailValido;

  return (
    <section className="min-h-screen bg-zinc-950 text-white py-0 px-0">
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img src={portadaHabitaciones} alt="Portada habitaciones" className="w-full h-full object-cover object-center" />
      </div>

      {paso === 0 && (
        <div className="container mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-5xl font-bold text-center mb-10 text-white-400">Habitaciones</h2>

          <div className="flex flex-col items-center mb-12">
            <label htmlFor="tipo" className="text-gray-300 mb-3 text-lg">Elegí una habitación:</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="bg-zinc-800 text-white px-5 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white-400 transition"
            >
              {Object.entries(habitaciones).map(([key, h]) => (
                <option key={key} value={key}>{h.nombre}</option>
              ))}
            </select>
          </div>

          {habitacion && (
            <div className="bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
              <div className="relative md:w-1/2">
                <img src={habitacion.img} alt={habitacion.nombre} className="w-full h-80 md:h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-center">
                  <p className="text-2xl md:text-3xl text-white-400 font-semibold">{habitacion.precio}</p>
                </div>
              </div>

              <div className="md:w-1/2 p-8 space-y-6">
                <h3 className="text-3xl font-semibold text-white-400">{habitacion.nombre}</h3>
                <p className="text-gray-300"><strong className="text-white">Capacidad:</strong> {habitacion.capacidad} personas</p>
                <p className="text-gray-300">{habitacion.descripcion}</p>

                <div className="mt-6">
                  <button onClick={() => setMostrarCalendario(true)} className="bg-white hover:bg-gray-400 text-black px-6 py-2 rounded-lg transition font-semibold">
                    Consultar disponibilidad
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal calendario (paso 0) */}
      {mostrarCalendario && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-[90%] md:w-[600px] text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">Consultar Disponibilidad</h3>
            <Calendar
              onChange={(dates) =>
                setReserva((r) => ({ ...r, fechas: dates }))
              }
              selectRange={true}
              value={reserva.fechas}
              tileClassName={tileClassName}
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Adultos</label>
                <input
                  type="number"
                  min="1"
                  value={reserva.adultos}
                  onChange={(e) =>
                    setReserva({ ...reserva, adultos: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Niños</label>
                <input
                  type="number"
                  min="0"
                  value={reserva.ninos}
                  onChange={(e) =>
                    setReserva({ ...reserva, ninos: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => setMostrarCalendario(false)}
                className="bg-gray-600 hover:bg-gray-700 text-black px-5 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setMostrarCalendario(false); setPaso(1); }}
                className="bg-white hover:bg-gray-400 text-black px-5 py-2 rounded-lg"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pasos de reserva */}
      {paso > 0 && (
        <div className="container mx-auto max-w-xl px-6 py-20 space-y-6">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {pasosTexto[paso - 1]}
          </h2>

          {/* Paso 1: Revisar reserva */}
          {paso === 1 && (
            <div className="bg-zinc-900 p-6 rounded-2xl space-y-4 text-gray-200">
              <p>
                <strong>Habitación:</strong> {habitacion.nombre}
              </p>
              <p>
                <strong>Fechas:</strong>{" "}
                {Array.isArray(reserva.fechas)
                  ? reserva.fechas.map(d => d.toLocaleDateString()).join(" - ")
                  : reserva.fechas.toLocaleDateString()}
              </p>
              <p>
                <strong>Adultos:</strong> {reserva.adultos}
              </p>
              <p>
                <strong>Niños:</strong> {reserva.ninos}
              </p>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setPaso(0)}
                  className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700"
                >
                  Volver
                </button>
                <button
                  onClick={() => setPaso(2)}
                  className="bg-white px-5 py-2 rounded-lg hover:bg-gray-400 text-black"
                >
                  Aceptar
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Datos personales */}
          {paso === 2 && (
            <div className="bg-zinc-900 p-6 rounded-2xl space-y-4">
              {/* Nombre */}
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={usuario.nombre}
                  onChange={(e) =>
                    setUsuario({ ...usuario, nombre: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isNombreValido ? "border-green-500" : "border-red-500"
                  } bg-zinc-800 text-white`}
                />
                {!isNombreValido && usuario.nombre.length > 0 && (
                  <small className="text-red-500">2-50 letras</small>
                )}
              </div>

              {/* Apellido */}
              <div>
                <input
                  type="text"
                  placeholder="Apellido"
                  value={usuario.apellido}
                  onChange={(e) =>
                    setUsuario({ ...usuario, apellido: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isApellidoValido ? "border-green-500" : "border-red-500"
                  } bg-zinc-800 text-white`}
                />
                {!isApellidoValido && usuario.apellido.length > 0 && (
                  <small className="text-red-500">2-50 letras</small>
                )}
              </div>

              {/* DNI */}
              <div>
                <input
                  type="text"
                  placeholder="DNI"
                  value={usuario.dni}
                  onChange={(e) =>
                    setUsuario({
                      ...usuario,
                      dni: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDniValido ? "border-green-500" : "border-red-500"
                  } bg-zinc-800 text-white`}
                />
                {!isDniValido && usuario.dni.length > 0 && (
                  <small className="text-red-500">8 dígitos</small>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={usuario.telefono}
                  onChange={(e) =>
                    setUsuario({
                      ...usuario,
                      telefono: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isTelefonoValido ? "border-green-500" : "border-red-500"
                  } bg-zinc-800 text-white`}
                />
                {!isTelefonoValido && usuario.telefono.length > 0 && (
                  <small className="text-red-500">8-15 dígitos</small>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={usuario.email}
                  onChange={(e) =>
                    setUsuario({ ...usuario, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isEmailValido ? "border-green-500" : "border-red-500"
                  } bg-zinc-800 text-white`}
                />
                {!isEmailValido && usuario.email.length > 0 && (
                  <small className="text-red-500">Email inválido</small>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setPaso(1)}
                  className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700"
                >
                  Volver
                </button>
                <button
                  onClick={() => setPaso(3)}
                  disabled={!datosPersonalesValidos}
                  className={`px-5 py-2 rounded-lg ${
                    datosPersonalesValidos
                      ? "bg-white text-black hover:bg-gray-400"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Pago */}
          {paso === 3 && (
            <div className="bg-zinc-900 p-6 rounded-2xl space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  value={pago.tarjetaFormateada}
                  onChange={handleCardInput}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    pago.cardValid ? "border-green-500" : "border-red-500"
                  } bg-zinc-800 text-white`}
                />
                {pago.cardType && (
                  <small className="text-gray-300">
                    Tipo: {pago.cardType}
                  </small>
                )}
              </div>
              <div className="flex gap-4">
                <div className="w-1/2 flex flex-col">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={pago.vencimiento}
                    onChange={handleExpiryInput}
                    className={`px-3 py-2 rounded-lg border ${
                      pago.expiryValid ? "border-green-500" : "border-red-500"
                    } bg-zinc-800 text-white`}
                  />
                  {!pago.expiryValid && pago.vencimiento.length === 5 && (
                    <small className="text-red-500 mt-1">Fecha no válida</small>
                  )}
                </div>
                <div className="w-1/2 flex flex-col">
                  <input
                    type="text"
                    placeholder="CVV"
                    value={pago.cvv}
                    onChange={handleCvvInput}
                    className={`px-3 py-2 rounded-lg border ${
                      pago.cvvValid ? "border-green-500" : "border-red-500"
                    } bg-zinc-800 text-white`}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setPaso(2)}
                  className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700"
                >
                  Volver
                </button>
                <button
                  onClick={handleConfirmarPago}
                  disabled={!isPaymentReady()}
                  className={`px-5 py-2 rounded-lg ${
                    isPaymentReady()
                      ? "bg-white text-black hover:bg-gray-400"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

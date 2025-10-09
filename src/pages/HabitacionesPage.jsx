import { useState } from "react";
import habitacionEstandar from "../assets/Habitacion Estandar.jpg";
import habitacionDeluxe from "../assets/Habitacion Deluxe.jpeg";
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
  const [paso, setPaso] = useState(0); // 0 = seleccionar habitación, 1-3 = proceso de reserva
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
  });

  // pago: tarjeta sin formatear en tarjetaRaw, tarjetaFormateada para mostrar, expiry mm/aa, cvv, cardType, valid flags
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

  const habitaciones = {
    estandar: {
      nombre: "Habitación Estándar",
      img: habitacionEstandar,
      cama: "Cama Queen",
      caracteristicas: [
        "Habitación de 25 m² con vista interior.",
        "Aire acondicionado y calefacción.",
        "Televisión de 32\" con cable.",
        "Wi-Fi gratuito.",
      ],
      detalles: [
        "Baño privado con ducha.",
        "Armario, escritorio y silla.",
        "Teléfono con llamadas locales.",
        "Servicio de limpieza diario.",
      ],
      servicios: [
        "Acceso al gimnasio.",
        "Servicio a la habitación limitado.",
        "Resguardo de equipaje.",
      ],
      precio: "$120.000 por noche",
    },
    deluxe: {
      nombre: "Habitación Deluxe",
      img: habitacionDeluxe,
      cama: "Cama King",
      caracteristicas: [
        "Habitación de 35 m² con balcón y vista al jardín.",
        "Aire acondicionado y calefacción.",
        "Televisión de 50\" con cable.",
        "Wi-Fi de alta velocidad.",
      ],
      detalles: [
        "Baño completo con secador de cabello.",
        "Minibar y cafetera.",
        "Sofá de descanso y escritorio amplio.",
        "Caja de seguridad digital.",
      ],
      servicios: [
        "Acceso a alberca y gimnasio.",
        "Servicio a la habitación 24 horas.",
        "Recepción y concierge.",
      ],
      precio: "$180.000 por noche",
    },
  };

  const habitacion = habitaciones[tipo];

  const tileClassName = ({ date }) => {
    const fechaISO = date.toISOString().split("T")[0];
    if (diasOcupados.includes(fechaISO)) {
      return "bg-red-500 text-white rounded-full";
    }
    return "bg-green-600 text-white rounded-full";
  };

  // ---------- Helpers de tarjeta ----------
  const detectCardType = (numbersOnly) => {
    if (!numbersOnly) return null;
    if (/^4/.test(numbersOnly)) return "Visa";
    if (/^5[1-5]/.test(numbersOnly)) return "Mastercard";
    if (/^3[47]/.test(numbersOnly)) return "Amex";
    if (/^6(?:011|5)/.test(numbersOnly)) return "Discover";
    return "Desconocida";
  };

  // formato agrupado: Amex 4-6-5, otros 4-4-4-4
  const formatCardNumber = (numbersOnly, type) => {
    if (!numbersOnly) return "";
    if (type === "Amex") {
      // 4-6-5
      const part1 = numbersOnly.slice(0, 4);
      const part2 = numbersOnly.slice(4, 10);
      const part3 = numbersOnly.slice(10, 15);
      return [part1, part2, part3].filter(Boolean).join(" ");
    } else {
      // grupos de 4
      return numbersOnly.match(/.{1,4}/g)?.join(" ") ?? numbersOnly;
    }
  };

  // Luhn para validar número de tarjeta
  const luhnCheck = (numStr) => {
    if (!numStr) return false;
    let sum = 0;
    let shouldDouble = false;
    // recorrer de derecha a izquierda
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

  // longitud requerida según tipo (sin espacios)
  const requiredCardLength = (type) => {
    if (type === "Amex") return 15;
    if (type === "Visa" || type === "Mastercard" || type === "Discover") return 16;
    return 16; // por defecto 16
  };

  // CVV requerido
  const requiredCvvLength = (type) => (type === "Amex" ? 4 : 3);

  // ---------- Handlers de inputs de pago ----------
  const handleCardInput = (e) => {
    // quitar todo lo que no sea dígito
    let raw = e.target.value.replace(/\D/g, "");
    // detectamos tipo según raw
    const type = detectCardType(raw);
    const maxLen = requiredCardLength(type);
    // cortar hasta la longitud máxima
    if (raw.length > maxLen) raw = raw.slice(0, maxLen);

    const formatted = formatCardNumber(raw, type);
    const cardValid = raw.length === maxLen && luhnCheck(raw);

    setPago((p) => ({
      ...p,
      tarjetaRaw: raw,
      tarjetaFormateada: formatted,
      cardType: type,
      cardValid,
      // actualizamos cvvValid porque cvv length puede depender del tipo
      cvvValid: p.cvv ? p.cvv.length === requiredCvvLength(type) : false,
    }));
  };

  const handleExpiryInput = (e) => {
    // permitir solo números y añadir / automáticamente después de 2 digitos
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 4) raw = raw.slice(0, 4); // MMYY
    let formatted = raw;
    if (raw.length >= 3) {
      formatted = raw.slice(0, 2) + "/" + raw.slice(2);
    } else if (raw.length >= 2 && e.nativeEvent && e.nativeEvent.inputType !== "deleteContentBackward") {
      // si llegan 2 dígitos y el usuario sigue tipeando, añadimos la barra
      formatted = raw.slice(0, 2) + "/" + raw.slice(2);
    } else if (raw.length === 2) {
      formatted = raw + "/";
    }
    // validación básica fecha MM/AA
    let expiryValid = false;
    if (formatted.length === 5) {
      const mm = parseInt(formatted.slice(0, 2), 10);
      const yy = parseInt(formatted.slice(3), 10);
      expiryValid = mm >= 1 && mm <= 12;
      // chequeo de expiración real (opcional): convertir a fin de mes y comparar con fecha actual
      if (expiryValid) {
        const now = new Date();
        const fullYear = 2000 + yy;
        // tomar último día del mes
        const expDate = new Date(fullYear, mm, 0, 23, 59, 59);
        expiryValid = expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
      }
    }
    setPago((p) => ({ ...p, vencimiento: formatted, expiryValid }));
  };

  const handleCvvInput = (e) => {
    // solo dígitos, limitar por tipo de tarjeta detectado
    const digits = e.target.value.replace(/\D/g, "");
    const max = requiredCvvLength(pago.cardType);
    const value = digits.slice(0, max);
    const cvvValid = value.length === max;
    setPago((p) => ({ ...p, cvv: value, cvvValid }));
  };

  // ---------- Validar todo antes de confirmar ----------
  const isPaymentReady = () => {
    return pago.cardValid && pago.expiryValid && pago.cvvValid;
  };

  const handleConfirmarPago = () => {
    if (!isPaymentReady()) {
      alert("Por favor completa correctamente los datos de la tarjeta.");
      return;
    }
    // Aquí enviarías los datos al backend / pasarela
    alert("¡Reserva y pago confirmados!");
    // Reset simple y volver a selección
    setPaso(0);
    setPago({
      tarjetaRaw: "",
      tarjetaFormateada: "",
      vencimiento: "",
      cvv: "",
      cardType: null,
      cardValid: false,
      expiryValid: false,
      cvvValid: false,
    });
  };

  // ---------- Resto del componente (selector, modal, pasos) ----------
  const pasosTexto = ["Revisar Reserva", "Datos Personales", "Método de Pago"];

  return (
    <section className="min-h-screen bg-zinc-950 text-white py-0 px-0">
      {/* Imagen de portada */}
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={portadaHabitaciones}
          alt="Portada habitaciones"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Selector principal (paso 0) */}
      {paso === 0 && (
        <div className="container mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-5xl font-bold text-center mb-10 text-white-400">
            Habitaciones
          </h2>

          <div className="flex flex-col items-center mb-12">
            <label htmlFor="tipo" className="text-gray-300 mb-3 text-lg">
              Elegí una habitación:
            </label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="bg-zinc-800 text-white px-5 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white-400 transition"
            >
              <option value="estandar">Habitación Estándar</option>
              <option value="deluxe">Habitación Deluxe</option>
            </select>
          </div>

          <div className="bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="relative md:w-1/2">
              <img
                src={habitacion.img}
                alt={habitacion.nombre}
                className="w-full h-80 md:h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-center">
                <p className="text-2xl md:text-3xl text-white-400 font-semibold">
                  {habitacion.precio}
                </p>
              </div>
            </div>

            <div className="md:w-1/2 p-8 space-y-6">
              <h3 className="text-3xl font-semibold text-white-400">
                {habitacion.nombre}
              </h3>
              <p className="text-gray-300">
                <strong className="text-white">Tipo de cama:</strong>{" "}
                {habitacion.cama}
              </p>

              <div>
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Características
                </h4>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  {habitacion.caracteristicas.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Detalles de la habitación
                </h4>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  {habitacion.detalles.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Servicios generales
                </h4>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  {habitacion.servicios.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setMostrarCalendario(true)}
                  className="bg-white hover:bg-gray-400 text-black px-6 py-2 rounded-lg transition font-semibold"
                >
                  Consultar disponibilidad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal calendario */}
      {mostrarCalendario && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-[90%] md:w-[600px] text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Consultar Disponibilidad
            </h3>
            <Calendar
              onChange={(value) => setReserva({ ...reserva, fechas: value })}
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
                onClick={() => {
                  setMostrarCalendario(false);
                  setPaso(1);
                }}
                className="bg-white hover:bg-gray-400 text-black px-5 py-2 rounded-lg"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proceso de reserva con barra de pasos */}
      {paso > 0 && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-start z-50 p-6 pt-20">
          <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 w-full max-w-lg">
            {/* Barra de pasos */}
            <div className="flex justify-between mb-6">
              {pasosTexto.map((texto, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                      paso - 1 === index
                        ? "bg-white text-black font-bold"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm mt-2 text-gray-300">{texto}</p>
                </div>
              ))}
            </div>

            {/* Contenido paso */}
            {paso === 1 && (
              <div className="space-y-4">
                <p>
                  <strong>Fechas:</strong>{" "}
                  {reserva.fechas[0].toLocaleDateString()} -{" "}
                  {reserva.fechas[1].toLocaleDateString()}
                </p>
                <p>
                  <strong>Adultos:</strong> {reserva.adultos}
                </p>
                <p>
                  <strong>Niños:</strong> {reserva.ninos}
                </p>
                <div className="flex justify-end mt-4 gap-4">
                  <button
                    onClick={() => setPaso(0)}
                    className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => setPaso(2)}
                    className="bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="space-y-4">
                {["nombre", "apellido", "dni", "telefono", "email"].map((field) => (
                  <input
                    key={field}
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={usuario[field]}
                    onChange={(e) =>
                      setUsuario({ ...usuario, [e.target.name]: e.target.value })
                    }
                    className="w-full bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700 text-white"
                  />
                ))}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setPaso(1)}
                    className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => setPaso(3)}
                    className="bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm">Número de tarjeta</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={pago.tarjetaFormateada}
                    onChange={handleCardInput}
                    className="w-full bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700 text-white"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <small className="text-sm text-gray-400">
                      {pago.cardType ? `Tipo: ${pago.cardType}` : "Tipo: —"}
                    </small>
                    <small className={`text-sm ${pago.cardValid ? "text-green-400" : "text-yellow-300"}`}>
                      {pago.cardValid ? "Número válido" : "Ingresá número completo"}
                    </small>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm">Vencimiento</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/AA"
                      value={pago.vencimiento}
                      onChange={handleExpiryInput}
                      className="w-full bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700 text-white"
                    />
                    {!pago.expiryValid && pago.vencimiento.length === 5 && (
                      <small className="text-red-500">Fecha inválida o vencida</small>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm">
                      CVV <span className="text-gray-400 text-xs">({requiredCvvLength(pago.cardType)} dígitos)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={pago.cardType === "Amex" ? "4 dígitos" : "3 dígitos"}
                      value={pago.cvv}
                      onChange={handleCvvInput}
                      className="w-full bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700 text-white"
                    />
                    {!pago.cvvValid && pago.cvv.length > 0 && (
                      <small className="text-red-500">CVV incompleto</small>
                    )}
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
                    className={`px-5 py-2 rounded-lg ${isPaymentReady() ? "bg-white text-black hover:bg-gray-300" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

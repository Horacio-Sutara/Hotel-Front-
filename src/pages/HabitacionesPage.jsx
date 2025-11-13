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
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mensajeCapacidad, setMensajeCapacidad] = useState("");
  const [excedeCapacidad, setExcedeCapacidad] = useState(false);
  const [reserva, setReserva] = useState({
    fechas: [new Date(), new Date()],
    adultos: 1,
    ninos: 0,
  });
  const [paso, setPaso] = useState(0);
  const [usuario, setUsuario] = useState(null);
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
  const [metodoPago, setMetodoPago] = useState("TARJETA");
  const [enviandoReserva, setEnviandoReserva] = useState(false);
  const [diasOcupados, setDiasOcupados] = useState([]);



  // ---------- Obtener usuario logueado ----------
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        console.error("Error al leer usuario del localStorage");
      }
    }
  }, []);

  
  const pasosTexto = ["Revisar Reserva", "Método de Pago"];

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
        const nuevasHabitaciones = {};
        data.forEach((h) => {
          if (h.estado !== "DISPONIBLE") return;
          let imagen = habitacionEstandar;
          const tipoHab = (h.tipo || h.nombre || "").toLowerCase();
          if (tipoHab.includes("deluxe")) imagen = habitacionDeluxe;
          else if (tipoHab.includes("suite")) imagen = habitacionSuite;
          else if (tipoHab.includes("estándar") || tipoHab.includes("estandar")) imagen = habitacionEstandar;
          nuevasHabitaciones[`api_${h.id}`] = {
            nombre:h.nombre,
            img: h.imagen_url || imagen,
            descripcion: h.descripcion,
            precio: "$"+h.precio+" por noche",
            capacidad: h.capacidad,
          };
        });
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
      : "";
  };

  const fetchDiasOcupados = async (idHabitacion) => {
  try {
    const res = await fetch(`http://localhost:5000/api/reservas/fechas/${idHabitacion}`);
    const data = await res.json();

    // 🔹 Si tu backend devuelve una lista con fechas de entrada y salida
    // ejemplo: [{fecha_entrada: "2025-11-10T14:00:00", fecha_salida: "2025-11-15T11:00:00"}]
    const dias = [];

    data.forEach((r) => {
      const start = new Date(r.fecha_entrada);
      const end = new Date(r.fecha_salida);
      let current = new Date(start);

      // Generamos todas las fechas entre entrada y salida
      while (current <= end) {
        dias.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    setDiasOcupados(dias);
  } catch (error) {
    console.error("Error al obtener fechas ocupadas:", error);
  }
};

  // ---------- Métodos auxiliares ----------
const handleConsultarDisponibilidad = async () => {
  if (!usuario) {
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
    return;
  }

  // 🔹 Obtener ID de la habitación seleccionada
  const idHabitacion =
    tipo.startsWith("api_") ? parseInt(tipo.replace("api_", "")) : 1;

  // 🔹 Traer los días ocupados desde la API
  await fetchDiasOcupados(idHabitacion);

  // 🔹 Mostrar calendario
  setMostrarCalendario(true);
};

  // Validación de capacidad al cambiar adultos/niños
  const handleCambioPersonas = (tipoCampo, valor) => {
    const nuevoValor = Math.max(0, parseInt(valor) || 0);
    const nuevaReserva = { ...reserva, [tipoCampo]: nuevoValor };
    setReserva(nuevaReserva);
    const totalPersonas = parseInt(nuevaReserva.adultos) + parseInt(nuevaReserva.ninos);
    if (habitacion && totalPersonas > habitacion.capacidad) {
      setMensajeCapacidad(`Se excede la capacidad máxima (${habitacion.capacidad} personas).`);
      setExcedeCapacidad(true);
    } else {
      setMensajeCapacidad("");
      setExcedeCapacidad(false);
    }
  };

const handleConfirmarPago = async () => {
  // 🔹 Solo validar tarjeta si el método de pago es TARJETA
  if (metodoPago === "TARJETA" && !isPaymentReady()) {
    return alert("Completa correctamente los datos de la tarjeta.");
  }

  if (enviandoReserva) return; // Evita doble clic

  try {
    setEnviandoReserva(true);


    // Construir datos de reserva
    const data = {
      id_habitacion: parseInt(tipo.replace("api_", "")) || 1, // Si viene de la API usa su id
      id_cliente: usuario?.id || 2, // Asegúrate que tu backend devuelve el id del usuario al loguear
      fecha_entrada: new Date(reserva.fechas[0]).toISOString().split(".")[0],
      fecha_salida: new Date(reserva.fechas[1]).toISOString().split(".")[0],
      numero_huespedes: parseInt(reserva.adultos) + parseInt(reserva.ninos),
      
      metodo_pago: metodoPago,
      estado_factura: metodoPago === "EFECTIVO" || metodoPago === "TRANSFERENCIA"
      ? "PENDIENTE"
      : "PAGADA",

    };

    // Validación extra de capacidad
    if (habitacion && data.numero_huespedes > habitacion.capacidad) {
      alert(`Se excede la capacidad máxima (${habitacion.capacidad} personas).`);
      setEnviandoReserva(false);
      return;
    }

    const res = await fetch("http://localhost:5000/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al crear la reserva");
    const respuesta = await res.json();

    alert("Reserva y pago confirmados correctamente!");
    console.log("Reserva creada:", respuesta);

    // Reiniciar estados
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
  } catch (err) {
    console.error("Error al confirmar pago:", err);
    alert("Hubo un problema al confirmar la reserva. Intenta nuevamente.");
  } finally {
    setEnviandoReserva(false);
  }
};


  // ---------- Validaciones tarjeta ----------
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
    let formatted =
      raw.length >= 3 ? raw.slice(0, 2) + "/" + raw.slice(2) : raw.length === 2 ? raw + "/" : raw;
    let expiryValid = false;
    if (formatted.length === 5) {
      const mm = parseInt(formatted.slice(0, 2), 10);
      const yy = parseInt(formatted.slice(3), 10);
      expiryValid = mm >= 1 && mm <= 12;
      if (expiryValid) {
        const now = new Date();
        const fullYear = 2000 + yy;
        expiryValid =
          new Date(fullYear, mm, 0, 23, 59, 59) >= new Date(now.getFullYear(), now.getMonth(), 1);
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

// ---------- Render ----------
return (
  <section className="min-h-screen bg-zinc-950 text-white py-0 px-0">
    {mostrarToast && (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-center animate-fadeIn">
          Inicie sesión para reservar
        </div>
      </div>
    )}

    {/* ⚠️ Mensaje de capacidad excedida */}
    {mensajeCapacidad && (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]">
        <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg text-center animate-fadeIn font-semibold">
          {mensajeCapacidad}
        </div>
      </div>
    )}

    {/* Imagen portada */}
    <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
      <img
        src={portadaHabitaciones}
        alt="Portada habitaciones"
        className="w-full h-full object-cover object-center"
      />
    </div>

    {/* Paso 0 */}
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
            {Object.entries(habitaciones).map(([key, h]) => (
              <option key={key} value={key}>
                {h.nombre}
              </option>
            ))}
          </select>
        </div>

        {habitacion && (
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
                <strong className="text-white">Capacidad:</strong>{" "}
                {habitacion.capacidad} personas
              </p>
              <p className="text-gray-300">{habitacion.descripcion}</p>
              <div className="mt-6">
                <button
                  onClick={handleConsultarDisponibilidad}
                  className="bg-white hover:bg-gray-400 text-black px-6 py-2 rounded-lg transition font-semibold"
                >
                  Consultar disponibilidad
                </button>
              </div>
            </div>
          </div>
        )}
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
            onChange={(dates) => setReserva((r) => ({ ...r, fechas: dates }))}
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
                  handleCambioPersonas("adultos", e.target.value)
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
                  handleCambioPersonas("ninos", e.target.value)
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
                if (!excedeCapacidad) {
                  setMostrarCalendario(false);
                  setPaso(1);
                }
              }}
              className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                excedeCapacidad
                  ? "bg-gray-500 cursor-not-allowed text-gray-300"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              disabled={excedeCapacidad}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Paso 1: revisión reserva */}
    {paso === 1 && (
      <div className="container mx-auto max-w-xl px-6 py-20 space-y-6">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {pasosTexto[0]}
        </h2>
        <div className="bg-zinc-900 p-6 rounded-2xl space-y-4 text-gray-200">
          <p>
            <strong>Habitación:</strong> {habitacion.nombre}
          </p>
          <p>
            <strong>Fechas:</strong>{" "}
            {Array.isArray(reserva.fechas)
              ? reserva.fechas.map((d) => d.toLocaleDateString()).join(" - ")
              : reserva.fechas.toLocaleDateString()}
          </p>
          <p>
            <strong>Adultos:</strong> {reserva.adultos}
          </p>
          <p>
            <strong>Niños:</strong> {reserva.ninos}
          </p>

          {usuario && (
            <div className="mt-4 border-t border-zinc-700 pt-4">
              <h3 className="text-xl font-semibold mb-2 text-white">
                Datos del Usuario
              </h3>
              <p>
                <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
              </p>
              <p>
                <strong>DNI:</strong> {usuario.numero_documento}
              </p>
              {usuario.telefono && (
                <p>
                  <strong>Teléfono:</strong> {usuario.telefono}
                </p>
              )}
              <p>
                <strong>País:</strong> {usuario.pais_emision}
              </p>
              <p>
                <strong>Email:</strong> {usuario.email}
              </p>
            </div>
          )}

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
      </div>
    )}

{/* Paso 2: pago */}
{paso === 2 && (
  <section className="container mx-auto max-w-xl px-6 py-20 space-y-6">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">
      {pasosTexto[1]}
    </h2>

    {/* Selección del método de pago */}
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-3">
        Método de Pago
      </h3>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="metodoPago"
            value="TARJETA"
            checked={metodoPago === "TARJETA"}
            onChange={(e) => setMetodoPago(e.target.value)}
          />
          Tarjeta de Crédito/Débito
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="metodoPago"
            value="EFECTIVO"
            checked={metodoPago === "EFECTIVO"}
            onChange={(e) => setMetodoPago(e.target.value)}
          />
          Pago en Efectivo (al llegar)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="metodoPago"
            value="TRANSFERENCIA"
            checked={metodoPago === "TRANSFERENCIA"}
            onChange={(e) => setMetodoPago(e.target.value)}
          />
          Transferencia Bancaria
        </label>
      </div>
    </div>

    {/* Tarjeta */}
    {metodoPago === "TARJETA" && (
      <div className="bg-zinc-900 p-6 rounded-2xl space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Número de Tarjeta</label>
          <input
            type="text"
            value={pago.tarjetaFormateada}
            onChange={handleCardInput}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
            placeholder="XXXX XXXX XXXX XXXX"
          />
          {pago.cardType && (
            <p className="text-sm text-gray-400 mt-1">Tipo: {pago.cardType}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Vencimiento (MM/AA)</label>
            <input
              type="text"
              value={pago.vencimiento}
              onChange={handleExpiryInput}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
              placeholder="MM/AA"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">CVV</label>
            <input
              type="text"
              value={pago.cvv}
              onChange={handleCvvInput}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
              placeholder="CVV"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPaso(1)}
            className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700"
          >
            Volver
          </button>
          <button
            onClick={handleConfirmarPago}
            disabled={!isPaymentReady() || enviandoReserva}
            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
              !isPaymentReady() || enviandoReserva
                ? "bg-gray-500 cursor-not-allowed text-gray-300"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {enviandoReserva ? "Procesando..." : "Confirmar Pago"}
          </button>
        </div>
      </div>
    )}

    {/* Efectivo */}
    {metodoPago === "EFECTIVO" && (
      <div className="bg-zinc-900 p-6 rounded-2xl space-y-4 text-gray-200">
        <p>
          <strong>Pago en Efectivo:</strong> Deberás abonar el monto total al llegar al hotel.
        </p>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPaso(1)}
            className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700"
          >
            Volver
          </button>
          <button
            onClick={handleConfirmarPago}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Confirmar Pago
          </button>
        </div>
      </div>
    )}

    {/* Transferencia */}
    {metodoPago === "TRANSFERENCIA" && (
      <div className="bg-zinc-900 p-6 rounded-2xl space-y-4 text-gray-200">
        <p>
          <strong>Transferencia Bancaria:</strong> Realizá la transferencia al siguiente CBU y
          envía el comprobante al correo del hotel.
        </p>
        <ul className="text-sm text-gray-300">
          <li><strong>Banco:</strong> Banco Nación</li>
          <li><strong>CBU:</strong> 1234567890123456789012</li>
          <li><strong>Alias:</strong> HOTEL.PARADISE</li>
          <li><strong>Email:</strong> pagos@hotelparadise.com</li>
        </ul>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPaso(1)}
            className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700"
          >
            Volver
          </button>
          <button
            onClick={handleConfirmarPago}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Confirmar Pago
          </button>
        </div>
      </div>
    )}
  </section>
)}
  </section>
);
}
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Graficos() {
  const [ingresosPorMes, setIngresosPorMes] = useState([]);
  const [ocupacionPorTipo, setOcupacionPorTipo] = useState([]);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        // ---- Obtener ingresos por mes ----
        const resIngresos = await fetch("http://localhost:5000/api/estadisticas/ingresos_mes");
        const dataIngresos = await resIngresos.json();

        // El backend devuelve un objeto { mes: monto, ... }
        // Lo convertimos a un array compatible con Recharts
        const mesesNombres = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const ingresosArray = Object.entries(dataIngresos[0] || dataIngresos)
          .map(([mes, monto]) => ({
            mes: mesesNombres[parseInt(mes) - 1] || mes,
            ingresos: monto,
          }));

        setIngresosPorMes(ingresosArray);

        // ---- Obtener ocupación por tipo ----
        const resOcupacion = await fetch("http://localhost:5000/api/estadisticas/habitaciones_ocupadas_por_tipo");
        const dataOcupacion = await resOcupacion.json();

        // dataOcupacion debería venir ya como array de objetos [{tipo, ocupadas}, ...]
        setOcupacionPorTipo(dataOcupacion);

      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };

    fetchEstadisticas();
  }, []);

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">Estadísticas del Hotel</h2>

      {/* --- Gráfico de Ingresos --- */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Ingresos por Mes</h3>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ingresosPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="mes" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #444",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Gráfico de Ocupación --- */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Habitaciones Ocupadas por Tipo
        </h3>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ocupacionPorTipo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="tipo" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #444",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="ocupadas" fill="#22c55e" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

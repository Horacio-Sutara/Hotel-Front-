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
  const ingresosPorMes = [
    { mes: "Enero", ingresos: 120000 },
    { mes: "Febrero", ingresos: 95000 },
    { mes: "Marzo", ingresos: 140000 },
    { mes: "Abril", ingresos: 110000 },
    { mes: "Mayo", ingresos: 160000 },
    { mes: "Junio", ingresos: 125000 },
  ];

  const ocupacionPorTipo = [
    { tipo: "Estandar", ocupadas: 12 },
    { tipo: "Deluxe", ocupadas: 8 },
    { tipo: "Suite", ocupadas: 4 },
  ];

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white"> Estadísticas del Hotel</h2>

      {/* Gráfico de ingresos */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Ingresos por Mes
        </h3>
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

      {/* Gráfico de ocupación */}
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

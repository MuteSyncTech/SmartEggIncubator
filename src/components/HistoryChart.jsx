import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export function HistoryChart({ data }) {
  console.log("History Data:", data);

  return (
    <div
      className="
        rounded-3xl
        border border-cyan-500/10
        bg-gradient-to-br from-[#081221] to-[#030b18]
        p-4
        shadow-xl shadow-cyan-500/5
        w-full
        h-full
      "
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">
          Environmental Analytics
        </h2>

        <p className="text-slate-400 text-xs mt-1">
          Trend visualization
        </p>
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
            </linearGradient>

            <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.30} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#1e293b"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <YAxis
            domain={[35, 80]}
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />

          <Tooltip
  content={({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid rgba(56,189,248,0.25)",
          borderRadius: "12px",
          padding: "10px 14px",
          color: "#e2e8f0",
          boxShadow: "0 8px 24px rgba(0,0,0,.35)"
        }}
      >
        {payload.map((item, index) => (
          <div key={index} style={{ margin: "4px 0" }}>
            <span
              style={{
                color:
                  item.dataKey === "temperature"
                    ? "#38bdf8"
                    : "#2563eb",
                fontWeight: 600
              }}
            >
              {item.dataKey === "temperature"
                ? "Temperature (°C)"
                : "Humidity (%)"}
            </span>
            {" : "}
            {item.value}
          </div>
        ))}
      </div>
    );
  }}
/>

          <Legend />

          <Area
  type="monotone"
  dataKey="humidity"
  name="Humidity (%)"
  stroke="#38bdf8"
  fill="url(#g1)"
  strokeWidth={2.5}
/>

<Area
  type="monotone"
  dataKey="temperature"
  name="Temperature (°C)"
  stroke="#2563eb"
  fill="url(#g2)"
  strokeWidth={2}
/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
import React from 'react';

export function DataLogTable({ logs }) {
  const badge = (active) =>
    active
      ? 'bg-cyan-500/15 text-cyan-300'
      : 'bg-slate-700 text-slate-300';

  return (
    <div
      className="
        rounded-3xl border border-cyan-500/10
        bg-gradient-to-br from-[#0b1730] to-[#081221]
        p-6 shadow-2xl shadow-cyan-500/5
      "
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Latest Sensor Logs
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left py-4">Time</th>
              <th className="text-left py-4">Temp</th>
              <th className="text-left py-4">Humidity</th>
              <th className="text-left py-4">Heater</th>
              <th className="text-left py-4">Fan</th>
              <th className="text-left py-4">Pump</th>
              <th className="text-left py-4">Servo</th>
            </tr>
          </thead>

          <tbody>
            {logs?.map((log, idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-4 text-slate-300">
                  {new Date(log.created_at).toLocaleTimeString()}
                </td>

                <td className="py-4 text-white font-medium">
                  {log.suhu}°C
                </td>

                <td className="py-4 text-white font-medium">
                  {log.kelembapan}%
                </td>

                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge(log.heater)}`}>
                    {log.heater ? 'ON' : 'OFF'}
                  </span>
                </td>

                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge(log.fan)}`}>
                    {log.fan ? 'ON' : 'OFF'}
                  </span>
                </td>

                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge(log.pompa)}`}>
                    {log.pompa ? 'ON' : 'OFF'}
                  </span>
                </td>

                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge(log.servo)}`}>
                    {log.servo ? 'ACTIVE' : 'IDLE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
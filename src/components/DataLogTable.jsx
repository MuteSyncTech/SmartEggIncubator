import React, { useState, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Database } from 'lucide-react';

export function DataLogTable({ logs }) {
  // logs is expected to be an array of entries, each having a `day` field (integer 6–21)
  // or a `created_at` timestamp from which the day can be derived externally.
  // The parent should pass ALL logs; this component filters by selected day.

  const DAY_MIN = 6;
  const DAY_MAX = 21;
  const LOGS_PER_DAY = 20;

  const [selectedDay, setSelectedDay] = useState(null); // null = show day picker
  const days = Array.from({ length: DAY_MAX - DAY_MIN + 1 }, (_, i) => DAY_MIN + i);

  // Filter logs for the selected day and take the last 20
  const filteredLogs = selectedDay !== null
    ? (logs || [])
        .filter((log) => Number(log.hari) === selectedDay)
        .slice(-LOGS_PER_DAY)
    : [];

  const badge = (active) =>
    active
      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
      : 'bg-slate-700/60 text-slate-400 border border-slate-600/30';

  // Navigate between days
  const prevDay = () => setSelectedDay((d) => (d > DAY_MIN ? d - 1 : d));
  const nextDay = () => setSelectedDay((d) => (d < DAY_MAX ? d + 1 : d));

  // ── DAY PICKER SCREEN ──────────────────────────────────────────────
  if (selectedDay === null) {
    return (
      <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-[#0b1730] to-[#081221] p-6 shadow-2xl shadow-cyan-500/5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <CalendarDays size={22} />
          </div>
          <h2 className="text-2xl font-bold text-white">Datalog Sensor</h2>
        </div>
        <p className="text-slate-400 text-sm mb-8 ml-1">
          Pilih hari inkubasi untuk menampilkan 20 data log terakhir
        </p>

        {/* Day grid */}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {days.map((day) => {
            const count = (logs || []).filter((l) => Number(l.hari) === day).length;
            const hasData = count > 0;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`
                  relative flex flex-col items-center justify-center
                  aspect-square rounded-2xl border
                  transition-all duration-200 group
                  ${hasData
                    ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10'
                    : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-700/40 hover:border-slate-600/50'
                  }
                `}
              >
                <span className="text-xs text-slate-500 font-medium">Hari</span>
                <span className={`text-2xl font-bold mt-0.5 ${hasData ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {day}
                </span>
                {hasData && (
                  <span className="text-[10px] text-cyan-500 mt-0.5 font-semibold">
                    {Math.min(count, LOGS_PER_DAY)} log
                  </span>
                )}
                {!hasData && (
                  <span className="text-[10px] text-slate-600 mt-0.5">kosong</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-5 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500/60"></div>
            <span className="text-slate-400 text-xs">Ada data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600/60"></div>
            <span className="text-slate-400 text-xs">Belum ada data</span>
          </div>
          <span className="text-slate-600 text-xs ml-auto">Hari ke-{DAY_MIN} – {DAY_MAX}</span>
        </div>
      </div>
    );
  }

  // ── LOG TABLE SCREEN ───────────────────────────────────────────────
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-[#0b1730] to-[#081221] p-6 shadow-2xl shadow-cyan-500/5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Database size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">
              Log Hari ke-{selectedDay}
            </h2>
            <p className="text-slate-400 text-sm">
              Menampilkan {filteredLogs.length} data terakhir
            </p>
          </div>
        </div>

        {/* Day navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevDay}
            disabled={selectedDay <= DAY_MIN}
            className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400
                       hover:bg-slate-700/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Day chips (show ±2 around current) */}
          <div className="flex items-center gap-1">
            {days
              .filter((d) => Math.abs(d - selectedDay) <= 2)
              .map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`
                    px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all
                    ${d === selectedDay
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                      : 'bg-slate-800/50 border-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                    }
                  `}
                >
                  {d}
                </button>
              ))}
          </div>

          <button
            onClick={nextDay}
            disabled={selectedDay >= DAY_MAX}
            className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400
                       hover:bg-slate-700/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all"
          >
            <ChevronRight size={18} />
          </button>

          {/* Back to picker */}
          <button
            onClick={() => setSelectedDay(null)}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border
                       bg-slate-800/50 border-slate-700/30 text-slate-400
                       hover:bg-slate-700/50 hover:text-white transition-all"
          >
            <CalendarDays size={14} />
            Ganti Hari
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/30 mb-4">
            <Database size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">Tidak ada data untuk hari ke-{selectedDay}</p>
          <p className="text-slate-600 text-sm mt-1">Data belum tersedia dari database</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="text-left py-3 pr-4 font-medium">#</th>
                <th className="text-left py-3 pr-4 font-medium">Waktu</th>
                <th className="text-left py-3 pr-4 font-medium">Suhu</th>
                <th className="text-left py-3 pr-4 font-medium">Kelembapan</th>
                <th className="text-left py-3 pr-4 font-medium">Heater</th>
                <th className="text-left py-3 pr-4 font-medium">Fan</th>
                <th className="text-left py-3 pr-4 font-medium">Pompa</th>
                <th className="text-left py-3 font-medium">Servo</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition"
                >
                  <td className="py-3 pr-4 text-slate-600 text-xs font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </td>

                  <td className="py-3 pr-4 text-slate-300 font-mono text-xs">
                    {new Date(log.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>

                  <td className="py-3 pr-4 text-white font-semibold">
                    {log.suhu}°C
                  </td>

                  <td className="py-3 pr-4 text-white font-semibold">
                    {log.kelembapan}%
                  </td>

                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge(log.heater)}`}>
                      {log.heater ? 'ON' : 'OFF'}
                    </span>
                  </td>

                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge(log.fan)}`}>
                      {log.fan ? 'ON' : 'OFF'}
                    </span>
                  </td>

                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge(log.pompa)}`}>
                      {log.pompa ? 'ON' : 'OFF'}
                    </span>
                  </td>

                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge(log.servo)}`}>
                      {log.servo ? 'ON' : 'OFF'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer info */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-slate-600 text-xs">
          Hari ke-{selectedDay} dari rentang hari ke-{DAY_MIN}–{DAY_MAX}
        </span>
        <span className="text-slate-600 text-xs">
          {filteredLogs.length}/{LOGS_PER_DAY} data ditampilkan
        </span>
      </div>
    </div>
  );
}

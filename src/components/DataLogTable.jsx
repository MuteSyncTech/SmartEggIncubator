import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Database, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const START_DATE = new Date('2026-05-31T17:00:00Z'); // Hari ke-1 = 1 Juni 2026 00:00 WIB
const DAY_MIN = 6;
const DAY_MAX = 21;
const LOGS_PER_DAY = 20;

function getDateRangeForDay(dayNumber) {
  const start = new Date(START_DATE);
  start.setUTCDate(start.getUTCDate() + (dayNumber - 1));

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  end.setUTCMilliseconds(end.getUTCMilliseconds() - 1);

  return { start, end };
}

export function DataLogTable() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: DAY_MAX - DAY_MIN + 1 }, (_, i) => DAY_MIN + i);

  const handleSelectDay = async (day) => {
    setSelectedDay(day);
    setLoading(true);
    setLogs([]);

    const { start, end } = getDateRangeForDay(day);

    const { data } = await supabase
      .from('sensor_data')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .not('suhu', 'is', null)`n  .not('kelembapan', 'is', null)`n  .gte('suhu', 36)`n  .order('created_at', { ascending: false })
      .limit(LOGS_PER_DAY);

    setLogs(data || []);
    setLoading(false);
  };

  const prevDay = () => { if (selectedDay > DAY_MIN) handleSelectDay(selectedDay - 1); };
  const nextDay = () => { if (selectedDay < DAY_MAX) handleSelectDay(selectedDay + 1); };

  const badge = (active) =>
    active
      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
      : 'bg-slate-700/60 text-slate-400 border border-slate-600/30';

  // ── DAY PICKER ─────────────────────────────────────────────────────
  if (selectedDay === null) {
    return (
      <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-[#0b1730] to-[#081221] p-8 shadow-2xl shadow-cyan-500/5">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <CalendarDays size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Datalog Sensor</h2>
            <p className="text-slate-500 text-sm mt-0.5">Pilih hari inkubasi yang ingin ditampilkan</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 my-6" />

        {/* Grid */}
        <div className="grid grid-cols-8 gap-3">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleSelectDay(day)}
              className="
                group flex flex-col items-center justify-center
                aspect-square rounded-2xl border
                bg-slate-800/40 border-slate-700/30
                hover:bg-cyan-500/10 hover:border-cyan-500/40
                hover:shadow-lg hover:shadow-cyan-500/10
                transition-all duration-200
              "
            >
              <span className="text-[11px] text-slate-500 font-medium group-hover:text-cyan-500 transition-colors">
                Hari
              </span>
              <span className="text-3xl font-bold text-slate-300 group-hover:text-cyan-300 mt-0.5 transition-colors">
                {day}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
          <p className="text-slate-600 text-xs">Total {DAY_MAX - DAY_MIN + 1} hari inkubasi</p>
          <p className="text-slate-600 text-xs">Hari ke-{DAY_MIN} – Hari ke-{DAY_MAX}</p>
        </div>
      </div>
    );
  }

  // ── LOG TABLE ──────────────────────────────────────────────────────
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-[#0b1730] to-[#081221] p-8 shadow-2xl shadow-cyan-500/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Hari ke-{selectedDay}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {loading ? 'Mengambil data dari database...' : `${logs.length} data terakhir ditampilkan`}
            </p>
          </div>
        </div>

        {/* Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevDay}
            disabled={selectedDay <= DAY_MIN || loading}
            className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-slate-400
                       hover:bg-slate-700/60 hover:text-white hover:border-slate-600/50
                       disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Day chips */}
          <div className="flex items-center gap-1.5">
            {days.filter((d) => Math.abs(d - selectedDay) <= 2).map((d) => (
              <button
                key={d}
                onClick={() => handleSelectDay(d)}
                disabled={loading}
                className={`
                  w-9 h-9 rounded-xl text-sm font-bold border transition-all
                  ${d === selectedDay
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
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
            disabled={selectedDay >= DAY_MAX || loading}
            className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-slate-400
                       hover:bg-slate-700/60 hover:text-white hover:border-slate-600/50
                       disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={() => setSelectedDay(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border
                       bg-slate-800/50 border-slate-700/30 text-slate-400
                       hover:bg-slate-700/50 hover:text-white hover:border-slate-600/50 transition-all"
          >
            <CalendarDays size={14} />
            Pilih Hari
          </button>
        </div>
      </div>

      <div className="border-t border-white/5 mb-5" />

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <Loader2 size={28} className="text-cyan-400 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm">Memuat data hari ke-{selectedDay}...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/30">
            <Database size={28} className="text-slate-600" />
          </div>
          <div>
            <p className="text-slate-400 font-medium">Tidak ada data untuk hari ke-{selectedDay}</p>
            <p className="text-slate-600 text-sm mt-1">Data belum tersedia dari database</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left pb-4 pr-4 font-semibold">#</th>
                <th className="text-left pb-4 pr-4 font-semibold">Waktu</th>
                <th className="text-left pb-4 pr-4 font-semibold">Suhu</th>
                <th className="text-left pb-4 pr-4 font-semibold">Kelembapan</th>
                <th className="text-left pb-4 pr-4 font-semibold">Heater</th>
                <th className="text-left pb-4 pr-4 font-semibold">Fan</th>
                <th className="text-left pb-4 pr-4 font-semibold">Pompa</th>
                <th className="text-left pb-4 font-semibold">Servo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 pr-4 text-slate-600 text-xs font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-300 font-mono text-xs tabular-nums">
                    {new Date(log.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit', minute: '2-digit', second: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="text-white font-semibold">{log.suhu}</span>
                    <span className="text-slate-500 text-xs ml-0.5">°C</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="text-white font-semibold">{log.kelembapan}</span>
                    <span className="text-slate-500 text-xs ml-0.5">%</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badge(log.heater)}`}>
                      {log.heater ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badge(log.fan)}`}>
                      {log.fan ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badge(log.pompa)}`}>
                      {log.pompa ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badge(log.servo)}`}>
                      {log.servo ? 'ON' : 'OFF'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {!loading && logs.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-slate-600 text-xs">Hari ke-{selectedDay} dari {DAY_MAX - DAY_MIN + 1} hari inkubasi</span>
          <span className="text-slate-600 text-xs">{logs.length}/{LOGS_PER_DAY} data ditampilkan</span>
        </div>
      )}
    </div>
  );
}


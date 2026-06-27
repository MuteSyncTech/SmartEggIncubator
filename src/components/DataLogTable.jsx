import React, { useState, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Database, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DAY_MIN = 1;
const DAY_MAX = 21;
const LOGS_PER_DAY = 20;

// Hari ke-N = tanggal N Juni 2026 (WIB = UTC+7)
// Jadi hari ke-6 = 6 Juni 2026 00:00 WIB = 5 Juni 2026 17:00 UTC
function getDateRangeForDay(dayNumber) {
  // Start = tanggal dayNumber Juni 2026 00:00 WIB = 17:00 UTC hari sebelumnya
  const startUTC = new Date(Date.UTC(2026, 5, dayNumber - 1, 17, 0, 0, 0)); // bulan 5 = Juni (0-indexed)
  const endUTC = new Date(Date.UTC(2026, 5, dayNumber, 16, 59, 59, 999));
  return { start: startUTC, end: endUTC };
}

export function DataLogTable() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dayHasData, setDayHasData] = useState({});
  const [loadingDays, setLoadingDays] = useState(true);

  const days = Array.from({ length: DAY_MAX - DAY_MIN + 1 }, (_, i) => DAY_MIN + i);

  useEffect(() => {
    const checkDays = async () => {
      setLoadingDays(true);
      const counts = {};

      // Cek tiap hari 6-21 satu per satu pakai count
      const checks = days.filter(d => d >= 6).map(async (day) => {
        const { start, end } = getDateRangeForDay(day);
        const { count } = await supabase
          .from('sensor_data')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString())
          .not('suhu', 'is', null)
          .gte('suhu', 36);
        if (count > 0) counts[day] = count;
      });

      await Promise.all(checks);
      setDayHasData(counts);
      setLoadingDays(false);
    };
    checkDays();
  }, []);

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
      .not('suhu', 'is', null)
      .not('kelembapan', 'is', null)
      .gte('suhu', 36)
      .order('created_at', { ascending: false })
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
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <CalendarDays size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Datalog Sensor</h2>
            <p className="text-slate-500 text-sm mt-0.5">Pilih hari inkubasi yang ingin ditampilkan</p>
          </div>
        </div>

        <div className="border-t border-white/5 my-6" />

        {loadingDays ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={22} className="text-cyan-400 animate-spin" />
            <span className="text-slate-400 text-sm">Memeriksa data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-3">
            {days.map((day) => {
              const hasData = Boolean(dayHasData[day]);
              return (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`
                    group flex flex-col items-center justify-center
                    h-24 rounded-2xl border transition-all duration-200
                    ${hasData
                      ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10'
                      : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-700/40'
                    }
                  `}
                >
                  <span className={`text-[11px] font-medium transition-colors ${hasData ? 'text-cyan-600 group-hover:text-cyan-500' : 'text-slate-600'}`}>
                    Hari
                  </span>
                  <span className={`text-2xl font-bold mt-0.5 transition-colors ${hasData ? 'text-cyan-300' : 'text-slate-500'}`}>
                    {day}
                  </span>
                  <span className={`text-[10px] mt-1 font-medium ${hasData ? 'text-cyan-500' : 'text-slate-600'}`}>
                    {hasData ? 'ada data' : 'kosong'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/70"></div>
              <span className="text-slate-400 text-xs">Ada data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600/70"></div>
              <span className="text-slate-400 text-xs">Belum ada data</span>
            </div>
          </div>
          <p className="text-slate-600 text-xs">Hari ke-{DAY_MIN} – Hari ke-{DAY_MAX}</p>
        </div>
      </div>
    );
  }

  // ── LOG TABLE ──────────────────────────────────────────────────────
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-[#0b1730] to-[#081221] p-8 shadow-2xl shadow-cyan-500/5">
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

        <div className="flex items-center gap-2">
          <button onClick={prevDay} disabled={selectedDay <= DAY_MIN || loading}
            className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-slate-400
                       hover:bg-slate-700/60 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all">
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5">
            {days.filter((d) => Math.abs(d - selectedDay) <= 2).map((d) => (
              <button key={d} onClick={() => handleSelectDay(d)} disabled={loading}
                className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all
                  ${d === selectedDay
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-800/50 border-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}>
                {d}
              </button>
            ))}
          </div>

          <button onClick={nextDay} disabled={selectedDay >= DAY_MAX || loading}
            className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-slate-400
                       hover:bg-slate-700/60 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all">
            <ChevronRight size={16} />
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button onClick={() => setSelectedDay(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border
                       bg-slate-800/50 border-slate-700/30 text-slate-400
                       hover:bg-slate-700/50 hover:text-white transition-all">
            <CalendarDays size={14} />
            Pilih Hari
          </button>
        </div>
      </div>

      <div className="border-t border-white/5 mb-5" />

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
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
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

      {!loading && logs.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-slate-600 text-xs">Hari ke-{selectedDay} dari {DAY_MAX} hari inkubasi</span>
          <span className="text-slate-600 text-xs">{logs.length}/{LOGS_PER_DAY} data ditampilkan</span>
        </div>
      )}
    </div>
  );
}

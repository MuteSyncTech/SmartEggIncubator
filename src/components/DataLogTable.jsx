import React, { useState, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Database, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Hari ke-6 = 6 Juni 2026
const START_DATE = new Date('2026-06-01T00:00:00+07:00');
const DAY_MIN = 6;
const DAY_MAX = 21;
const LOGS_PER_DAY = 20;

function getDayNumber(date) {
  const d = new Date(date);
  const start = new Date(START_DATE);
  const diffMs = d - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1; // hari ke-1 = index 0
}

function getDateRangeForDay(dayNumber) {
  const start = new Date(START_DATE);
  start.setDate(start.getDate() + (dayNumber - 1));
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function formatTanggal(dayNumber) {
  const { start } = getDateRangeForDay(dayNumber);
  return start.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

export function DataLogTable() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dayHasData, setDayHasData] = useState({});

  const days = Array.from({ length: DAY_MAX - DAY_MIN + 1 }, (_, i) => DAY_MIN + i);

  // Cek hari mana yang ada datanya berdasarkan tanggal created_at
  useEffect(() => {
    const checkDays = async () => {
      const startDate = new Date(START_DATE);
      const endDate = getDateRangeForDay(DAY_MAX).end;

      const { data } = await supabase
        .from('sensor_data')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (data) {
        const counts = {};
        data.forEach((row) => {
          const day = getDayNumber(row.created_at);
          if (day >= DAY_MIN && day <= DAY_MAX) {
            counts[day] = (counts[day] || 0) + 1;
          }
        });
        setDayHasData(counts);
      }
    };
    checkDays();
  }, []);

  // Fetch 20 data terakhir berdasarkan tanggal
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
      .order('created_at', { ascending: false })
      .limit(LOGS_PER_DAY);

    setLogs(data || []);
    setLoading(false);
  };

  const prevDay = () => {
    if (selectedDay > DAY_MIN) handleSelectDay(selectedDay - 1);
  };

  const nextDay = () => {
    if (selectedDay < DAY_MAX) handleSelectDay(selectedDay + 1);
  };

  const badge = (active) =>
    active
      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
      : 'bg-slate-700/60 text-slate-400 border border-slate-600/30';

  // ── DAY PICKER SCREEN ──────────────────────────────────────────────
  if (selectedDay === null) {
    return (
      <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-[#0b1730] to-[#081221] p-6 shadow-2xl shadow-cyan-500/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <CalendarDays size={22} />
          </div>
          <h2 className="text-2xl font-bold text-white">Datalog Sensor</h2>
        </div>
        <p className="text-slate-400 text-sm mb-8 ml-1">
          Pilih hari inkubasi untuk menampilkan 20 data log terakhir
        </p>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
          {days.map((day) => {
            const count = dayHasData[day] || 0;
            const hasData = count > 0;
            return (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`
                  relative flex flex-col items-center justify-center
                  aspect-square rounded-2xl border
                  transition-all duration-200
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
                <span className={`text-[9px] mt-0.5 font-medium ${hasData ? 'text-cyan-600' : 'text-slate-600'}`}>
                  {formatTanggal(day).split(' ').slice(0, 2).join(' ')}
                </span>
                {hasData
                  ? <span className="text-[9px] text-cyan-500 font-semibold">ada data</span>
                  : <span className="text-[9px] text-slate-600">kosong</span>
                }
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-5 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500/60"></div>
            <span className="text-slate-400 text-xs">Ada data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600/60"></div>
            <span className="text-slate-400 text-xs">Belum ada data</span>
          </div>
          <span className="text-slate-600 text-xs ml-auto">
            Hari ke-{DAY_MIN} (6 Jun) – Hari ke-{DAY_MAX} (26 Jun)
          </span>
        </div>
      </div>
    );
  }

  // ── LOG TABLE SCREEN ───────────────────────────────────────────────
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-[#0b1730] to-[#081221] p-6 shadow-2xl shadow-cyan-500/5">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Database size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">
              Hari ke-{selectedDay}
            </h2>
            <p className="text-slate-400 text-sm">
              {formatTanggal(selectedDay)} &nbsp;·&nbsp;{' '}
              {loading ? 'Memuat data...' : `${logs.length} data terakhir`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevDay}
            disabled={selectedDay <= DAY_MIN || loading}
            className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400
                       hover:bg-slate-700/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {days
              .filter((d) => Math.abs(d - selectedDay) <= 2)
              .map((d) => (
                <button
                  key={d}
                  onClick={() => handleSelectDay(d)}
                  disabled={loading}
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
            disabled={selectedDay >= DAY_MAX || loading}
            className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400
                       hover:bg-slate-700/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={18} />
          </button>

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="text-cyan-400 animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Memuat data hari ke-{selectedDay}...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/30 mb-4">
            <Database size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">Tidak ada data untuk hari ke-{selectedDay}</p>
          <p className="text-slate-600 text-sm mt-1">{formatTanggal(selectedDay)}</p>
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
              {logs.map((log, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="py-3 pr-4 text-slate-600 text-xs font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-3 pr-4 text-slate-300 font-mono text-xs">
                    {new Date(log.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit', minute: '2-digit', second: '2-digit',
                    })}
                  </td>
                  <td className="py-3 pr-4 text-white font-semibold">{log.suhu}°C</td>
                  <td className="py-3 pr-4 text-white font-semibold">{log.kelembapan}%</td>
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

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-slate-600 text-xs">
          Hari ke-{selectedDay} · {formatTanggal(selectedDay)}
        </span>
        <span className="text-slate-600 text-xs">
          {logs.length}/{LOGS_PER_DAY} data ditampilkan
        </span>
      </div>
    </div>
  );
}

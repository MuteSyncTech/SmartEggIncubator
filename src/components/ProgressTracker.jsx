import React from 'react';
import { supabase } from '../lib/supabase';
import { Play } from 'lucide-react';

export function ProgressTracker({ data }) {
  const currentDay = data.logs?.length
    ? data.logs[0].hari
    : 1;

  const totalDays = 21;
  const progress = Math.min((currentDay / totalDays) * 100, 100);

  const phase =
    currentDay < 19
      ? 'Incubation Phase'
      : 'Hatching Phase';

  async function handleStartIncubator() {
    const confirmStart = window.confirm(
      'Start a new incubation cycle? Reset to Day 1?'
    );

    if (!confirmStart) return;

    const { error } = await supabase
      .from('Incubator_Start')
      .update({
        start_cycle: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) {
      alert('Failed to send command.');
      console.error(error);
    } else {
      alert('Incubator cycle started.');
    }
  }

  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        border border-cyan-500/10
        bg-gradient-to-r from-[#071226] to-[#081a35]
        p-6 shadow-2xl shadow-cyan-500/5
      "
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10">
        {/* TOP ROW */}
        <div className="flex items-center justify-between mb-6">
          {/* LEFT */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              Incubation Progress
            </h2>

            <p className="text-slate-400 mt-2">
              {phase}
            </p>
          </div>

          {/* CENTER START */}
          <button
  onClick={handleStartIncubator}
  className="relative w-[760px] h-[130px] mx-auto flex items-center justify-center group"
>
  {/* LEFT PCB */}
  <svg
    className="absolute left-0 top-1/2 -translate-y-1/2"
    width="260"
    height="120"
    viewBox="0 0 260 120"
    fill="none"
  >
    <defs>
      <filter id="pcbGlow">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* main traces */}
    <path
      d="
        M10 60 H70
        L110 25
        H170
        H220

        M70 60
        L110 95
        H170
        H220

        M30 30 H90
        L120 55
        H200

        M30 90 H90
        L120 65
        H200

        M80 60 H150
      "
      stroke="#00d9ff"
      strokeWidth="2.2"
      strokeLinecap="round"
      filter="url(#pcbGlow)"
    />

    {/* nodes */}
    <circle cx="10" cy="60" r="5" fill="#00d9ff" filter="url(#pcbGlow)" />
    <circle cx="220" cy="25" r="5" fill="#00d9ff" filter="url(#pcbGlow)" />
    <circle cx="220" cy="95" r="5" fill="#00d9ff" filter="url(#pcbGlow)" />
    <circle cx="200" cy="55" r="4" fill="#00d9ff" filter="url(#pcbGlow)" />
    <circle cx="200" cy="65" r="4" fill="#00d9ff" filter="url(#pcbGlow)" />

    {/* micro dots */}
    <circle cx="165" cy="42" r="2" fill="#00d9ff" />
    <circle cx="175" cy="42" r="2" fill="#00d9ff" />
    <circle cx="185" cy="42" r="2" fill="#00d9ff" />
  </svg>

  {/* RIGHT PCB */}
  <svg
    className="absolute right-0 top-1/2 -translate-y-1/2"
    width="260"
    height="120"
    viewBox="0 0 260 120"
    fill="none"
  >
    <defs>
      <filter id="pcbGlow2">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <path
      d="
        M250 60 H190
        L150 25
        H90
        H40

        M190 60
        L150 95
        H90
        H40

        M230 30 H170
        L140 55
        H60

        M230 90 H170
        L140 65
        H60

        M180 60 H110
      "
      stroke="#00d9ff"
      strokeWidth="2.2"
      strokeLinecap="round"
      filter="url(#pcbGlow2)"
    />

    <circle cx="250" cy="60" r="5" fill="#00d9ff" filter="url(#pcbGlow2)" />
    <circle cx="40" cy="25" r="5" fill="#00d9ff" filter="url(#pcbGlow2)" />
    <circle cx="40" cy="95" r="5" fill="#00d9ff" filter="url(#pcbGlow2)" />
    <circle cx="60" cy="55" r="4" fill="#00d9ff" filter="url(#pcbGlow2)" />
    <circle cx="60" cy="65" r="4" fill="#00d9ff" filter="url(#pcbGlow2)" />

    <circle cx="95" cy="42" r="2" fill="#00d9ff" />
    <circle cx="85" cy="42" r="2" fill="#00d9ff" />
    <circle cx="75" cy="42" r="2" fill="#00d9ff" />
  </svg>

  {/* BUTTON */}
  <div
    className="
      relative z-10
      px-16 py-5
      rounded-[18px]
      border border-cyan-300/40
      overflow-hidden
      backdrop-blur-xl
      shadow-[0_0_35px_rgba(0,217,255,0.55)]
      transition-all duration-300
      group-hover:scale-105
    "
    style={{
      background:
        'linear-gradient(180deg, rgba(0,217,255,0.18) 0%, rgba(0,217,255,0.06) 100%)'
    }}
  >
    {/* inner glass */}
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/15 to-transparent" />

    {/* futuristic decorations */}
    <div className="absolute top-3 left-5 flex gap-2">
      <span className="w-2 h-2 rounded-full bg-cyan-300/40" />
      <span className="w-2 h-2 rounded-full bg-cyan-300/40" />
      <span className="w-2 h-2 rounded-full bg-cyan-300/40" />
    </div>

    <div className="absolute bottom-4 left-6 w-16 h-[3px] bg-cyan-300/20" />
    <div className="absolute bottom-4 right-6 w-16 h-[3px] bg-cyan-300/20" />

    <div className="relative flex items-center gap-4">
      <span className="text-2xl">🚀</span>

      <span className="text-white font-bold text-3xl tracking-wider">
        START
      </span>
    </div>
  </div>
</button>

          {/* RIGHT DAY */}
          <div
            className="
              rounded-3xl
              border border-cyan-500/20
              bg-cyan-500/10
              px-6 py-4 text-center
            "
          >
            <p className="text-slate-400 text-xs uppercase tracking-widest">
              Current Day
            </p>

            <p className="text-3xl font-bold text-cyan-300 mt-2">
              {currentDay} / 21
            </p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="
              h-full rounded-full
              bg-gradient-to-r from-cyan-500 to-sky-400
              transition-all duration-700
            "
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* BOTTOM INFO */}
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-slate-400">
            Egg incubation monitoring progress
          </span>

          <span className="text-cyan-300 font-semibold">
            {Math.round(progress)}% Completed
          </span>
        </div>
      </div>
    </div>
  );
}
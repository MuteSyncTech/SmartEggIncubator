import React from 'react';
import {
  Droplets,
  Egg
} from 'lucide-react';

export function StatusCard({ title, value, type }) {
  const isWater = type === 'water';
  const Icon = isWater ? Droplets : Egg;

  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        border border-cyan-500/10
        bg-gradient-to-br from-[#081221] to-[#030b18]
        p-5 shadow-xl shadow-cyan-500/5
      "
    >
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/15">
            <Icon className="w-5 h-5 text-cyan-300" />
          </div>

          <span
            className={`
              px-3 py-1 rounded-full text-xs font-bold
              ${
                isWater
                  ? value
                    ? 'bg-cyan-500/15 text-cyan-300'
                    : 'bg-red-500/15 text-red-300'
                  : 'bg-cyan-500/15 text-cyan-300'
              }
            `}
          >
            {isWater ? (value ? 'OK' : 'LOW') : 'LIVE'}
          </span>
        </div>

        <p className="text-slate-400 text-xs uppercase tracking-widest">
          {title}
        </p>

        <h2 className="text-2xl font-bold text-white mt-2">
          {isWater
            ? (value ? 'Available' : 'Empty')
            : 'Servo Active'}
        </h2>

        {isWater ? (
          <div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`
                h-full rounded-full
                ${
                  value
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-500'
                    : 'bg-gradient-to-r from-red-400 to-red-500'
                }
              `}
              style={{
                width: value ? '85%' : '20%'
              }}
            />
          </div>
        ) : (
          <div className="mt-5 flex gap-2">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
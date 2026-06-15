import React from 'react';
import {
  Thermometer,
  Droplets
} from 'lucide-react';

export function MetricCard({ title, value, unit, type }) {
  const config = {
    temperature: {
      icon: Thermometer,
      color: 'text-cyan-300',
      bg: 'bg-cyan-500/15',
      bars: [30, 45, 35, 70, 55, 80, 60]
    },
    humidity: {
      icon: Droplets,
      color: 'text-blue-300',
      bg: 'bg-blue-500/15',
      bars: [50, 65, 40, 55, 75, 60, 85]
    }
  };

  const item = config[type];
  const Icon = item.icon;

  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        border border-cyan-500/10
        bg-gradient-to-br from-[#081221] to-[#030b18]
        p-5 shadow-xl shadow-cyan-500/5
      "
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${item.bg}`}>
            <Icon className={`w-5 h-5 ${item.color}`} />
          </div>

          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        <p className="text-slate-400 text-xs uppercase tracking-widest">
          {title}
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          {value}
          <span className={`text-sm ml-1 ${item.color}`}>
            {unit}
          </span>
        </h2>

        <div className="mt-5 h-12 flex items-end gap-1">
          {item.bars.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-full bg-cyan-500/20"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
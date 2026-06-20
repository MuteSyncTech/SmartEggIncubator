import React from 'react';
import {
  Flame,
  Fan,
  Droplets,
  RefreshCw
} from 'lucide-react';

export function ActuatorStatus({ actuators }) {
  const cards = [
    {
      title: 'Heater',
      active: actuators?.heater,
      icon: Flame,
      graph: 'wave',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    {
      title: 'Circulation Fan',
      active: actuators?.fan,
      icon: Fan,
      graph: 'lines',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-300'
    },
    {
      title: 'Water Pump',
      active: actuators?.pompa,
      icon: Droplets,
      graph: 'dots',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-300'
    },
    {
      title: 'Servo Motor',
      active: actuators?.servo,
      icon: RefreshCw,
      graph: 'arc',
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-cyan-300'
    }
  ];

  const renderGraph = (type) => {
    if (type === 'wave') {
      return (
        <svg viewBox="0 0 100 18" className="w-full h-5">
          <path
            d="M0 9 Q12 2 25 9 T50 9 T75 9 T100 7"
            fill="none"
            stroke="#fb923c"
            strokeWidth="2"
          />
        </svg>
      );
    }

    if (type === 'lines') {
      return (
        <svg viewBox="0 0 100 18" className="w-full h-5">
          <path d="M0 4 Q25 0 50 4 T100 4" fill="none" stroke="#22d3ee" strokeWidth="1.4" />
          <path d="M0 9 Q25 5 50 9 T100 9" fill="none" stroke="#22d3ee" strokeWidth="1.1" opacity="0.7" />
          <path d="M0 14 Q25 10 50 14 T100 14" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
        </svg>
      );
    }

    if (type === 'dots') {
      return (
        <div className="flex gap-1 justify-center mt-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{
                marginTop: Math.sin(i * 0.8) * 3
              }}
            />
          ))}
        </div>
      );
    }

    if (type === 'arc') {
      return (
        <svg viewBox="0 0 100 20" className="w-full h-5">
          <path
            d="M10 16 Q50 -2 90 16"
            fill="none"
            stroke="#1d9bf0"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }
  };

  return (
    <div
      className="
        rounded-3xl
        border border-cyan-500/10
        bg-gradient-to-br from-[#0b1730] to-[#081221]
        p-4
        shadow-2xl shadow-cyan-500/5
        h-full
        w-full
      "
    >
      <div className="grid grid-cols-2 gap-3 h-full">
        {cards.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="
                rounded-2xl
                border border-cyan-500/10
                bg-gradient-to-br from-[#081221] to-[#030b18]
                p-4
                flex flex-col justify-between
                min-h-[220px]
              "
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-3 rounded-2xl ${item.iconBg}`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>

                  <span
                    className={`
                      px-2 py-1 rounded-full text-[10px] font-bold
                      ${
                        item.active
                          ? 'bg-cyan-500/15 text-cyan-300'
                          : 'bg-slate-700 text-slate-300'
                      }
                    `}
                  >
                    {item.active ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>

                <h3 className="text-white text-base font-medium">
                  {item.title}
                </h3>

                <p className="text-white text-3xl font-bold mt-3">
                  {item.active ? 'ON' : 'OFF'}
                </p>
              </div>

              <div>
                {renderGraph(item.graph)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
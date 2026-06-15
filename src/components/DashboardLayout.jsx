import React from 'react';
import {
  LayoutDashboard,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import incubatorImg from '../assets/incubator.png';

export function DashboardLayout({
  children,
  activePage,
  setActivePage,
  isOffline
}) {
  const menu = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: Database
    }
  ];

  return (
    <div className="h-screen bg-[#020817] text-white flex overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className="
          w-72
          bg-gradient-to-b from-[#050d1a] to-[#081221]
          border-r border-cyan-500/10
          flex flex-col
          p-5
        "
      >
        {/* TOP BRAND */}
        <div
          className="
            rounded-3xl
            border border-cyan-500/15
            bg-gradient-to-b from-[#071226] to-[#030b18]
            p-5
            shadow-xl shadow-cyan-500/5
          "
        >
          <img
            src={incubatorImg}
            alt="Egg Incubator"
            className="
              w-44 h-44
              object-contain
              mx-auto
              drop-shadow-[0_0_30px_rgba(34,211,238,0.25)]
            "
          />

          <h1 className="text-4xl font-bold text-white text-center mt-4">
            Smart Incubator
          </h1>

          <p className="text-slate-400 text-lg text-center mt-2">
            IoT Monitoring System
          </p>
        </div>

        {/* MENU */}
        <div className="mt-6 space-y-3">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`
                  w-full flex items-center gap-4
                  px-5 py-4 rounded-2xl
                  transition-all duration-300
                  ${
                    active
                      ? 'bg-cyan-500/15 border border-cyan-400/30 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/30 border border-cyan-500/10 hover:bg-slate-800/50'
                  }
                `}
              >
                <div
                  className={`
                    p-3 rounded-xl
                    ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }
                  `}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`
                    text-xl font-medium
                    ${
                      active
                        ? 'text-cyan-200'
                        : 'text-slate-300'
                    }
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* DEVICE STATUS */}
        <div className="mt-auto">
          <div
            className={`
              rounded-3xl
              p-5
              border
              shadow-xl
              ${
                isOffline
                  ? 'bg-red-500/10 border-red-500/20 shadow-red-500/10'
                  : 'bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/10'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <div
                className={`
                  p-4 rounded-2xl
                  ${
                    isOffline
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }
                `}
              >
                {isOffline ? (
                  <WifiOff size={28} />
                ) : (
                  <Wifi size={28} />
                )}
              </div>

              <div>
                <p className="text-slate-400 text-sm">
                  Device Status
                </p>

                <p
                  className={`
                    text-2xl font-bold
                    ${
                      isOffline
                        ? 'text-red-400'
                        : 'text-cyan-300'
                    }
                  `}
                >
                  {isOffline ? 'OFFLINE' : 'ONLINE'}
                </p>

                <p className="text-slate-500 text-sm mt-1">
                  ESP8266 Connected
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto p-5">
        {children}
      </main>
    </div>
  );
}
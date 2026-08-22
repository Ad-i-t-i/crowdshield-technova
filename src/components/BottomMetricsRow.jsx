import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, DoorOpen, Navigation, Radio } from 'lucide-react';

export default function BottomMetricsRow({ threatLevel }) {
  // Sparkline data for last 30 min density trend
  const sparklineData = [
    { t: '15:45', d: 1.2 },
    { t: '15:50', d: 1.8 },
    { t: '15:55', d: 2.4 },
    { t: '16:00', d: 3.1 },
    { t: '16:05', d: 4.2 },
    { t: '16:10', d: (threatLevel / 18).toFixed(1) }
  ];

  // Entry / Exit balance data
  const entryExitData = [
    { name: 'Gate A', val: 420 },
    { name: 'Gate B', val: 380 },
    { name: 'Gate C', val: 650 },
    { name: 'Gate D', val: 210 }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 📈 Card 1: Crowd Density Trend (Sparkline Chart) */}
      <div className="clay-card-puffy p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#A8D8EA] flex items-center gap-1.5 font-heading">
            <TrendingUp className="w-4 h-4" /> DENSITY TREND (30 MIN)
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">+18%</span>
        </div>

        <div className="h-24 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A8D8EA" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#A8D8EA" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="d" stroke="#A8D8EA" strokeWidth={2.5} fill="url(#trendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🚪 Card 2: Entry/Exit Balance */}
      <div className="clay-card-puffy p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#AEDCC0] flex items-center gap-1.5 font-heading">
            <DoorOpen className="w-4 h-4" /> ENTRY / EXIT BALANCE
          </span>
          <span className="text-[10px] font-mono text-slate-400">GATES A-D</span>
        </div>

        <div className="h-24 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={entryExitData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <Bar dataKey="val" fill="#AEDCC0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🏃 Card 3: Evacuation Route Status (Progress Bars) */}
      <div className="clay-card-puffy p-4 flex flex-col gap-2 justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#C3B1E1] flex items-center gap-1.5 font-heading">
            <Navigation className="w-4 h-4" /> EVACUATION ROUTES
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">READY</span>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <div>
            <div className="flex justify-between text-[10px] text-slate-300 font-mono mb-0.5">
              <span>Route 1 (North)</span>
              <span>88% Capacity</span>
            </div>
            <div className="w-full bg-[#0D1B2A] h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div className="h-full rounded-full bg-[#AEDCC0] w-[88%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-300 font-mono mb-0.5">
              <span>Route 2 (East)</span>
              <span>42% Capacity</span>
            </div>
            <div className="w-full bg-[#0D1B2A] h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div className="h-full rounded-full bg-[#A8D8EA] w-[42%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 📡 Card 4: Sensor Network Health (Grid of Status Dots) */}
      <div className="clay-card-puffy p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#FF8B94] flex items-center gap-1.5 font-heading">
            <Radio className="w-4 h-4" /> SENSOR NETWORK
          </span>
          <span className="text-[10px] font-mono text-emerald-400">24/24 ONLINE</span>
        </div>

        {/* 4x6 Grid of status dots */}
        <div className="grid grid-cols-6 gap-2 my-auto pt-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full shadow ${
                i === 14 ? 'bg-[#FF8B94] animate-ping' : i === 8 ? 'bg-amber-400' : 'bg-[#AEDCC0]'
              }`}
              title={`Sensor #${i + 1} - Normal`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp, Activity, Zap, Clock, Flame } from 'lucide-react';

export default function AnalyticsDashboard({ 
  threatLevel, 
  setThreatLevel, 
  gateCBlocked, 
  vipSurge, 
  gateBRerouted, 
  emergencyExit2Open,
  onExecuteRecommendation 
}) {
  const [chartData, setChartData] = useState([]);
  const [countdown, setCountdown] = useState(600);

  useEffect(() => {
    let level = 28;
    if (gateCBlocked) level += 38;
    if (vipSurge) level += 25;
    if (gateBRerouted) level -= 22;
    if (emergencyExit2Open) level -= 18;

    level = Math.max(12, Math.min(98, level));
    setThreatLevel(level);
  }, [gateCBlocked, vipSurge, gateBRerouted, emergencyExit2Open, setThreatLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const currentDensity = (threatLevel / 18).toFixed(1);
      const currentSpeed = Math.max(0.4, (2.8 - (threatLevel / 45))).toFixed(2);
      const jitter = (Math.random() - 0.5) * 4;
      const currentRisk = Math.max(5, Math.min(99, Math.round(threatLevel + jitter)));

      setChartData((prev) => {
        const next = [...prev, {
          time: timeStr,
          density: parseFloat(currentDensity),
          speed: parseFloat(currentSpeed),
          risk: currentRisk
        }];
        if (next.length > 12) next.shift();
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [threatLevel]);

  useEffect(() => {
    let timer;
    if (threatLevel >= 75) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setCountdown(600);
    }
    return () => clearInterval(timer);
  }, [threatLevel]);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="clay-card-puffy p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-extrabold text-white font-heading">
            AI Stampede Prediction & Telemetry
          </h2>
          <p className="text-xs text-slate-400 font-mono">Real-Time Risk Forecasting</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-blue-400">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
          <span className="font-bold">REAL-TIME STREAM</span>
        </div>
      </div>

      {threatLevel >= 75 && (
        <div className="rounded-2xl border-2 border-[#FF8B94] bg-red-950/80 p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-breathing">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/40 border border-red-400 text-red-300">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-red-600 text-white">
                  STAMPEDE BREACH ALERT
                </span>
                <h3 className="text-sm font-black text-white">
                  10-Minute Stampede Likelihood &gt; 75%
                </h3>
              </div>
              <p className="text-xs text-red-200 mt-1">
                Extreme crowd crush forecast at Gate C Bottleneck.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0D1B2A] px-4 py-2 rounded-2xl border border-red-500/50">
            <div className="text-right">
              <div className="text-[10px] font-mono text-red-400 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time Remaining
              </div>
              <div className="text-xl font-black font-mono text-red-400">
                {formatCountdown(countdown)}
              </div>
            </div>

            <button
              onClick={() => onExecuteRecommendation('REROUTE_GATE_B')}
              className="clay-btn-coral px-4 py-2 text-xs font-black"
            >
              Reroute to Gate B NOW ⚡
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className={`p-4 rounded-2xl border ${threatLevel >= 75 ? 'bg-red-950/50 border-[#FF8B94]' : threatLevel >= 45 ? 'bg-amber-950/40 border-amber-500/50' : 'bg-[#0D1B2A] border-slate-800'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-bold">
            <span>Stampede Likelihood</span>
            <TrendingUp className={`w-4 h-4 ${threatLevel >= 75 ? 'text-[#FF8B94]' : 'text-[#AEDCC0]'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-heading ${threatLevel >= 75 ? 'text-[#FF8B94]' : threatLevel >= 45 ? 'text-amber-400' : 'text-[#AEDCC0]'}`}>
              {threatLevel}%
            </span>
            <span className="text-xs font-bold text-slate-400">
              {threatLevel >= 75 ? 'HIGH RISK' : threatLevel >= 45 ? 'ELEVATED' : 'SAFE'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1B2A] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-bold">
            <span>Crowd Density</span>
            <Zap className="w-4 h-4 text-[#A8D8EA]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-[#A8D8EA]">
              {(threatLevel / 18).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">ppl/m²</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1B2A] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-bold">
            <span>Flow Speed</span>
            <Activity className="w-4 h-4 text-[#C3B1E1]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-[#C3B1E1]">
              {Math.max(0.4, (2.8 - (threatLevel / 45))).toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono">m/s</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#0D1B2A] p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>TELEMETRY METRICS STREAM</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FF8B94]" /> Risk %</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#A8D8EA]" /> Density</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#C3B1E1]" /> Speed</span>
          </div>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0D1B2A', borderColor: '#1E263B', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="risk" stroke="#FF8B94" strokeWidth={2.5} fillOpacity={0.2} fill="#FF8B94" name="Stampede Risk %" />
              <Area type="monotone" dataKey="density" stroke="#A8D8EA" strokeWidth={2} fillOpacity={0.15} fill="#A8D8EA" name="Density (ppl/m²)" />
              <Line type="monotone" dataKey="speed" stroke="#C3B1E1" strokeWidth={2} dot={false} name="Speed (m/s)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

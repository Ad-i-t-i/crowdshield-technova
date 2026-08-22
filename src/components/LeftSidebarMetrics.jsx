import React from 'react';
import { Gauge, ArrowUpRight, ArrowDownRight, AlertCircle, ShieldCheck, Flame } from 'lucide-react';

export default function LeftSidebarMetrics({ threatLevel, density, flowRateIn, flowRateOut, hotspotCount, emergencyUnits }) {
  return (
    <div className="flex flex-col gap-4">
      {/* 🟢 1. Current Crowd Density (Gauge Widget) */}
      <div className="clay-card-puffy p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#AEDCC0] flex items-center gap-1.5 font-heading">
            <Gauge className="w-4 h-4" />
            CROWD DENSITY
          </span>
          <span className="text-[10px] font-mono text-slate-400">MAX 8.0</span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-heading text-white">{density}</span>
            <span className="text-xs text-slate-400 font-mono">ppl/m²</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
            density > 4.5 ? 'bg-[#FF8B94]/20 text-[#FF8B94] border border-[#FF8B94]' : 'bg-[#AEDCC0]/20 text-[#AEDCC0] border border-[#AEDCC0]'
          }`}>
            {density > 4.5 ? 'CRITICAL' : 'OPTIMAL'}
          </span>
        </div>

        {/* Gauge Progress Bar */}
        <div className="w-full bg-[#0D1B2A] h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner mt-1">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (density / 7) * 100)}%`,
              background: density > 4.5 
                ? 'linear-gradient(90deg, #FF8B94, #FF5252)' 
                : density > 2.5 
                ? 'linear-gradient(90deg, #FCD34D, #F59E0B)' 
                : 'linear-gradient(90deg, #AEDCC0, #4EBE89)'
            }}
          />
        </div>
      </div>

      {/* 🟡 2. Crowd Flow Rate (Entering vs Leaving Mini Bar) */}
      <div className="clay-card-puffy p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#A8D8EA] flex items-center gap-1.5 font-heading">
            <ArrowUpRight className="w-4 h-4" />
            CROWD FLOW RATE
          </span>
          <span className="text-[10px] font-mono text-slate-400">PPL / MIN</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="p-2.5 rounded-2xl bg-[#0D1B2A] border border-slate-800 flex flex-col">
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> INFLUX
            </span>
            <span className="text-xl font-extrabold text-white font-heading">{flowRateIn}</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#0D1B2A] border border-slate-800 flex flex-col">
            <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" /> OUTFLOW
            </span>
            <span className="text-xl font-extrabold text-white font-heading">{flowRateOut}</span>
          </div>
        </div>
      </div>

      {/* 🔴 3. Hotspot Count (Number badge with severity ring) */}
      <div className="clay-card-puffy p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#FF8B94] flex items-center gap-1.5 font-heading">
            <Flame className="w-4 h-4 text-[#FF8B94]" />
            ACTIVE HOTSPOTS
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">High Density Hazard Zones</p>
        </div>

        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0D1B2A] border-2 border-[#FF8B94] shadow-lg">
          <span className="text-xl font-black font-heading text-[#FF8B94] animate-pulse">
            {hotspotCount}
          </span>
        </div>
      </div>

      {/* 🔵 4. Emergency Units Deployed (Avatar Stack) */}
      <div className="clay-card-puffy p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#C3B1E1] flex items-center gap-1.5 font-heading">
            <ShieldCheck className="w-4 h-4" />
            EMERGENCY UNITS
          </span>
          <span className="text-xs font-black font-mono text-[#C3B1E1]">{emergencyUnits} Active</span>
        </div>

        {/* Avatar Stack */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex -space-x-2 overflow-hidden">
            {['👮‍♂️', '🚑', '🚒', '🛡️', '👮‍♀️'].map((avatar, idx) => (
              <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-[#1B263B] bg-[#0D1B2A] flex items-center justify-center text-sm shadow">
                {avatar}
              </div>
            ))}
          </div>

          <span className="text-[10px] font-mono text-slate-400 bg-[#0D1B2A] px-2 py-1 rounded-xl border border-slate-800">
            Sector 1-3 Dispatched
          </span>
        </div>
      </div>
    </div>
  );
}

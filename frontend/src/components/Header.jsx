import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Users, LayoutDashboard, BarChart3, ShieldCheck as ShieldIcon, Camera, Smartphone } from 'lucide-react';

export default function Header({ 
  threatLevel, 
  onResetSimulation, 
  headcount, 
  activeVenue, 
  setActiveVenue,
  activePage,
  setActivePage
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pages = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
    { id: 'mitigation', label: 'AI Directives', icon: ShieldIcon },
    { id: 'surveillance', label: 'CCTV & Voice', icon: Camera },
    { id: 'citizen', label: 'Citizen App', icon: Smartphone }
  ];

  const getStatusBadge = () => {
    if (threatLevel >= 75) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FF8B94]/20 border border-[#FF8B94] text-[#FF8B94] font-black text-xs animate-breathing">
          <ShieldAlert className="w-4 h-4" />
          <span>CRITICAL ({threatLevel}%)</span>
        </div>
      );
    } else if (threatLevel >= 45) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 font-extrabold text-xs">
          <AlertTriangle className="w-4 h-4" />
          <span>WARNING ({threatLevel}%)</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#AEDCC0]/20 border border-[#AEDCC0] text-[#AEDCC0] font-extrabold text-xs">
        <ShieldCheck className="w-4 h-4" />
        <span>SAFE ({threatLevel}%)</span>
      </div>
    );
  };

  return (
    <header className="w-full flex flex-col gap-3">
      {/* Top Status Strip */}
      <div className="clay-card-puffy p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#A8D8EA] to-[#70A6FF] text-[#0D1B2A] font-black text-xl shadow-md">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white font-heading">
                Kumbh Mela Safety Command
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#A8D8EA]/20 text-[#A8D8EA] border border-[#A8D8EA]/40">
                {activeVenue}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {time.toLocaleDateString()} • {time.toLocaleTimeString()} (LIVE MERN CONNECTED)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge()}

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#0D1B2A] border border-slate-700/80">
            <Users className="w-4 h-4 text-[#A8D8EA]" />
            <div>
              <span className="text-[9px] text-slate-400 font-mono uppercase block">HEADCOUNT</span>
              <span className="text-sm font-black font-heading text-white">
                {headcount.toLocaleString()}
              </span>
            </div>
          </div>

          <button onClick={onResetSimulation} className="clay-btn-blue text-xs font-bold py-1.5 px-3">
            Reset
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="clay-card-puffy p-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 w-full">
          {pages.map((p) => {
            const Icon = p.icon;
            const isActive = activePage === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePage(p.id)}
                className={`flex-1 py-2.5 px-4 rounded-2xl font-heading font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A8D8EA] to-[#70A6FF] text-[#0D1B2A] shadow-lg scale-100'
                    : 'bg-[#0D1B2A] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

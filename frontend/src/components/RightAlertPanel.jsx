import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Camera, Terminal } from 'lucide-react';
import PrivacyShieldCCTV from './PrivacyShieldCCTV';
import MultilingualCommandBar from './MultilingualCommandBar';

export default function RightAlertPanel({ 
  setGateBRerouted, 
  setSecurityWall, 
  setFocusedSector,
  setGateCBlocked 
}) {
  const [activeTab, setActiveTab] = useState('alerts');

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      zone: 'Zone C: Gate C Bottleneck',
      severity: 'CRITICAL',
      color: '#FF8B94',
      timestamp: '16:14:02',
      message: 'Density exceeded 6.5 p/m². High risk of bottleneck crush.',
      acknowledged: false
    },
    {
      id: 2,
      zone: 'Zone B: Central Corridor',
      severity: 'WARNING',
      color: '#FCD34D',
      timestamp: '16:12:45',
      message: 'Crowd influx velocity slowed by 30%. Potential bottleneck building.',
      acknowledged: false
    },
    {
      id: 3,
      zone: 'Zone A: North Plaza',
      severity: 'SAFE',
      color: '#AEDCC0',
      timestamp: '16:10:15',
      message: 'Normal crowd distribution maintained across entrance gates.',
      acknowledged: true
    }
  ]);

  const handleAcknowledge = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleDispatch = (id) => {
    setSecurityWall(true);
    setGateBRerouted(true);
    handleAcknowledge(id);
  };

  return (
    <div className="clay-card-puffy p-4 flex flex-col gap-3.5 h-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1 bg-[#0D1B2A] p-1 rounded-2xl border border-slate-800 w-full">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'alerts' ? 'bg-[#FF8B94] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Alerts Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('cctv')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'cctv' ? 'bg-[#A8D8EA] text-[#0D1B2A] shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>CCTV Shield</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'voice' ? 'bg-[#AEDCC0] text-[#0D1B2A] shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Voice Command</span>
          </button>
        </div>
      </div>

      {activeTab === 'alerts' && (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[580px] pr-1">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-3.5 rounded-2xl bg-[#0D1B2A] border border-slate-800 transition-all flex flex-col gap-2 relative overflow-hidden ${
                alt.severity === 'CRITICAL' ? 'shadow-lg border-l-4 border-l-[#FF8B94]' : alt.severity === 'WARNING' ? 'border-l-4 border-l-[#FCD34D]' : 'border-l-4 border-l-[#AEDCC0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white font-heading">{alt.zone}</span>
                <span className="text-[10px] font-mono text-slate-400">{alt.timestamp}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase"
                  style={{
                    backgroundColor: `${alt.color}20`,
                    color: alt.color,
                    border: `1px solid ${alt.color}`
                  }}
                >
                  {alt.severity}
                </span>
                {alt.acknowledged && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Acknowledged
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300">{alt.message}</p>

              {!alt.acknowledged && (
                <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleAcknowledge(alt.id)}
                    className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleDispatch(alt.id)}
                    className="flex-1 py-1.5 rounded-xl bg-[#FF8B94] hover:bg-red-500 text-white text-xs font-black shadow transition-all"
                  >
                    Dispatch Response
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cctv' && <PrivacyShieldCCTV />}
      {activeTab === 'voice' && (
        <MultilingualCommandBar
          setFocusedSector={setFocusedSector}
          setSecurityWall={setSecurityWall}
          setGateBRerouted={setGateBRerouted}
          setGateCBlocked={setGateCBlocked}
        />
      )}
    </div>
  );
}

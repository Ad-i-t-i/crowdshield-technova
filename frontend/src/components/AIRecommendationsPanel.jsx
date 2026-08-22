import React, { useState } from 'react';
import { Navigation, DoorOpen, ShieldCheck, Megaphone, CheckCircle2 } from 'lucide-react';

export default function AIRecommendationsPanel({ 
  gateBRerouted, 
  setGateBRerouted, 
  emergencyExit2Open, 
  setEmergencyExit2Open, 
  securityWall, 
  setSecurityWall,
  onTriggerAnnouncement
}) {
  const [activeToast, setActiveToast] = useState(null);

  const showNotification = (msg) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 2500);
  };

  const handleRerouteGateB = () => {
    const newState = !gateBRerouted;
    setGateBRerouted(newState);
    showNotification(newState ? 'Flow Rerouted to Gate B' : 'Reroute Disabled');
  };

  const handleOpenEmergencyExit = () => {
    const newState = !emergencyExit2Open;
    setEmergencyExit2Open(newState);
    showNotification(newState ? 'Emergency Exit 2 Opened' : 'Exit 2 Closed');
  };

  const handleDeploySecurity = () => {
    const newState = !securityWall;
    setSecurityWall(newState);
    showNotification(newState ? 'Security Barricade Deployed' : 'Barricade Removed');
  };

  const handleBroadcastNotice = () => {
    onTriggerAnnouncement('Hindi', 'कृपया ध्यान दें! गेट बी की तरफ बढ़ें। गेट सी पर भीड़ नियंत्रण जारी है।');
    showNotification('PA Alert Broadcasted');
  };

  return (
    <div className="clay-card-puffy p-5 flex flex-col gap-4 relative">
      {activeToast && (
        <div className="absolute -top-4 left-4 right-4 z-30 p-2.5 rounded-2xl bg-blue-900 border border-blue-400 text-white text-xs font-bold flex items-center gap-2 shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
          <span>{activeToast}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-base font-extrabold text-white font-heading">
          AI Prevention Directives
        </h2>
        <span className="text-xs font-mono text-slate-400">Action Panel</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleRerouteGateB}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
            gateBRerouted
              ? 'bg-[#70A6FF] text-[#0D1B2A] font-black border-white shadow-lg'
              : 'bg-[#0D1B2A] hover:bg-slate-800 border-slate-800 text-slate-200'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${gateBRerouted ? 'bg-[#0D1B2A] text-white' : 'bg-blue-600/20 text-[#A8D8EA]'}`}>
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold">Reroute Flow to Gate B</div>
            <div className="text-[11px] opacity-80 mt-0.5">Relieve Gate C congestion</div>
          </div>
        </button>

        <button
          onClick={handleOpenEmergencyExit}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
            emergencyExit2Open
              ? 'bg-[#70A6FF] text-[#0D1B2A] font-black border-white shadow-lg'
              : 'bg-[#0D1B2A] hover:bg-slate-800 border-slate-800 text-slate-200'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${emergencyExit2Open ? 'bg-[#0D1B2A] text-white' : 'bg-amber-500/20 text-amber-400'}`}>
            <DoorOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold">Open Emergency Exit 2</div>
            <div className="text-[11px] opacity-80 mt-0.5">Unlock south-east egress gate</div>
          </div>
        </button>

        <button
          onClick={handleDeploySecurity}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
            securityWall
              ? 'bg-[#70A6FF] text-[#0D1B2A] font-black border-white shadow-lg'
              : 'bg-[#0D1B2A] hover:bg-slate-800 border-slate-800 text-slate-200'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${securityWall ? 'bg-[#0D1B2A] text-white' : 'bg-blue-600/20 text-[#A8D8EA]'}`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold">Deploy Security Team</div>
            <div className="text-[11px] opacity-80 mt-0.5">Place corridor barricade</div>
          </div>
        </button>

        <button
          onClick={handleBroadcastNotice}
          className="p-3.5 rounded-2xl border border-slate-800 bg-[#0D1B2A] hover:bg-slate-800 text-slate-200 text-left transition-all flex items-center gap-3.5"
        >
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-[#A8D8EA]">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold">Broadcast PA Alert</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Play evacuation audio notice</div>
          </div>
        </button>
      </div>
    </div>
  );
}

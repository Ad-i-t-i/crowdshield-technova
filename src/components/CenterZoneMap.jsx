import React, { useRef, useEffect, useState } from 'react';
import { Compass, Play, Pause, AlertOctagon, Users, Shield, RotateCcw, X, Info } from 'lucide-react';
import { postAction } from '../utils/api';


export default function CenterZoneMap({
  gateCBlocked,
  setGateCBlocked,
  vipSurge,
  setVipSurge,
  securityWall,
  setSecurityWall,
  gateBRerouted,
  setGateBRerouted,
  emergencyExit2Open,
  setEmergencyExit2Open,
  focusedSector,
  setFocusedSector,
  incidentMarkers,
  onCanvasClickAddIncident
}) {
  const canvasRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedZoneModal, setSelectedZoneModal] = useState(null);

  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);

  // Initialize physics particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 300; i++) {
      particles.push({
        id: i,
        x: Math.random() * 800,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 2.5,
        isVip: false,
        stuckFrames: 0,
        color: '#A8D8EA'
      });
    }
    particlesRef.current = particles;
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth || 700);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    const gates = {
      gateA: { x: width * 0.15, y: height * 0.15, label: 'GATE A ➔', color: '#A8D8EA' },
      gateB: { x: width * 0.85, y: height * 0.35, label: 'GATE B ➔', color: '#AEDCC0' },
      gateC: { x: width * 0.5, y: height * 0.85, label: 'GATE C ➔', color: gateCBlocked ? '#FF8B94' : '#AEDCC0' },
      gateD: { x: width * 0.1, y: height * 0.7, label: 'GATE D ➔', color: '#A8D8EA' },
      emergencyExit1: { x: width * 0.85, y: height * 0.15, label: 'EXIT 1', color: '#FCD34D' },
      emergencyExit2: { x: width * 0.85, y: height * 0.8, label: 'EXIT 2', color: emergencyExit2Open ? '#AEDCC0' : '#64748B' }
    };

    // Zones A, B, C, D with live density fill colors
    const zones = [
      { id: 'Zone A', name: 'Zone A: North Plaza', density: 1.4, color: 'rgba(174, 220, 192, 0.25)', border: '#AEDCC0', x: width * 0.08, y: height * 0.08, w: width * 0.38, h: height * 0.35 },
      { id: 'Zone B', name: 'Zone B: Central Corridor', density: 3.8, color: 'rgba(252, 211, 77, 0.25)', border: '#FCD34D', x: width * 0.3, y: height * 0.38, w: width * 0.4, h: height * 0.35 },
      { id: 'Zone C', name: 'Zone C: Gate C Bottleneck', density: gateCBlocked ? 6.8 : 4.2, color: gateCBlocked ? 'rgba(255, 139, 148, 0.35)' : 'rgba(251, 146, 60, 0.25)', border: gateCBlocked ? '#FF8B94' : '#FB923C', x: width * 0.38, y: height * 0.72, w: width * 0.3, h: height * 0.22 },
      { id: 'Zone D', name: 'Zone D: West Entry', density: 1.8, color: 'rgba(168, 216, 234, 0.25)', border: '#A8D8EA', x: width * 0.72, y: height * 0.08, w: width * 0.22, h: height * 0.45 }
    ];

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // 1. Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Render Color-Coded Zones (Green <2 | Yellow 2-4 | Orange 4-6 | Red >6)
      zones.forEach((z) => {
        ctx.fillStyle = z.color;
        ctx.fillRect(z.x, z.y, z.w, z.h);

        ctx.strokeStyle = z.border;
        ctx.lineWidth = 2;
        ctx.strokeRect(z.x, z.y, z.w, z.h);

        // Zone Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText(`${z.name} (${z.density} p/m²)`, z.x + 10, z.y + 20);

        // Pulsing Hotspot Indicator if Red/Critical (>6)
        if (z.density > 6.0) {
          const pulse = (Math.sin(frameCount * 0.1) + 1) * 8;
          ctx.strokeStyle = '#FF8B94';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(z.x + z.w / 2, z.y + z.h / 2, 20 + pulse, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 3. Pathways & Flow Vectors
      ctx.strokeStyle = 'rgba(168, 216, 234, 0.15)';
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(gates.gateA.x, gates.gateA.y);
      ctx.lineTo(width * 0.5, height * 0.5);
      ctx.stroke();

      ctx.strokeStyle = gateCBlocked ? 'rgba(255, 139, 148, 0.3)' : 'rgba(174, 220, 192, 0.2)';
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.5);
      ctx.lineTo(gates.gateC.x, gates.gateC.y);
      ctx.stroke();

      if (gateBRerouted) {
        ctx.strokeStyle = 'rgba(168, 216, 234, 0.6)';
        ctx.lineWidth = 4;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.6);
        ctx.quadraticCurveTo(width * 0.7, height * 0.5, gates.gateB.x, gates.gateB.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (securityWall) {
        ctx.strokeStyle = '#70A6FF';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(width * 0.35, height * 0.68);
        ctx.lineTo(width * 0.65, height * 0.68);
        ctx.stroke();
      }

      // 4. Gate Markers with Arrow indicators
      Object.entries(gates).forEach(([key, gate]) => {
        ctx.fillStyle = gate.color;
        ctx.beginPath();
        ctx.arc(gate.x, gate.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(gate.label, gate.x - 35, gate.y - 12);
      });

      // 5. Crowd Particles Physics
      if (!isPaused) {
        particlesRef.current.forEach((p) => {
          let target = gates.gateC;
          if (gateBRerouted || (gateCBlocked && Math.random() > 0.15)) {
            target = gates.gateB;
          }
          if (emergencyExit2Open && p.y > height * 0.6 && p.x > width * 0.6) {
            target = gates.emergencyExit2;
          }

          let dx = target.x - p.x;
          let dy = target.y - p.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 6) {
            p.vx += (dx / dist) * 0.06;
            p.vy += (dy / dist) * 0.06;
          } else {
            p.x = gates.gateA.x + (Math.random() - 0.5) * 40;
            p.y = gates.gateA.y + (Math.random() - 0.5) * 40;
            p.vx = (Math.random() - 0.5) * 1.5;
            p.vy = (Math.random() - 0.5) * 1.5;
          }

          if (gateCBlocked) {
            const distGateC = Math.hypot(p.x - gates.gateC.x, p.y - gates.gateC.y);
            if (distGateC < 90) {
              p.vx *= 0.35;
              p.vy *= 0.35;
              p.stuckFrames++;
            } else {
              p.stuckFrames = Math.max(0, p.stuckFrames - 1);
            }
          }

          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          p.x += p.vx;
          p.y += p.vy;

          if (p.stuckFrames > 25 || (gateCBlocked && Math.hypot(p.x - gates.gateC.x, p.y - gates.gateC.y) < 85)) {
            p.color = '#FF8B94';
          } else if (speed < 0.6) {
            p.color = '#FCD34D';
          } else {
            p.color = '#A8D8EA';
          }

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        particlesRef.current.forEach((p) => {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Incident Markers
      incidentMarkers.forEach((inc) => {
        ctx.strokeStyle = '#FF8B94';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(inc.x, inc.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#FF8B94';
        ctx.beginPath();
        ctx.arc(inc.x, inc.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gateCBlocked, vipSurge, securityWall, gateBRerouted, emergencyExit2Open, focusedSector, incidentMarkers, isPaused]);

  // Click handler to open detail modal or drop marker
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y > 280 && x > 250 && x < 550) {
      setSelectedZoneModal({
        id: 'Zone C',
        name: 'Zone C: Gate C Bottleneck',
        density: gateCBlocked ? '6.8 ppl/m² (CRITICAL)' : '4.2 ppl/m² (HIGH)',
        status: gateCBlocked ? 'GATE BLOCKED' : 'HEAVY INFLUX',
        mitigation: 'Reroute flow towards Gate B'
      });
    } else {
      onCanvasClickAddIncident(x, y);
    }
  };

  return (
    <div className="clay-card-puffy p-5 flex flex-col gap-4 relative">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-black text-white font-heading flex items-center gap-2">
            Interactive Zone Heat Map
            <span className="text-xs font-mono font-bold text-[#A8D8EA] px-2 py-0.5 rounded-full bg-[#A8D8EA]/10 border border-[#A8D8EA]/30">
              Zones A - D
            </span>
          </h2>
          <p className="text-xs text-slate-400">Live Density Color Overlay: Green (&lt;2) → Yellow (2-4) → Orange (4-6) → Red (&gt;6)</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="clay-btn-blue text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Floor Plan */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#0D1B2A] border border-slate-800 shadow-inner cursor-pointer">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full block"
          style={{ height: '400px' }}
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 p-2 rounded-xl bg-[#1B263B]/90 border border-slate-700 text-[10px] font-mono text-slate-200 backdrop-blur-md">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#AEDCC0]" /> Safe (&lt;2)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]" /> Mod (2-4)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> High (4-6)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF8B94]" /> Critical (&gt;6)</span>
        </div>
      </div>

      {/* Zone Detail Popup Modal (Frosted Glass Overlay) */}
      {selectedZoneModal && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md rounded-2xl animate-fade-in">
          <div className="clay-card-puffy p-6 max-w-md w-full flex flex-col gap-3 relative border-2 border-[#FF8B94]">
            <button
              onClick={() => setSelectedZoneModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-[#FF8B94]" />
              <h3 className="text-base font-black text-white font-heading">{selectedZoneModal.name}</h3>
            </div>

            <div className="p-3 rounded-xl bg-[#0D1B2A] border border-slate-800 text-xs font-mono text-slate-200 flex flex-col gap-1.5">
              <div><strong>Density Level:</strong> <span className="text-[#FF8B94]">{selectedZoneModal.density}</span></div>
              <div><strong>Current Status:</strong> {selectedZoneModal.status}</div>
              <div><strong>Recommended Action:</strong> {selectedZoneModal.mitigation}</div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  setGateBRerouted(true);
                  setSelectedZoneModal(null);
                }}
                className="clay-btn-coral flex-1 text-xs py-2 text-center justify-center"
              >
                Execute Gate B Reroute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#0D1B2A] p-3 rounded-2xl border border-slate-800">
        <span className="text-xs font-extrabold text-slate-300 font-heading">
          Zone Simulation Directives:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const nextState = !gateCBlocked;
              setGateCBlocked(nextState);
              postAction('gateCBlocked', nextState);
            }}
            className={gateCBlocked ? 'clay-btn-coral text-xs py-1.5 px-3' : 'clay-btn-blue text-xs py-1.5 px-3'}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{gateCBlocked ? 'Gate C Blocked' : 'Block Gate C'}</span>
          </button>

          <button
            onClick={() => {
              const nextState = !vipSurge;
              setVipSurge(nextState);
              postAction('vipSurge', nextState);
            }}
            className={vipSurge ? 'clay-btn-coral text-xs py-1.5 px-3' : 'clay-btn-blue text-xs py-1.5 px-3'}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{vipSurge ? 'VIP Surge Active' : 'VIP Surge'}</span>
          </button>

          <button
            onClick={() => {
              const nextState = !securityWall;
              setSecurityWall(nextState);
              postAction('securityWall', nextState);
            }}
            className={securityWall ? 'clay-btn-coral text-xs py-1.5 px-3' : 'clay-btn-blue text-xs py-1.5 px-3'}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{securityWall ? 'Barricade Deployed' : 'Deploy Barricade'}</span>
          </button>

          <button
            onClick={() => {
              setGateCBlocked(false);
              setVipSurge(false);
              setSecurityWall(false);
              setGateBRerouted(false);
              setEmergencyExit2Open(false);
              postAction('gateCBlocked', false);
              postAction('vipSurge', false);
              postAction('securityWall', false);
              postAction('gateBRerouted', false);
              postAction('emergencyExit2Open', false);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Map</span>
          </button>

        </div>
      </div>
    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, AlertOctagon, Shield, RotateCcw, Users, Target } from 'lucide-react';

export default function DigitalTwinCanvas({
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
  onCanvasClickAddIncident,
  activeVenue
}) {
  const canvasRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [avgSpeed, setAvgSpeed] = useState(1.4);
  const [bottleneckDensity, setBottleneckDensity] = useState(3.2);

  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);

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
        color: '#60a5fa'
      });
    }
    particlesRef.current = particles;
  }, [activeVenue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth || 800);
    let height = (canvas.height = 440);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 440;
    };
    window.addEventListener('resize', handleResize);

    const gates = {
      gateA: { x: width * 0.15, y: height * 0.15, label: 'GATE A (Entry)', color: '#38bdf8' },
      gateB: { x: width * 0.85, y: height * 0.35, label: 'GATE B (East Exit)', color: '#60a5fa' },
      gateC: { x: width * 0.5, y: height * 0.85, label: 'GATE C (South Exit)', color: gateCBlocked ? '#ef4444' : '#38bdf8' },
      gateD: { x: width * 0.1, y: height * 0.7, label: 'GATE D (West Entry)', color: '#38bdf8' },
      emergencyExit1: { x: width * 0.85, y: height * 0.15, label: 'EXIT 1', color: '#f59e0b' },
      emergencyExit2: { x: width * 0.85, y: height * 0.8, label: 'EXIT 2', color: emergencyExit2Open ? '#38bdf8' : '#475569' }
    };

    const sectors = [
      { id: 'Sector 1', name: 'NORTH PLAZA', x: width * 0.08, y: height * 0.08, w: width * 0.4, h: height * 0.35 },
      { id: 'Sector 2', name: 'CENTRAL CORRIDOR', x: width * 0.3, y: height * 0.38, w: width * 0.4, h: height * 0.35 },
      { id: 'Sector 3', name: 'GATE C BOTTLENECK', x: width * 0.38, y: height * 0.72, w: width * 0.3, h: height * 0.22 }
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Solid tactile grid
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

      // Sectors
      sectors.forEach((sec) => {
        const isFocused = focusedSector === sec.id;
        ctx.fillStyle = isFocused ? 'rgba(59, 130, 246, 0.12)' : 'rgba(21, 28, 46, 0.4)';
        ctx.fillRect(sec.x, sec.y, sec.w, sec.h);
        
        ctx.strokeStyle = isFocused ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isFocused ? 2 : 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(sec.x, sec.y, sec.w, sec.h);
        ctx.setLineDash([]);

        ctx.fillStyle = isFocused ? '#60a5fa' : '#64748b';
        ctx.font = '700 11px Outfit, sans-serif';
        ctx.fillText(sec.name, sec.x + 10, sec.y + 18);
      });

      // Pathways
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(gates.gateA.x, gates.gateA.y);
      ctx.lineTo(width * 0.5, height * 0.5);
      ctx.stroke();

      ctx.strokeStyle = gateCBlocked ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.15)';
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.5);
      ctx.lineTo(gates.gateC.x, gates.gateC.y);
      ctx.stroke();

      if (gateBRerouted) {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
        ctx.lineWidth = 4;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.6);
        ctx.quadraticCurveTo(width * 0.7, height * 0.5, gates.gateB.x, gates.gateB.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (securityWall) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(width * 0.35, height * 0.68);
        ctx.lineTo(width * 0.65, height * 0.68);
        ctx.stroke();
      }

      // Gates
      Object.entries(gates).forEach(([key, gate]) => {
        ctx.fillStyle = gate.color;
        ctx.beginPath();
        ctx.arc(gate.x, gate.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 11px Inter, sans-serif';
        ctx.fillText(gate.label, gate.x - 35, gate.y - 12);
      });

      // Particles
      if (!isPaused) {
        let totalSpeed = 0;
        let blockedNearGateC = 0;

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
              blockedNearGateC++;
            } else {
              p.stuckFrames = Math.max(0, p.stuckFrames - 1);
            }
          }

          if (securityWall && p.y > height * 0.65 && p.y < height * 0.72 && p.x > width * 0.35 && p.x < width * 0.65) {
            p.vy = -Math.abs(p.vy) - 0.6;
            p.vx += 0.8;
          }

          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const maxSpeed = p.isVip ? 3.5 : 2.2;
          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.stuckFrames > 25 || (gateCBlocked && Math.hypot(p.x - gates.gateC.x, p.y - gates.gateC.y) < 85)) {
            p.color = '#ef4444';
          } else if (speed < 0.6) {
            p.color = '#f59e0b';
          } else {
            p.color = '#60a5fa';
          }

          totalSpeed += speed;

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        const currentAvgSpeed = (totalSpeed / particlesRef.current.length) * 0.95;
        setAvgSpeed(currentAvgSpeed.toFixed(2));

        const cDensity = (blockedNearGateC / 30) * 1.8 + (gateCBlocked ? 3.8 : 1.2);
        setBottleneckDensity(cDensity.toFixed(1));
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
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(inc.x, inc.y, 13, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(inc.x, inc.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(inc.x + 8, inc.y - 22, 135, 26);
        ctx.strokeRect(inc.x + 8, inc.y - 22, 135, 26);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 10px Inter';
        ctx.fillText(`🚨 ${inc.title.substring(0, 15)}`, inc.x + 12, inc.y - 9);
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gateCBlocked, vipSurge, securityWall, gateBRerouted, emergencyExit2Open, focusedSector, incidentMarkers, isPaused]);

  const handleVipSurgeToggle = () => {
    const nextState = !vipSurge;
    setVipSurge(nextState);
    if (nextState) {
      const vips = [];
      for (let i = 0; i < 80; i++) {
        vips.push({
          id: 4000 + i,
          x: 100 + Math.random() * 100,
          y: 200 + Math.random() * 100,
          vx: 2 + Math.random() * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 3.5,
          isVip: true,
          stuckFrames: 0,
          color: '#f59e0b'
        });
      }
      particlesRef.current = [...particlesRef.current, ...vips];
    }
  };

  return (
    <div className="clay-card p-5 flex flex-col gap-4">
      {/* Panel Top Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white font-heading">
              Digital Twin Crowd Physics Simulation
            </h2>
            <p className="text-xs text-slate-400">{activeVenue} — Multi-Agent Spatial Pathfinding</p>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-[#0c101c] border border-slate-800 text-xs font-mono shadow-inner">
            <span className="text-slate-400">Agents: <strong className="text-blue-400">{particlesRef.current.length}</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Flow: <strong className="text-emerald-400">{avgSpeed} m/s</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Density: <strong className={bottleneckDensity > 4 ? 'text-red-400 font-bold' : 'text-amber-400'}>{bottleneckDensity} p/m²</strong></span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="clay-btn p-2 rounded-2xl"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Screen */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#070a14] border border-slate-800/80 shadow-2xl cursor-crosshair">
        <canvas
          ref={canvasRef}
          onClick={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            onCanvasClickAddIncident(e.clientX - rect.left, e.clientY - rect.top);
          }}
          className="w-full block"
          style={{ height: '420px' }}
        />

        {/* Sector Focus Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#151c2e] p-1.5 rounded-2xl border border-slate-800 shadow-lg">
          {['Sector 1', 'Sector 2', 'Sector 3'].map((sec) => (
            <button
              key={sec}
              onClick={() => setFocusedSector(focusedSector === sec ? null : sec)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                focusedSector === sec
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#0c101c] text-slate-400 hover:text-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c101c] p-3 rounded-2xl border border-slate-800 shadow-inner">
        <span className="text-xs font-extrabold text-slate-300 font-heading">
          Simulation Actions:
        </span>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setGateCBlocked(!gateCBlocked)}
            className={gateCBlocked ? 'clay-btn-danger' : 'clay-btn'}
          >
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>{gateCBlocked ? 'Gate C Blocked' : 'Simulate Gate C Blockage'}</span>
          </button>

          <button
            onClick={handleVipSurgeToggle}
            className={vipSurge ? 'clay-btn-primary' : 'clay-btn'}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>{vipSurge ? 'VIP Surge Active' : 'Trigger Sudden VIP Surge'}</span>
          </button>

          <button
            onClick={() => setSecurityWall(!securityWall)}
            className={securityWall ? 'clay-btn-primary' : 'clay-btn'}
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span>{securityWall ? 'Barricade Deployed' : 'Deploy Security Barricade'}</span>
          </button>

          <button
            onClick={() => {
              setGateCBlocked(false);
              setVipSurge(false);
              setSecurityWall(false);
              setGateBRerouted(false);
              setEmergencyExit2Open(false);
              setFocusedSector(null);
            }}
            className="clay-btn"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

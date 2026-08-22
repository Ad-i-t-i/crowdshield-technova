import React, { useRef, useEffect, useState } from 'react';
import { Camera, ShieldCheck, Eye, Lock } from 'lucide-react';

export default function PrivacyShieldCCTV() {
  const [privacyShieldActive, setPrivacyShieldActive] = useState(true);
  const [selectedCam, setSelectedCam] = useState('CAM 04 - Sector 2');
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.parentElement.clientWidth || 400);
    const height = (canvas.height = 210);

    const faces = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * (width - 70),
      y: 30 + Math.random() * (height - 70),
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: 24 + Math.random() * 6
    }));

    let animationId;

    const render = () => {
      ctx.fillStyle = '#070a14';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, height);
        ctx.lineTo(width / 2, height / 3);
        ctx.stroke();
      }

      faces.forEach((face) => {
        face.x += face.vx;
        face.y += face.vy;

        if (face.x < 20 || face.x > width - 40) face.vx *= -1;
        if (face.y < 30 || face.y > height - 40) face.vy *= -1;

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(face.x + face.size / 2, face.y + face.size / 2, face.size / 2, face.size / 1.6, 0, 0, Math.PI * 2);
        ctx.fill();

        if (privacyShieldActive) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.85)';
          ctx.fillRect(face.x - 2, face.y - 2, face.size + 4, face.size * 1.3);

          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(face.x - 2, face.y - 2, face.size + 4, face.size * 1.3);
        } else {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(face.x - 2, face.y - 2, face.size + 4, face.size * 1.3);
        }
      });

      ctx.fillStyle = '#60a5fa';
      ctx.font = '700 10px JetBrains Mono';
      ctx.fillText(`REC ● ${new Date().toLocaleTimeString()}`, 12, height - 12);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [privacyShieldActive, selectedCam]);

  return (
    <div className="clay-card-puffy p-5 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-extrabold text-white font-heading">
            Privacy Shield CCTV
          </h2>
        </div>

        <select
          value={selectedCam}
          onChange={(e) => setSelectedCam(e.target.value)}
          className="bg-[#0c101c] border border-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-xl focus:outline-none cursor-pointer"
        >
          <option value="CAM 04 - Sector 2">CAM 04 - Sector 2</option>
          <option value="CAM 08 - Gate C">CAM 08 - Gate C</option>
        </select>
      </div>

      {/* Screen */}
      <div className="relative rounded-2xl overflow-hidden bg-[#070a14] border border-slate-800 shadow-xl">
        <canvas ref={canvasRef} className="w-full block" style={{ height: '190px' }} />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0c101c] border border-slate-800 text-[10px] font-mono">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-slate-200 font-bold">{selectedCam}</span>
        </div>

        <div className="absolute top-2.5 right-2.5">
          {privacyShieldActive ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-900 border border-blue-400 text-white text-[10px] font-black font-mono">
              <Lock className="w-3 h-3 text-blue-300" />
              <span>PRIVACY SHIELD ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950 border border-red-500 text-red-300 text-[10px] font-black font-mono">
              <Eye className="w-3 h-3 text-red-400" />
              <span>FEED UNSHIELDED</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0c101c] border border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${privacyShieldActive ? 'text-blue-400' : 'text-slate-500'}`} />
          <span className="text-xs font-bold text-slate-200">Facial Anonymization Filter</span>
        </div>

        <button
          onClick={() => setPrivacyShieldActive(!privacyShieldActive)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            privacyShieldActive ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              privacyShieldActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

import { calculateRisk } from './riskEngine';

// Generates simulation telemetry, alerts, and charts for local fallback
export function generateMockTelemetry({ gateCBlocked, vipSurge, gateBRerouted, emergencyExit2Open, prevThreat }) {
  const density = gateCBlocked ? 6.8 : vipSurge ? 5.2 : 3.4;
  const flowSpeed = gateCBlocked ? 0.3 : gateBRerouted ? 1.6 : 1.1;
  const blockedGates = gateCBlocked ? 1 : 0;

  const calculatedRisk = calculateRisk({
    density,
    flowSpeed,
    blockedGates,
    vipSurge
  });

  const baseThreat = calculatedRisk;
  const adjustedThreat = baseThreat + (gateBRerouted ? -15 : 0) + (emergencyExit2Open ? -10 : 0);
  const threatLevel = Math.max(12, Math.min(98, Math.round(adjustedThreat)));

  return {
    density: parseFloat(density.toFixed(1)),
    speed: parseFloat(flowSpeed.toFixed(2)),
    threatLevel,
    headcount: 48000 + Math.round((Math.random() - 0.4) * 500),
    timestamp: new Date()
  };
}

export function generateMockZones({ gateCBlocked }) {
  return [
    { id: 'Zone A', name: 'Zone A: North Plaza', density: 1.4, color: 'rgba(174, 220, 192, 0.25)', border: '#AEDCC0' },
    { id: 'Zone B', name: 'Zone B: Central Corridor', density: 3.8, color: 'rgba(252, 211, 77, 0.25)', border: '#FCD34D' },
    { id: 'Zone C', name: 'Zone C: Gate C Bottleneck', density: gateCBlocked ? 6.8 : 4.2, color: gateCBlocked ? 'rgba(255, 139, 148, 0.35)' : 'rgba(251, 146, 60, 0.25)', border: gateCBlocked ? '#FF8B94' : '#FB923C' },
    { id: 'Zone D', name: 'Zone D: West Entry', density: 1.8, color: 'rgba(168, 216, 234, 0.25)', border: '#A8D8EA' }
  ];
}

export function generateMockSensors() {
  const sensors = [];
  const statusOptions = ['online', 'online', 'online', 'fault', 'critical'];
  for (let i = 1; i <= 24; i++) {
    sensors.push({
      id: `SN-${1000 + i}`,
      zone: i <= 6 ? 'Zone A' : i <= 12 ? 'Zone B' : i <= 18 ? 'Zone C' : 'Zone D',
      status: i === 15 ? 'critical' : statusOptions[Math.floor(Math.random() * statusOptions.length)],
      battery: Math.floor(Math.random() * 40) + 60
    });
  }
  return sensors;
}

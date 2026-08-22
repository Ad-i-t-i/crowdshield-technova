export function calculateRisk({ density, flowSpeed, blockedGates, vipSurge }) {
  // Step 1: Density Score (0–50 points)
  let score = Math.min(50, (density / 8) * 50);

  // Step 2: Flow Speed Penalty (slow = dangerous)
  if (flowSpeed < 0.5) score += 25;       // Crowd nearly stopped
  else if (flowSpeed < 1.0) score += 15;  // Slow — bottleneck forming
  else if (flowSpeed < 1.5) score += 8;

  // Step 3: Blocked Gate Multiplier
  score += blockedGates * 12;

  // Step 4: VIP Surge Spike
  if (vipSurge) score += 20;

  return Math.min(98, Math.round(score));
}

export function getRiskLevel(score) {
  if (score >= 90) return { label: '☠️ BREACH', color: '#EF4444', class: 'bg-red-950 text-red-400 border border-red-500/30' };
  if (score >= 75) return { label: '🚨 CRITICAL', color: '#FF8B94', class: 'bg-[#FF8B94]/10 text-[#FF8B94] border border-[#FF8B94]/30' };
  if (score >= 45) return { label: '⚠️ WARNING', color: '#FCD34D', class: 'bg-amber-950 text-amber-400 border border-amber-500/30' };
  return { label: '✅ SAFE', color: '#AEDCC0', class: 'bg-[#AEDCC0]/10 text-[#AEDCC0] border border-[#AEDCC0]/30' };
}

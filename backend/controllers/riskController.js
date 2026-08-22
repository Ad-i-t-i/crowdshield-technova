import { calculateRisk } from '../../src/utils/riskEngine.js';

export const getRiskScore = (req, res) => {
  const density = parseFloat(req.query.density || 3.4);
  const flowSpeed = parseFloat(req.query.flowSpeed || 1.1);
  const blockedGates = parseInt(req.query.blockedGates || 0, 10);
  const vipSurge = req.query.vipSurge === 'true';

  const riskScore = calculateRisk({ density, flowSpeed, blockedGates, vipSurge });

  res.json({
    success: true,
    data: {
      riskScore,
      factors: { density, flowSpeed, blockedGates, vipSurge },
      timestamp: new Date()
    }
  });
};

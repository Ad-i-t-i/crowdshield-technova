export async function fetchTelemetry(simulationState) {
  try {
    const params = new URLSearchParams({
      gateCBlocked: simulationState?.gateCBlocked || false,
      vipSurge: simulationState?.vipSurge || false,
      gateBRerouted: simulationState?.gateBRerouted || false,
      emergencyExit2Open: simulationState?.emergencyExit2Open || false,
    });
    const res = await fetch(`/api/telemetry?${params.toString()}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchTelemetry failed", err);
    return null;
  }
}

export async function fetchZones(simulationState) {
  try {
    const params = new URLSearchParams({
      gateCBlocked: simulationState?.gateCBlocked || false,
    });
    const res = await fetch(`/api/zones?${params.toString()}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchZones failed", err);
    return [];
  }
}

export async function fetchRiskScore(simulationState) {
  try {
    const params = new URLSearchParams({
      vipSurge: simulationState?.vipSurge || false,
    });
    const res = await fetch(`/api/risk?${params.toString()}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchRiskScore failed", err);
    return { riskScore: 28 };
  }
}

export async function fetchSensors() {
  try {
    const res = await fetch('/api/sensors');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchSensors failed", err);
    return [];
  }
}

export async function postAction(actionType, stateValue) {
  try {
    const res = await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType, stateValue })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("postAction failed", err);
    return { success: false, offline: true };
  }
}

export async function fetchAlerts() {
  try {
    const res = await fetch('/api/alerts');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchAlerts failed", err);
    return [];
  }
}

export async function acknowledgeAlertOnBackend(alertId) {
  try {
    const res = await fetch(`/api/alerts/${alertId}/acknowledge`, {
      method: 'PATCH',
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error("acknowledgeAlertOnBackend failed", err);
    return false;
  }
}

export async function submitIncident(incident) {
  try {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("submitIncident failed", err);
    return { success: false, offline: true };
  }
}

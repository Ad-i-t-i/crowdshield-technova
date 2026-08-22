// Telemetry Mongoose / Data Model
export const TelemetryModel = {
  schema: {
    density: Number,
    speed: Number,
    riskLevel: Number,
    headcount: Number,
    timestamp: Date
  }
};

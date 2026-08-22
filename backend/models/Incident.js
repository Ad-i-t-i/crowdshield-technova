// Incident Mongoose / Data Model
export const IncidentModel = {
  schema: {
    id: String,
    title: String,
    sector: String,
    details: String,
    timestamp: Date,
    status: String
  }
};

// Alert Mongoose / Data Model
export const AlertModel = {
  schema: {
    zone: String,
    severity: String,
    message: String,
    acknowledged: Boolean,
    timestamp: Date
  }
};

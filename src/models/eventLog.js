import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
  },
  occurredAt: {
    type: Date,
    default: Date.now,
  },
});

const EventLog = mongoose.model("EventLog", eventLogSchema);
export default EventLog;

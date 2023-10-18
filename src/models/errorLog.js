import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema({
  nameOfFunctionGeneratingTheError: {
    type: String,
    required: true,
  },

  errorObject: {
    type: Object,
  },
});

const ErrorLog = mongoose.model("ErrorLog", errorLogSchema);
export default ErrorLog;

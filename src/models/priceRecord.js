import mongoose from "mongoose";

const priceRecordSchema = new mongoose.Schema({
  complexName: {
    type: String,
  },
  unit: {
    type: String,
  },
  numberOfBedrooms: {
    type: Number,
  },
  numberOfBathrooms: {
    type: Number,
  },
  squareFeet: {
    type: Number,
  },
  price: {
    type: Number,
  },
  occurredAt: {
    type: Date,
    default: Date.now,
  },
});

priceRecordSchema.index({
  complexName: 1,
  unit: 1,
  numberOfBedrooms: 1,
  numberOfBathrooms: 1,
});

const PriceRecord = mongoose.model("PriceRecord", priceRecordSchema);
export default PriceRecord;

import mongoose from "mongoose";

const tokenCounterSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  count: {
    type: Number,
    required: true,
    default: 1
  }
}, { timestamps: true });

export default mongoose.model("TokenCounter", tokenCounterSchema);

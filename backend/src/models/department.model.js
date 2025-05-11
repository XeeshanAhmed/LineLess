import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },

  isDefault: {
    type: Boolean,
    default: false
  },
  averageProcessingTime: {
    type: Number,
    default: 0,
  }

}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
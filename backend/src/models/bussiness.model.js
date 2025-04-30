import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['business'],
    default: 'business'
  },

  hasDepartments: {
    type: Boolean,
    required: true
  },

  defaultDepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null
  }

}, { timestamps: true });

export default mongoose.model('Business', businessSchema);
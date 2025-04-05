import mongoose from 'mongoose';

const laborRequestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  workType: {
    type: String,
    enum: ['harvesting', 'planting', 'weeding', 'fertilizing', 'other'],
    required: true,
  },
  numberOfLabors: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  dailyWage: {
    type: Number,
    required: true,
  },
  location: {
    village: String,
    district: String,
    state: String,
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'completed', 'cancelled'],
    default: 'open',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.LaborRequest || mongoose.model('LaborRequest', laborRequestSchema);
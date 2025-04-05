import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  cropType: {
    type: String,
    required: true,
    enum: ['Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton', 'Other']
  },
  problemType: {
    type: String,
    required: true,
    enum: ['Pest', 'Weather', 'Disease', 'Soil', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  facingSameProblem: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  solutions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solution'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', communityPostSchema);

export default CommunityPost; 
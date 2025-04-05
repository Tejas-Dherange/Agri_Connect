import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'expert', 'admin'], default: 'farmer' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  farmSize: { type: Number },
  crops: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const pestReportSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pestType: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  images: [{ type: String }], // Cloudinary URLs
  voiceNote: { type: String }, // URL to voice recording
  status: { type: String, enum: ['reported', 'verified', 'resolved'], default: 'reported' },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const marketplaceItemSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['seeds', 'fertilizers', 'tools', 'other'], required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], // Cloudinary URLs
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const weatherAlertSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  alertType: { type: String, enum: ['rain', 'drought', 'storm', 'temperature'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for geospatial queries
userSchema.index({ location: '2dsphere' });
pestReportSchema.index({ location: '2dsphere' });
marketplaceItemSchema.index({ location: '2dsphere' });
weatherAlertSchema.index({ location: '2dsphere' });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const PestReport = mongoose.models.PestReport || mongoose.model('PestReport', pestReportSchema);
export const MarketplaceItem = mongoose.models.MarketplaceItem || mongoose.model('MarketplaceItem', marketplaceItemSchema);
export const WeatherAlert = mongoose.models.WeatherAlert || mongoose.model('WeatherAlert', weatherAlertSchema); 
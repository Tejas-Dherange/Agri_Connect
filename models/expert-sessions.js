import mongoose from 'mongoose';

const expertSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  village: {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    }
  },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  maxParticipants: { type: Number, required: true },
  topics: [{ type: String }],
  status: { 
    type: String, 
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: { type: Date, default: Date.now }
});

const sessionRegistrationSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpertSession', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['registered', 'attended', 'absent'],
    default: 'registered'
  },
  registrationDate: { type: Date, default: Date.now },
  reminderSent: { type: Boolean, default: false }
});

const quizSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpertSession', required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
  }],
  passingScore: { type: Number, required: true },
  rewardPoints: { type: Number, required: true }
});

const quizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionIndex: { type: Number, required: true },
    selectedAnswer: { type: Number, required: true }
  }],
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  rewardClaimed: { type: Boolean, default: false },
  completedAt: { type: Date, default: Date.now }
});

// Create indexes
expertSessionSchema.index({ 'village.location': '2dsphere' });
sessionRegistrationSchema.index({ sessionId: 1, farmerId: 1 }, { unique: true });
quizResultSchema.index({ quizId: 1, farmerId: 1 }, { unique: true });

export const ExpertSession = mongoose.models.ExpertSession || mongoose.model('ExpertSession', expertSessionSchema);
export const SessionRegistration = mongoose.models.SessionRegistration || mongoose.model('SessionRegistration', sessionRegistrationSchema);
export const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
export const QuizResult = mongoose.models.QuizResult || mongoose.model('QuizResult', quizResultSchema); 
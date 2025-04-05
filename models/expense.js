import mongoose from "mongoose"

const ExpenseSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  category: {
    type: String,
    enum: [
      'seeds',
      'fertilizers',
      'pesticides',
      'labor',
      'machinery',
      'transport',
      'irrigation',
      'land_rent',
      'crop_sales',
      'government_subsidies',
      'other'
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  receipt: {
    type: String, // URL to uploaded receipt image
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for efficient querying
ExpenseSchema.index({ farmer: 1, date: -1 })
ExpenseSchema.index({ farmer: 1, category: 1 })
ExpenseSchema.index({ farmer: 1, type: 1 })

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema) 
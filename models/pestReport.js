import mongoose from "mongoose"

const PestReportSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  cropType: {
    type: String,
    required: [true, "Please specify the crop type"],
  },
  images: [
    {
      type: String,
    },
  ],
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  status: {
    type: String,
    enum: ["pending", "in-review", "resolved"],
    default: "pending",
  },
  assignedExpert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  responses: [
    {
      expert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.PestReport || mongoose.model("PestReport", PestReportSchema)


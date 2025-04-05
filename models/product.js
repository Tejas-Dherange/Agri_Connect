import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a product name"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  category: {
    type: String,
    required: [true, "Please specify a category"],
  },
  price: {
    type: Number,
    required: [true, "Please specify a price"],
  },
  unit: {
    type: String,
    required: [true, "Please specify a unit (kg, ton, etc.)"],
  },
  quantity: {
    type: Number,
    required: [true, "Please specify available quantity"],
  },
  images: [
    {
      type: String,
    },
  ],
  location: {
    type: String,
    required: [true, "Please provide your location"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Product || mongoose.model("Product", ProductSchema)


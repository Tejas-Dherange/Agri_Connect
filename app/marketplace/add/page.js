"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProduct() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    unit: "kg",
    quantity: "",
    images: [],
    location: "",
  })
  const [previewUrls, setPreviewUrls] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    // Preview images
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls])

    // In a real app, you would upload these to Cloudinary
    // For this demo, we'll just store the File objects
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // In a real app, you would upload images to Cloudinary first
      // const imageUrls = await Promise.all(formData.images.map(uploadToCloudinary))

      // For demo purposes, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to marketplace
      router.push("/marketplace?success=Product added successfully")
    } catch (err) {
      console.error("Error adding product:", err)
      setError("Failed to add product. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-32"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Category</option>
              <option value="Grains">Grains</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Seeds">Seeds</option>
              <option value="Supplies">Supplies</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input"
              required
              placeholder="City, State"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="price" className="block text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-gray-700 mb-2">
              Unit
            </label>
            <select id="unit" name="unit" value={formData.unit} onChange={handleChange} className="input" required>
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="ton">Ton</option>
              <option value="piece">Piece</option>
              <option value="dozen">Dozen</option>
              <option value="bag">Bag</option>
              <option value="day">Day (for rentals)</option>
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-gray-700 mb-2">
              Quantity Available
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input"
              required
              min="1"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-gray-700 mb-2"
          />
          <p className="text-sm text-gray-500 mb-2">Upload clear images of your product. Max 5 images.</p>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  )
}


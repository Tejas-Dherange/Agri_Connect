"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Import Leaflet map component dynamically to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">Loading map...</div>,
})

export default function ReportPest() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cropType: "",
    images: [],
    location: {
      lat: null,
      lng: null,
      address: "",
    },
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

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location,
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

      // Redirect to success page
      router.push("/pest-alerts/success")
    } catch (err) {
      console.error("Error submitting pest report:", err)
      setError("Failed to submit pest report. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Report Pest Issue</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            required
            placeholder="Brief description of the issue"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cropType" className="block text-gray-700 mb-2">
            Crop Type
          </label>
          <input
            type="text"
            id="cropType"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            className="input"
            required
            placeholder="e.g., Rice, Wheat, Tomato"
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
            placeholder="Describe the pest issue in detail. Include when you first noticed it, symptoms, affected area, etc."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-gray-700 mb-2"
          />
          <p className="text-sm text-gray-500 mb-2">Upload clear images of the affected plants/crops. Max 5 images.</p>

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

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Location</label>
          <div className="h-64 mb-2">
            <MapComponent onLocationSelect={handleLocationSelect} />
          </div>
          <p className="text-sm text-gray-500">
            Click on the map to select your location or allow the app to use your current location.
          </p>

          {formData.location.address && (
            <div className="mt-2 p-2 bg-gray-100 rounded-md">
              <p className="text-sm">Selected location: {formData.location.address}</p>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Submitting Report..." : "Submit Report"}
        </button>
      </form>
    </div>
  )
}


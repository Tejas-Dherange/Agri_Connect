"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

// Dummy product data for demonstration
const dummyProducts = [
  {
    id: "1",
    name: "Organic Rice",
    description: "Premium quality organic rice grown without pesticides",
    category: "Grains",
    price: 45,
    unit: "kg",
    quantity: 500,
    images: ["/placeholder.svg?height=300&width=300"],
    location: "Punjab",
    seller: {
      id: "101",
      name: "Rajesh Kumar",
    },
  },
  {
    id: "2",
    name: "Fresh Tomatoes",
    description: "Freshly harvested tomatoes, perfect for salads and cooking",
    category: "Vegetables",
    price: 30,
    unit: "kg",
    quantity: 100,
    images: ["/placeholder.svg?height=300&width=300"],
    location: "Maharashtra",
    seller: {
      id: "102",
      name: "Priya Singh",
    },
  },
  {
    id: "3",
    name: "Wheat Seeds",
    description: "High-yield wheat seeds for the upcoming planting season",
    category: "Seeds",
    price: 120,
    unit: "kg",
    quantity: 200,
    images: ["/placeholder.svg?height=300&width=300"],
    location: "Haryana",
    seller: {
      id: "103",
      name: "Amit Patel",
    },
  },
  {
    id: "4",
    name: "Organic Fertilizer",
    description: "Natural fertilizer made from composted plant materials",
    category: "Supplies",
    price: 500,
    unit: "bag",
    quantity: 50,
    images: ["/placeholder.svg?height=300&width=300"],
    location: "Gujarat",
    seller: {
      id: "104",
      name: "Sanjay Verma",
    },
  },
  {
    id: "5",
    name: "Mango (Alphonso)",
    description: "Premium Alphonso mangoes, sweet and aromatic",
    category: "Fruits",
    price: 400,
    unit: "dozen",
    quantity: 30,
    images: ["/placeholder.svg?height=300&width=300"],
    location: "Karnataka",
    seller: {
      id: "105",
      name: "Lakshmi Rao",
    },
  },
  {
    id: "6",
    name: "Tractor (Rental)",
    description: "Tractor available for rent on daily or weekly basis",
    category: "Equipment",
    price: 1500,
    unit: "day",
    quantity: 1,
    images: ["/placeholder.svg?height=300&width=300"],
    location: "Uttar Pradesh",
    seller: {
      id: "106",
      name: "Vikram Singh",
    },
  },
]

export default function Marketplace() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: "",
    search: "",
  })

  useEffect(() => {
    // Simulate API call to fetch products
    setTimeout(() => {
      setProducts(dummyProducts)
      setIsLoading(false)
    }, 1000)

    // In a real app, you would fetch from your API
    // const fetchProducts = async () => {
    //   try {
    //     const response = await fetch('/api/products')
    //     const data = await response.json()
    //     setProducts(data)
    //   } catch (error) {
    //     console.error('Error fetching products:', error)
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }
    //
    // fetchProducts()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = filter.category === "" || product.category === filter.category
    const matchesSearch =
      filter.search === "" ||
      product.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filter.search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Get unique categories for filter
  const categories = [...new Set(products.map((product) => product.category))]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agricultural Marketplace</h1>
        <Link href="/marketplace/add" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Search products..."
              className="input"
            />
          </div>

          <div className="w-full md:w-48">
            <select name="category" value={filter.category} onChange={handleFilterChange} className="input">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-600 font-bold">
                    ₹{product.price}/{product.unit}
                  </span>
                  <span className="text-sm text-gray-500">{product.quantity} available</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Location: {product.location}</span>
                  <span>Seller: {product.seller.name}</span>
                </div>
                <Link href={`/marketplace/${product.id}`} className="btn btn-primary w-full">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


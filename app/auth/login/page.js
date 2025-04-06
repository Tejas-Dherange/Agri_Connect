"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Use a more direct approach to authentication
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard/farmer" // Default redirect for farmers
      })
      
      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      // Successful login - redirect based on result
      if (result?.url) {
        router.push(result.url)
      } else {
        // Fallback to fetching user data
        try {
          const response = await fetch("/api/user/me")
          const userData = await response.json()

          if (userData.role === "farmer") {
            router.push("/dashboard/farmer")
          } else if (userData.role === "expert") {
            router.push("/dashboard/expert")
          } else {
            router.push("/")
          }
        } catch (fetchError) {
          console.error("Error fetching user data:", fetchError)
          // Default to farmer dashboard if we can't determine the role
          router.push("/dashboard/farmer")
        }
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to AgriConnect</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-green-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


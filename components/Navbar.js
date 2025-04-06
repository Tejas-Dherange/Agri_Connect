"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isAuthenticated = status === "authenticated"
  const userRole = session?.user?.role || "guest"

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            SmartShetKari
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-green-200">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link href={`/dashboard/${userRole}`} className="hover:text-green-200">
                  Dashboard
                </Link>
                <Link href="/product-identifier" className="hover:text-green-200">
                  Search Pesticide
                </Link>
                <Link href="/pest-alerts" className="hover:text-green-200">
                  Pest Alerts
                </Link>
                <Link href="/expert-sessions" className="hover:text-green-200">
                  Expert Sessions
                </Link>
                <Link href="/weather" className="hover:text-green-200">
                  Weather & Prices
                </Link>
                <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-green-200">
                  Login
                </Link>
                <Link href="/auth/signup" className="hover:text-green-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block hover:text-green-200 py-2">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link href={`/dashboard/${userRole}`} className="block hover:text-green-200 py-2">
                  Dashboard
                </Link>
                <Link href="/marketplace" className="block hover:text-green-200 py-2">
                  Marketplace
                </Link>
                <Link href="/pest-alerts" className="block hover:text-green-200 py-2">
                  Pest Alerts
                </Link>
                <Link href="/expert-sessions" className="block hover:text-green-200 py-2">
                  Expert Sessions
                </Link>
                <Link href="/weather" className="block hover:text-green-200 py-2">
                  Weather & Prices
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block hover:text-green-200 py-2">
                  Login
                </Link>
                <Link href="/auth/signup" className="block hover:text-green-200 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}


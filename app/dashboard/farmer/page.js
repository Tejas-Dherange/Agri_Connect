"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

export default function FarmerDashboard() {
  const { data: session } = useSession()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-green-50">
          <h2 className="text-xl font-semibold mb-3">Pest Alerts</h2>
          <p className="mb-4">Report pest issues and get expert advice.</p>
          <Link href="/pest-alerts/report" className="btn btn-primary">
            Report Pest Issue
          </Link>
        </div>

        <div className="card bg-blue-50">
          <h2 className="text-xl font-semibold mb-3">Chat with Expert</h2>
          <p className="mb-4">Get advice from agricultural experts.</p>
          <Link href="/dashboard/farmer/chat" className="btn btn-primary">
            Start Chat
          </Link>
        </div>

        <div className="card bg-yellow-50">
          <h2 className="text-xl font-semibold mb-3">Marketplace</h2>
          <p className="mb-4">Buy and sell agricultural products.</p>
          <Link href="/marketplace" className="btn btn-primary">
            Visit Marketplace
          </Link>
        </div>

        <div className="card bg-purple-50">
          <h2 className="text-xl font-semibold mb-3">Weather & Prices</h2>
          <p className="mb-4">Check weather forecasts and market prices.</p>
          <Link href="/weather" className="btn btn-primary">
            View Forecasts
          </Link>
        </div>

        <div className="card bg-red-50">
          <h2 className="text-xl font-semibold mb-3">My Products</h2>
          <p className="mb-4">Manage your products in the marketplace.</p>
          <Link href="/dashboard/farmer/products" className="btn btn-primary">
            Manage Products
          </Link>
        </div>

        <div className="card bg-teal-50">
          <h2 className="text-xl font-semibold mb-3">Community Forum</h2>
          <p className="mb-4">Connect with other farmers and share experiences.</p>
          <Link href="/dashboard/farmer/community" className="btn btn-primary">
            Join Community
          </Link>
        </div>

        <div className="card bg-indigo-50">
          <h2 className="text-xl font-semibold mb-3">My Crops</h2>
          <p className="mb-4">Track and manage your crops.</p>
          <Link href="/dashboard/farmer/crops" className="btn btn-primary">
            View Crops
          </Link>
        </div>

        <div className="card bg-orange-50">
          <h2 className="text-xl font-semibold mb-3">Expenses</h2>
          <p className="mb-4">Track your income and expenses.</p>
          <Link href="/dashboard/farmer/expenses" className="btn btn-primary">
            Manage Expenses
          </Link>
        </div>
        <div className="card bg-orange-50">
          <h2 className="text-xl font-semibold mb-3">Crop Recomendation</h2>
          <p className="mb-4">Get crop recomendation</p>
          <Link href="/dashboard/farmer/crop-recommendation" className="btn btn-primary">
             Recomendation
          </Link>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

export default function ExpertDashboard() {
  const { data: session } = useSession()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-green-50">
          <h2 className="text-xl font-semibold mb-3">Pest Reports</h2>
          <p className="mb-4">Review and respond to pest reports from farmers.</p>
          <Link href="/dashboard/expert/pest-reports" className="btn btn-primary">
            View Reports
          </Link>
        </div>

        <div className="card bg-blue-50">
          <h2 className="text-xl font-semibold mb-3">Farmer Queries</h2>
          <p className="mb-4">Respond to questions from farmers.</p>
          <Link href="/dashboard/expert/queries" className="btn btn-primary">
            View Queries
          </Link>
        </div>

        <div className="card bg-yellow-50">
          <h2 className="text-xl font-semibold mb-3">Knowledge Base</h2>
          <p className="mb-4">Contribute to the agricultural knowledge base.</p>
          <Link href="/dashboard/expert/knowledge" className="btn btn-primary">
            View Knowledge Base
          </Link>
        </div>
      </div>
    </div>
  )
}


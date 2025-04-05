"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role || "guest"

  const farmerLinks = [
    { name: "Overview", href: "/dashboard/farmer" },
    { name: "Chat with Expert", href: "/dashboard/farmer/chat" },
    { name: "My Crops", href: "/dashboard/farmer/crops" },
    { name: "Report Pest", href: "/pest-alerts/report" },
    { name: "My Products", href: "/dashboard/farmer/products" },
    { name: "Weather & Prices", href: "/weather" },
    { name: "Crop Recommendation", href: "/crop-recommendation" },
  ]

  const expertLinks = [
    { name: "Overview", href: "/dashboard/expert" },
    { name: "Pest Reports", href: "/dashboard/expert/pest-reports" },
    { name: "Farmer Queries", href: "/dashboard/expert/queries" },
    { name: "Knowledge Base", href: "/dashboard/expert/knowledge" },
    { name: "Crop Recommendation", href: "/crop-recommendation" },
  ]

  const links = userRole === "farmer" ? farmerLinks : expertLinks

  return (
    <div className="bg-gray-100 w-64 min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-700 capitalize">{userRole} Dashboard</h2>
      </div>

      <nav>
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href

            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`block px-4 py-2 rounded-md ${
                    isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}


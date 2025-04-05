import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to AgriConnect</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Connecting farmers with agricultural experts to improve crop yields, manage pests, and access market
        information.
      </p>
      <div className="flex gap-4">
        <Link href="/auth/login" className="btn btn-primary">
          Login
        </Link>
        <Link href="/auth/signup" className="btn btn-secondary">
          Sign Up
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Pest Management</h2>
          <p>Report pest issues and get expert advice on how to manage them effectively.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Marketplace</h2>
          <p>Buy and sell agricultural products directly with other farmers and suppliers.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Weather & Market Prices</h2>
          <p>Access real-time weather forecasts and current market prices for your crops.</p>
        </div>
      </div>
    </div>
  )
}


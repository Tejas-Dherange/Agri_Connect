'use client';

import Link from "next/link"
import Image from "next/image"
import { useState } from "react";

export default function Home() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative bg-gradient-to-b from-green-50 to-white">
      {/* Sticky Background Image Section */}
      <div className="sticky top-0 h-[50vh] w-full z-0">
        <div className="relative w-full h-full">
          <Image
            src={imageError ? "/placeholder.jpg" : "/farmer-using-smartphone.jpg"}
            alt="Farmer using smartphone in field"
            fill
            className="object-cover brightness-90"
            priority
            quality={100}
            onError={() => setImageError(true)}
          />
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 via-green-900/30 to-green-50/90"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black-400 drop-shadow-lg">
            Welcome to SmartShetkari
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-black-300 drop-shadow">
            Connecting farmers with agricultural experts to improve crop yields, manage pests, and access market
            information.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/auth/login" 
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Login
            </Link>
            <Link 
              href="/auth/signup" 
              className="px-8 py-3 bg-white hover:bg-green-50 text-green-700 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg border-2 border-green-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


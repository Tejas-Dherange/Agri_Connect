'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Cloud, ShoppingCart, Bug } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Lazy load Spline
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center bg-green-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
        <p className="text-green-800 font-medium">Loading 3D farm visualization...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [activeSpot, setActiveSpot] = useState(null);

  const infoSpots = {
    crops: "🌱 Smart crop monitoring using real-time soil, sunlight & nutrients data.",
    livestock: "🐄 Livestock tracking, feeding alerts & health monitoring system.",
    weather: "🌦️ Hyperlocal weather forecasts for precision agriculture planning."
  };

  const onSplineLoad = (splineApp) => {
    setSplineLoaded(true);
    console.log("Spline scene loaded");
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="w-full max-w-7xl px-4 py-12">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-extrabold text-green-800 mb-4">
            Welcome to <span className="text-green-600">AgriConnect</span>
          </h1>
          <p className="text-lg text-gray-700">
            Your digital companion for smarter, sustainable farming 🚜
          </p>
        </motion.div>

        {/* 3D Visualization */}
        <div className="relative w-full mb-12">
          <div className="h-96 md:h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden">
            <Spline
              scene="https://prod.spline.design/Z2GLiZlO92GCEF1H/scene.splinecode"
              onLoad={onSplineLoad}
            />
          </div>

          {/* Hotspots */}
          {splineLoaded && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative h-full w-full">
                {['crops', 'livestock', 'weather'].map((type, idx) => {
                  const positions = [
                    { top: 'top-1/4', left: 'left-1/4' },
                    { top: 'top-1/3', right: 'right-1/4' },
                    { bottom: 'bottom-1/4', right: 'right-1/3' },
                  ];

                  return (
                    <button
                      key={type}
                      className={`absolute ${positions[idx].top || ''} ${positions[idx].bottom || ''} ${positions[idx].left || ''} ${positions[idx].right || ''} transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md pointer-events-auto hover:bg-green-700 transition-all duration-200 z-10`}
                      onClick={() => setActiveSpot(type)}
                    >
                      <span>{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tooltip */}
          {activeSpot && (
            <motion.div
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-md text-center z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-800 font-medium">{infoSpots[activeSpot]}</p>
              <button
                className="mt-2 text-green-600 text-sm underline"
                onClick={() => setActiveSpot(null)}
              >
                Close
              </button>
            </motion.div>
          )}
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link href="/chat">
            <button className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md">
              Talk to Expert
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
          <Link href="/explore">
            <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-semibold border border-green-600 rounded-lg hover:bg-green-50 transition-all shadow-md">
              Explore Features
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-white py-20 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-14">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Pest Management',
                icon: <Bug className="h-6 w-6 text-green-600" />,
                desc: 'Report pest issues and get expert advice to manage them.',
                link: '/services/pest-management',
                linkText: 'Learn more'
              },
              {
                title: 'Marketplace',
                icon: <ShoppingCart className="h-6 w-6 text-green-600" />,
                desc: 'Buy/sell agricultural products with verified sources.',
                link: '/marketplace',
                linkText: 'Visit marketplace'
              },
              {
                title: 'Weather & Market Prices',
                icon: <Cloud className="h-6 w-6 text-green-600" />,
                desc: 'Stay informed with real-time forecasts and crop prices.',
                link: '/weather-market',
                linkText: 'Check forecasts'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
                {/* <Link href={feature.link} className="mt-4 text-green-600 font-medium inline-flex items-center">
                  {feature.linkText} <ArrowRight className="ml-1 h-4 w-4" />
                </Link> */}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

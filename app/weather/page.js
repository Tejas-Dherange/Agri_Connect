"use client"

import { useState, useEffect } from "react"

// Dummy weather data for demonstration
const dummyWeatherData = {
  current: {
    temp: 28,
    humidity: 65,
    wind_speed: 12,
    weather: [{ main: "Clouds", description: "scattered clouds", icon: "03d" }],
  },
  daily: [
    {
      dt: Date.now() / 1000,
      temp: { min: 24, max: 30 },
      weather: [{ main: "Clouds", description: "scattered clouds", icon: "03d" }],
    },
    {
      dt: Date.now() / 1000 + 86400,
      temp: { min: 25, max: 32 },
      weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
    },
    {
      dt: Date.now() / 1000 + 172800,
      temp: { min: 26, max: 33 },
      weather: [{ main: "Rain", description: "light rain", icon: "10d" }],
    },
    {
      dt: Date.now() / 1000 + 259200,
      temp: { min: 25, max: 31 },
      weather: [{ main: "Rain", description: "moderate rain", icon: "10d" }],
    },
    {
      dt: Date.now() / 1000 + 345600,
      temp: { min: 24, max: 29 },
      weather: [{ main: "Clouds", description: "broken clouds", icon: "04d" }],
    },
  ],
}

// Dummy market price data for demonstration
const dummyMarketPrices = [
  { id: 1, crop: "Rice", variety: "Basmati", price: 45, unit: "kg", change: 2.5 },
  { id: 2, crop: "Wheat", variety: "Durum", price: 30, unit: "kg", change: -1.2 },
  { id: 3, crop: "Tomato", variety: "Roma", price: 25, unit: "kg", change: 5.0 },
  { id: 4, crop: "Potato", variety: "Russet", price: 18, unit: "kg", change: 0.5 },
  { id: 5, crop: "Onion", variety: "Red", price: 22, unit: "kg", change: -3.0 },
  { id: 6, crop: "Soybean", variety: "Yellow", price: 38, unit: "kg", change: 1.8 },
  { id: 7, crop: "Cotton", variety: "Long-staple", price: 65, unit: "kg", change: 4.2 },
  { id: 8, crop: "Sugarcane", variety: "Standard", price: 3.5, unit: "kg", change: -0.2 },
]

export default function WeatherAndPrices() {
  const [location, setLocation] = useState("Delhi, India")
  const [weatherData, setWeatherData] = useState(null)
  const [marketPrices, setMarketPrices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setWeatherData(dummyWeatherData)
      setMarketPrices(dummyMarketPrices)
      setIsLoading(false)
    }, 1500)

    // In a real app, you would fetch from OpenWeatherMap API
    // const fetchWeather = async () => {
    //   try {
    //     const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
    //     const data = await response.json()
    //     setWeatherData(data)
    //   } catch (error) {
    //     console.error('Error fetching weather data:', error)
    //   }
    // }
    //
    // const fetchMarketPrices = async () => {
    //   try {
    //     const response = await fetch('/api/market-prices')
    //     const data = await response.json()
    //     setMarketPrices(data)
    //   } catch (error) {
    //     console.error('Error fetching market prices:', error)
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }
    //
    // fetchWeather()
    // fetchMarketPrices()
  }, [location])

  const handleLocationChange = (e) => {
    setLocation(e.target.value)
  }

  const handleLocationSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // This would trigger the useEffect to fetch new data
  }

  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Weather & Market Prices</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>

            <form onSubmit={handleLocationSubmit} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={handleLocationChange}
                  placeholder="Enter location"
                  className="input flex-1"
                />
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>

            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-md mb-4"></div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-md"></div>
                  ))}
                </div>
              </div>
            ) : weatherData ? (
              <>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{location}</h3>
                      <p className="text-3xl font-bold">{weatherData.current.temp}°C</p>
                      <p className="text-gray-600">{weatherData.current.weather[0].description}</p>
                    </div>
                    <div>
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
                        alt={weatherData.current.weather[0].description}
                        width={80}
                        height={80}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>Humidity: {weatherData.current.humidity}%</div>
                    <div>Wind: {weatherData.current.wind_speed} km/h</div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {weatherData.daily.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-medium">{formatDate(day.dt)}</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                        alt={day.weather[0].description}
                        className="mx-auto"
                        width={40}
                        height={40}
                      />
                      <p className="text-xs">{day.weather[0].main}</p>
                      <p className="text-sm">
                        <span className="font-medium">{Math.round(day.temp.max)}°</span> / {Math.round(day.temp.min)}°
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Failed to load weather data</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Agricultural Advisory</h2>
            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-yellow-800 mb-2">Current Advisory</h3>
              <p>
                Based on the weather forecast, consider delaying irrigation for the next 48 hours due to expected
                rainfall. Ensure proper drainage in low-lying areas to prevent waterlogging.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Seasonal Recommendations</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Ideal time for sowing wheat in northern regions</li>
                <li>Apply preventive fungicide to protect crops from increased humidity</li>
                <li>Monitor for increased pest activity due to rising temperatures</li>
                <li>Consider harvesting mature crops before the expected rainfall</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Market Prices Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current Market Prices</h2>

          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          ) : marketPrices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Crop</th>
                    <th className="px-4 py-2 text-left">Variety</th>
                    <th className="px-4 py-2 text-right">Price (₹)</th>
                    <th className="px-4 py-2 text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {marketPrices.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-3">{item.crop}</td>
                      <td className="px-4 py-3 text-gray-600">{item.variety}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        ₹{item.price}/{item.unit}
                      </td>
                      <td
                        className={`px-4 py-3 text-right ${
                          item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Failed to load market prices</p>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-2">Market Trends</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>Rice prices are trending upward due to reduced supply from major producing regions.</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span>Wheat prices have decreased slightly due to increased imports.</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>Vegetable prices are rising due to seasonal factors and transportation costs.</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span>Cotton prices remain stable with minor fluctuations based on export demand.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Price Forecast</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm mb-2">
                Based on current trends and seasonal patterns, the following price movements are expected:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Rice prices expected to increase by 5-8% in the next month</li>
                <li>Wheat prices likely to stabilize after recent decline</li>
                <li>Vegetable prices expected to normalize after the monsoon season</li>
                <li>Pulses may see price increases due to reduced production estimates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"

export default function WeatherAndPrices() {
  const [location, setLocation] = useState("Delhi, India")
  const [weatherData, setWeatherData] = useState(null)
  const [marketPrices, setMarketPrices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch weather data
        const weatherRes = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city: location }),
        })
        const weatherJson = await weatherRes.json()
        setWeatherData(weatherJson.weatherData)

        // TODO: Replace with real API when ready
        const dummyPrices = [
          { id: 1, crop: "Rice", variety: "Basmati", price: 45, unit: "kg", change: 2.5 },
          { id: 2, crop: "Wheat", variety: "Durum", price: 30, unit: "kg", change: -1.2 },
          { id: 3, crop: "Tomato", variety: "Roma", price: 25, unit: "kg", change: 5.0 },
          { id: 4, crop: "Potato", variety: "Russet", price: 18, unit: "kg", change: 0.5 },
          { id: 5, crop: "Onion", variety: "Red", price: 22, unit: "kg", change: -3.0 },
          { id: 6, crop: "Soybean", variety: "Yellow", price: 38, unit: "kg", change: 1.8 },
          { id: 7, crop: "Cotton", variety: "Long-staple", price: 65, unit: "kg", change: 4.2 },
          { id: 8, crop: "Sugarcane", variety: "Standard", price: 3.5, unit: "kg", change: -0.2 },
        ]
        setMarketPrices(dummyPrices)
      } catch (err) {
        console.error("Error loading data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [location])

  const handleLocationChange = (e) => {
    setLocation(e.target.value)
  }

  const handleLocationSubmit = (e) => {
    e.preventDefault()
  }

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
                  className="input flex-1 border px-3 py-2 rounded"
                />
                <button type="submit" className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded">
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
                      <p className="text-3xl font-bold">{weatherData?.current?.temp_c}°C</p>
                      <p className="text-gray-600">{weatherData?.current?.condition?.text}</p>
                    </div>
                    <div>
                      <img
                        src={weatherData?.current?.condition?.icon}
                        alt={weatherData?.current?.condition?.text}
                        width={80}
                        height={80}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>Humidity: {weatherData?.current?.humidity}%</div>
                    <div>Wind: {weatherData?.current?.wind_kph} km/h</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {weatherData?.forecast?.forecastday.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-medium text-lg">{formatDate(new Date(day.date).getTime() / 1000)}</p>
                      {/* <img
                      src={day?.day?.condition?.icon}
                        alt={day?.day?.condition?.text}
                        className="mx-auto"
                        width={40}
                        height={40}
                      /> */}
                      <p className="text-sm">{day?.day?.condition?.text}</p>
                      <p className="text-sm">
                        <span className="font-medium">{Math.round(day?.day?.maxtemp_c)}°</span> /{" "}
                        {Math.round(day?.day?.mintemp_c)}°
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
        </div>
      </div>
    </div>
  )
}

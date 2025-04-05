"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null)

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)

      // Reverse geocode to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then((res) => res.json())
        .then((data) => {
          onLocationSelect({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            address: data.display_name || "Unknown location",
          })
        })
        .catch((err) => {
          console.error("Error getting location address:", err)
          onLocationSelect({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            address: "Location selected (address unavailable)",
          })
        })
    },
  })

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition({ lat: latitude, lng: longitude })
          map.flyTo([latitude, longitude], 13)

          // Reverse geocode to get address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              onLocationSelect({
                lat: latitude,
                lng: longitude,
                address: data.display_name || "Your current location",
              })
            })
            .catch((err) => {
              console.error("Error getting location address:", err)
              onLocationSelect({
                lat: latitude,
                lng: longitude,
                address: "Your current location (address unavailable)",
              })
            })
        },
        (error) => {
          console.error("Error getting current location:", error)
        },
      )
    }
  }, [map, onLocationSelect])

  return position === null ? null : <Marker position={position} />
}

export default function MapComponent({ onLocationSelect }) {
  // Default center (can be anywhere, will be overridden by user location)
  const defaultCenter = [20.5937, 78.9629] // Center of India

  return (
    <MapContainer center={defaultCenter} zoom={5} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
    </MapContainer>
  )
}


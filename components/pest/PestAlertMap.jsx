'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const severityColors = {
  low: 'green',
  medium: 'orange',
  high: 'red'
};

export default function PestAlertMap({ initialCenter = [20.5937, 78.9629], initialZoom = 5 }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/pest-reports');
        const data = await response.json();
        if (data.success) {
          setReports(data.data);
        }
      } catch (error) {
        console.error('Error fetching pest reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="h-[500px] flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <Marker
            key={report._id}
            position={[report.location.coordinates[1], report.location.coordinates[0]]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: ${severityColors[report.severity]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{report.pestType}</h3>
                <p className="text-sm">{report.description}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    report.severity === 'high' ? 'bg-red-100 text-red-800' :
                    report.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.severity} severity
                  </span>
                </div>
                {report.images && report.images.length > 0 && (
                  <div className="mt-2">
                    <img
                      src={report.images[0]}
                      alt="Pest"
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Reported by: {report.farmerId?.name || 'Anonymous'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 
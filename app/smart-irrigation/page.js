'use client';

import { useState } from 'react';

export default function IrrigationAdvisor() {
  const [city, setCity] = useState('');
  const [cropType, setCropType] = useState('');
  const [soilColor, setSoilColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation('');
    setError('');

    try {
      const res = await fetch('/api/smart-irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, cropType, soilColor }),
      });

      const data = await res.json();

      if (res.ok) {
        setRecommendation(data.recommendation);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">🌾 Irrigation Advisor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="City (e.g., Daund)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Crop Type (e.g., Cotton)"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Soil Color (optional)"
          value={soilColor}
          onChange={(e) => setSoilColor(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Analyzing...' : 'Get Irrigation Advice'}
        </button>
      </form>

      {recommendation && (
        <div className="mt-6 p-4 bg-green-100 rounded border border-green-400 whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">💧 Recommendation:</h2>
          {recommendation}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 rounded border border-red-400 text-red-700">
          ❌ {error}
        </div>
      )}
    </div>
  );
}

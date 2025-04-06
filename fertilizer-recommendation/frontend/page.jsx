'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function FertilizerRecommendationPage() {
  const [formData, setFormData] = useState({ N: '', P: '', K: '' });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const N = parseFloat(formData.N);
      const P = parseFloat(formData.P);
      const K = parseFloat(formData.K);

      if (isNaN(N) || isNaN(P) || isNaN(K)) {
        throw new Error('Please enter valid numbers for all fields');
      }

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ N, P, K }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendation');
      }

      const data = await response.json();
      setRecommendation(data.fertilizer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-200 via-lime-100 to-white py-12 px-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-[0_10px_30px_rgba(0,128,0,0.2)] border border-green-300 rounded-3xl bg-white/80 backdrop-blur-md">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-5xl font-extrabold text-green-800 tracking-tight">
            🌾 Fertilizer Finder
          </CardTitle>
          <CardDescription className="text-base text-green-700">
            Get the perfect fertilizer based on your soil's nutrient profile 🌱
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['N', 'P', 'K'].map((nutrient) => (
                <div key={nutrient}>
                  <Label htmlFor={nutrient} className="text-green-900 text-sm font-semibold">
                    {nutrient === 'N' && '🌿 Nitrogen (N)'}
                    {nutrient === 'P' && '🌼 Phosphorous (P)'}
                    {nutrient === 'K' && '🍂 Potassium (K)'}
                  </Label>
                  <Input
                    id={nutrient}
                    name={nutrient}
                    type="number"
                    placeholder={`Enter ${nutrient}`}
                    value={formData[nutrient]}
                    onChange={handleInputChange}
                    className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm rounded-xl px-3 py-2"
                    required
                  />
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-2 rounded-xl transition duration-300 shadow-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Getting Recommendation...
                </>
              ) : (
                '✨ Get Your Recommendation'
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6 flex items-center gap-3 p-4 rounded-xl">
              <AlertCircle className="text-red-600 w-6 h-6" />
              <div>
                <AlertTitle className="text-red-700 font-semibold">Error</AlertTitle>
                <AlertDescription className="text-red-600 text-sm">{error}</AlertDescription>
              </div>
            </Alert>
          )}

          {recommendation && (
            <Alert className="mt-6 bg-green-50 border border-green-300 flex items-start gap-3 p-5 rounded-xl shadow-sm">
              <CheckCircle className="text-green-700 w-6 h-6 mt-1" />
              <div>
                <AlertTitle className="text-green-800 text-lg font-bold">
                  🌱 Recommended Fertilizer
                </AlertTitle>
                <AlertDescription className="text-green-700 mt-2">
                  Based on your soil nutrients, we suggest:
                  <div className="mt-3 p-3 text-lg font-bold text-green-900 bg-white border border-green-200 rounded-lg text-center shadow-inner">
                    {recommendation}
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// ...rest of your component


export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    nitrogen: 0,
    phosphorous: 0,
    potassium: 0,
    temperature: 0,
    humidity: 0,
    ph: 0,
    rainfall: 0,
  });

  const [recommendation, setRecommendation] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [visualizationType, setVisualizationType] = useState('radar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validationRanges = {
    nitrogen: { min: 0, max: 140 },
    phosphorous: { min: 5, max: 145 },
    potassium: { min: 5, max: 205 },
    temperature: { min: 8, max: 45 },
    humidity: { min: 15, max: 100 },
    ph: { min: 3.5, max: 9.5 },
    rainfall: { min: 20, max: 300 },
  };

  const colorLegend = [
    { name: "Low", color: "#ef4444" },
    { name: "Medium", color: "#22c55e" },
    { name: "High", color: "#3b82f6" },
  ];

  const getColor = (value) => {
    if (value < 30) return "#ef4444";
    if (value < 70) return "#22c55e";
    return "#3b82f6";
  };

  const chartData = [
    { subject: "N", value: Number(formData.nitrogen) },
    { subject: "P", value: Number(formData.phosphorous) },
    { subject: "K", value: Number(formData.potassium) },
    { subject: "Temp", value: Number(formData.temperature) },
    { subject: "Humidity", value: Number(formData.humidity) },
    { subject: "pH", value: Number(formData.ph) },
    { subject: "Rain", value: Number(formData.rainfall) },
  ];

  const barChartData = chartData.map(item => ({
    name: item.subject,
    value: item.value,
    color: getColor(item.value),
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setRecommendation(null); // clear old recommendation
  };

  const validateForm = () => {
    const errors = {};
    for (const key in formData) {
      const val = parseFloat(formData[key]);
      const { min, max } = validationRanges[key];
      if (isNaN(val) || val < min || val > max) {
        errors[key] = `Value should be between ${min} and ${max}`;
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setRecommendation(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setRecommendation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasData = Object.values(formData).some(val => parseFloat(val) > 0);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="form">
            <TabsList className="mb-4">
              <TabsTrigger value="form">Input Form</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["nitrogen", "phosphorous", "potassium", "temperature", "humidity", "ph", "rainfall"].map(field => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="capitalize">
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} 
                        <span className="text-xs text-gray-500 ml-1">
                          {field === "ph" ? "" : field === "temperature" ? "°C" : field === "humidity" ? "%" : "kg/ha"}
                        </span>
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        type="number"
                        step="0.1"
                        min={validationRanges[field].min}
                        max={validationRanges[field].max}
                        value={formData[field]}
                        onChange={handleInputChange}
                        required
                        className={validationErrors[field] ? "border-red-500" : ""}
                      />
                      {validationErrors[field] && (
                        <p className="text-xs text-red-500">{validationErrors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Recommendation...
                    </>
                  ) : (
                    "Get Recommendation"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="visualization">
              <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                      visualizationType === 'radar' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setVisualizationType('radar')}
                  >
                    Radar Chart
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                      visualizationType === 'bar' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setVisualizationType('bar')}
                  >
                    Bar Chart
                  </button>
                </div>
              </div>

              <div className="h-[500px] w-full">
                {!hasData ? (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-center p-4">
                      No data to display. Please enter values in the form.
                    </p>
                  </div>
                ) : visualizationType === 'radar' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value">
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-md font-semibold mb-2">Color Legend</h4>
                <div className="flex flex-wrap gap-4">
                  {colorLegend.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recommendation && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Recommended Crop:</h3>
              <p className="text-green-700">{recommendation.message || "No recommendation found"}</p>
              <p className="text-sm text-gray-600 mt-2">Confidence: {(recommendation.confidence * 100).toFixed(1)}%</p>

              {recommendation.alternatives && recommendation.alternatives.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-green-800">Alternative Crops:</h4>
                  <ul className="list-disc pl-5 mt-2">
                    {recommendation.alternatives.map((crop, index) => (
                      <li key={index} className="text-green-700">{crop}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CropRecommendation {
  nitrogen: string | number;
  phosphorous: string | number;
  potassium: string | number;
  temperature: string | number;
  humidity: string | number;
  ph: string | number;
  rainfall: string | number;
}

interface RecommendationResponse {
  crop: string;
  confidence: number;
  message: string;
  parameters: CropRecommendation;
  alternatives?: string[];
}

// Define validation ranges for each parameter
const validationRanges = {
  nitrogen: { min: 0, max: 140, unit: 'kg/ha' },
  phosphorous: { min: 0, max: 140, unit: 'kg/ha' },
  potassium: { min: 0, max: 200, unit: 'kg/ha' },
  temperature: { min: 0, max: 50, unit: '°C' },
  humidity: { min: 0, max: 100, unit: '%' },
  ph: { min: 0, max: 14, unit: '' },
  rainfall: { min: 0, max: 300, unit: 'mm' },
};

export default function CropRecommendationPage() {
  // Initialize with empty strings instead of 0 to avoid NaN issues
  const [formData, setFormData] = useState<CropRecommendation>({
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('form');
  const [colorLegend, setColorLegend] = useState<{name: string, color: string}[]>([]);
  const [hasData, setHasData] = useState<boolean>(false);
  const [visualizationType, setVisualizationType] = useState<string>('radar');

  // Update chart data when form data changes
  useEffect(() => {
    // Create color legend
    const legend = [
      { name: 'Low (0-30)', color: '#3b82f6' }, // Blue
      { name: 'Medium (31-70)', color: '#22c55e' }, // Green
      { name: 'High (71-100)', color: '#ef4444' }, // Red
    ];
    setColorLegend(legend);

    // Check if any form data has values
    const hasAnyData = Object.values(formData).some(value => value !== '');
    setHasData(hasAnyData);

    // Create chart data with color coding
    const newChartData = [
      { 
        subject: 'Nitrogen (N)', 
        value: formData.nitrogen === '' ? 0 : parseFloat(formData.nitrogen as string),
        fullMark: 100,
        color: getColorForValue(formData.nitrogen === '' ? 0 : parseFloat(formData.nitrogen as string))
      },
      { 
        subject: 'Phosphorous (P)', 
        value: formData.phosphorous === '' ? 0 : parseFloat(formData.phosphorous as string),
        fullMark: 100,
        color: getColorForValue(formData.phosphorous === '' ? 0 : parseFloat(formData.phosphorous as string))
      },
      { 
        subject: 'Potassium (K)', 
        value: formData.potassium === '' ? 0 : parseFloat(formData.potassium as string),
        fullMark: 100,
        color: getColorForValue(formData.potassium === '' ? 0 : parseFloat(formData.potassium as string))
      },
      { 
        subject: 'Temperature', 
        value: formData.temperature === '' ? 0 : parseFloat(formData.temperature as string),
        fullMark: 100,
        color: getColorForValue(formData.temperature === '' ? 0 : parseFloat(formData.temperature as string))
      },
      { 
        subject: 'Humidity', 
        value: formData.humidity === '' ? 0 : parseFloat(formData.humidity as string),
        fullMark: 100,
        color: getColorForValue(formData.humidity === '' ? 0 : parseFloat(formData.humidity as string))
      },
      { 
        subject: 'pH', 
        value: formData.ph === '' ? 0 : parseFloat(formData.ph as string),
        fullMark: 100,
        color: getColorForValue(formData.ph === '' ? 0 : parseFloat(formData.ph as string))
      },
      { 
        subject: 'Rainfall', 
        value: formData.rainfall === '' ? 0 : parseFloat(formData.rainfall as string),
        fullMark: 100,
        color: getColorForValue(formData.rainfall === '' ? 0 : parseFloat(formData.rainfall as string))
      },
    ];
    setChartData(newChartData);

    // Create bar chart data
    const newBarChartData = [
      { 
        name: 'Nitrogen (N)', 
        value: formData.nitrogen === '' ? 0 : parseFloat(formData.nitrogen as string),
        color: getColorForValue(formData.nitrogen === '' ? 0 : parseFloat(formData.nitrogen as string))
      },
      { 
        name: 'Phosphorous (P)', 
        value: formData.phosphorous === '' ? 0 : parseFloat(formData.phosphorous as string),
        color: getColorForValue(formData.phosphorous === '' ? 0 : parseFloat(formData.phosphorous as string))
      },
      { 
        name: 'Potassium (K)', 
        value: formData.potassium === '' ? 0 : parseFloat(formData.potassium as string),
        color: getColorForValue(formData.potassium === '' ? 0 : parseFloat(formData.potassium as string))
      },
      { 
        name: 'Temperature', 
        value: formData.temperature === '' ? 0 : parseFloat(formData.temperature as string),
        color: getColorForValue(formData.temperature === '' ? 0 : parseFloat(formData.temperature as string))
      },
      { 
        name: 'Humidity', 
        value: formData.humidity === '' ? 0 : parseFloat(formData.humidity as string),
        color: getColorForValue(formData.humidity === '' ? 0 : parseFloat(formData.humidity as string))
      },
      { 
        name: 'pH', 
        value: formData.ph === '' ? 0 : parseFloat(formData.ph as string),
        color: getColorForValue(formData.ph === '' ? 0 : parseFloat(formData.ph as string))
      },
      { 
        name: 'Rainfall', 
        value: formData.rainfall === '' ? 0 : parseFloat(formData.rainfall as string),
        color: getColorForValue(formData.rainfall === '' ? 0 : parseFloat(formData.rainfall as string))
      },
    ];
    setBarChartData(newBarChartData);
  }, [formData]);

  // Function to determine color based on value
  const getColorForValue = (value: number): string => {
    if (value <= 30) return '#3b82f6'; // Blue for low values
    if (value <= 70) return '#22c55e'; // Green for medium values
    return '#ef4444'; // Red for high values
  };

  // Function to get gradient color based on value
  const getGradientColor = (value: number): string => {
    if (value <= 30) return '#3b82f6'; // Blue for low values
    if (value <= 70) {
      // Gradient from blue to green
      const ratio = (value - 30) / 40;
      return `rgb(${59 + (34 - 59) * ratio}, ${130 + (197 - 130) * ratio}, ${246 + (94 - 246) * ratio})`;
    }
    // Gradient from green to red
    const ratio = (value - 70) / 30;
    return `rgb(${34 + (239 - 34) * ratio}, ${197 + (68 - 197) * ratio}, ${94 + (68 - 94) * ratio})`;
  };

  const validateField = (name: string, value: number): string | null => {
    const range = validationRanges[name as keyof typeof validationRanges];
    if (value < range.min || value > range.max) {
      return `Must be between ${range.min} and ${range.max} ${range.unit}`;
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear previous errors
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
    
    // Store the raw string value to avoid NaN issues
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Only validate if the value is not empty
    if (value !== '') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const error = validateField(name, numValue);
        if (error) {
          setValidationErrors(prev => ({ ...prev, [name]: error }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecommendation(null);
    
    // Validate all fields
    const errors: Record<string, string> = {};
    let hasErrors = false;
    
    // Create a numeric version of the form data for validation and submission
    const numericFormData: Record<string, number> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      // Skip validation if the field is empty
      if (value === '') {
        errors[key] = 'This field is required';
        hasErrors = true;
        continue;
      }
      
      const numValue = parseFloat(value as string);
      if (isNaN(numValue)) {
        errors[key] = 'Please enter a valid number';
        hasErrors = true;
        continue;
      }
      
      numericFormData[key] = numValue;
      const error = validateField(key, numValue);
      if (error) {
        errors[key] = error;
        hasErrors = true;
      }
    }
    
    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericFormData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendation');
      }
      
      setRecommendation(data);
      setActiveTab('result');
      
      // Reset form with empty strings after successful submission
      setFormData({
        nitrogen: '',
        phosphorous: '',
        potassium: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to populate form with sample data
  const populateSampleData = () => {
    setFormData({
      nitrogen: '45',
      phosphorous: '65',
      potassium: '85',
      temperature: '30',
      humidity: '70',
      ph: '6.5',
      rainfall: '50'
    });
    setActiveTab('visualization');
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Crop Recommendation System</CardTitle>
          <CardDescription>
            Enter the soil and environmental parameters to get crop recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Input Parameters</TabsTrigger>
              <TabsTrigger value="visualization">Data Visualization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={populateSampleData}
                  className="text-sm"
                >
                  Load Sample Data
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen">Nitrogen (N) <span className="text-xs text-gray-500">kg/ha</span></Label>
                    <Input
                      id="nitrogen"
                      name="nitrogen"
                      type="number"
                      min={validationRanges.nitrogen.min}
                      max={validationRanges.nitrogen.max}
                      step="0.1"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      required
                      className={validationErrors.nitrogen ? "border-red-500" : ""}
                    />
                    {validationErrors.nitrogen && (
                      <p className="text-xs text-red-500">{validationErrors.nitrogen}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorous">Phosphorous (P) <span className="text-xs text-gray-500">kg/ha</span></Label>
                    <Input
                      id="phosphorous"
                      name="phosphorous"
                      type="number"
                      min={validationRanges.phosphorous.min}
                      max={validationRanges.phosphorous.max}
                      step="0.1"
                      value={formData.phosphorous}
                      onChange={handleInputChange}
                      required
                      className={validationErrors.phosphorous ? "border-red-500" : ""}
                    />
                    {validationErrors.phosphorous && (
                      <p className="text-xs text-red-500">{validationErrors.phosphorous}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (K) <span className="text-xs text-gray-500">kg/ha</span></Label>
                    <Input
                      id="potassium"
                      name="potassium"
                      type="number"
                      min={validationRanges.potassium.min}
                      max={validationRanges.potassium.max}
                      step="0.1"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      required
                      className={validationErrors.potassium ? "border-red-500" : ""}
                    />
                    {validationErrors.potassium && (
                      <p className="text-xs text-red-500">{validationErrors.potassium}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature <span className="text-xs text-gray-500">°C</span></Label>
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      min={validationRanges.temperature.min}
                      max={validationRanges.temperature.max}
                      step="0.1"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      required
                      className={validationErrors.temperature ? "border-red-500" : ""}
                    />
                    {validationErrors.temperature && (
                      <p className="text-xs text-red-500">{validationErrors.temperature}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity <span className="text-xs text-gray-500">%</span></Label>
                    <Input
                      id="humidity"
                      name="humidity"
                      type="number"
                      min={validationRanges.humidity.min}
                      max={validationRanges.humidity.max}
                      step="0.1"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      required
                      className={validationErrors.humidity ? "border-red-500" : ""}
                    />
                    {validationErrors.humidity && (
                      <p className="text-xs text-red-500">{validationErrors.humidity}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph">pH</Label>
                    <Input
                      id="ph"
                      name="ph"
                      type="number"
                      min={validationRanges.ph.min}
                      max={validationRanges.ph.max}
                      step="0.1"
                      value={formData.ph}
                      onChange={handleInputChange}
                      required
                      className={validationErrors.ph ? "border-red-500" : ""}
                    />
                    {validationErrors.ph && (
                      <p className="text-xs text-red-500">{validationErrors.ph}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall">Rainfall <span className="text-xs text-gray-500">mm</span></Label>
                    <Input
                      id="rainfall"
                      name="rainfall"
                      type="number"
                      min={validationRanges.rainfall.min}
                      max={validationRanges.rainfall.max}
                      step="0.1"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      required
                      className={validationErrors.rainfall ? "border-red-500" : ""}
                    />
                    {validationErrors.rainfall && (
                      <p className="text-xs text-red-500">{validationErrors.rainfall}</p>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Recommendation...
                    </>
                  ) : (
                    'Get Recommendation'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="visualization" className="space-y-4">
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
                <h3 className="text-lg font-semibold text-center mb-4">Parameter Visualization</h3>
                
                {!hasData ? (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-center p-4">
                      No data to display. Please enter values in the form or click "Load Sample Data".
                    </p>
                  </div>
                ) : visualizationType === 'radar' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="35%" stopColor="#22c55e" stopOpacity={0.8}/>
                          <stop offset="65%" stopColor="#ef4444" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                        tickLine={{ stroke: '#9ca3af' }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                        tickLine={{ stroke: '#9ca3af' }}
                        tickCount={6}
                      />
                      <Radar 
                        name="Parameters" 
                        dataKey="value" 
                        stroke="#4b5563" 
                        fill="url(#colorGradient)" 
                        fillOpacity={0.6}
                        strokeWidth={2}
                        dot={{ fill: '#4b5563', strokeWidth: 2, r: 4 }}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getGradientColor(entry.value)} />
                        ))}
                      </Radar>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number) => [`${value.toFixed(1)}`, 'Value']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                        tickCount={6}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number) => [`${value.toFixed(1)}`, 'Value']}
                      />
                      <Bar dataKey="value" name="Value">
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
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>This visualization shows the relative values of your input parameters.</p>
                <p>Fill in the form to see the data visualized in real-time.</p>
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
              <h3 className="text-lg font-semibold text-green-800">Recommendation:</h3>
              <p className="text-green-700">{recommendation.message}</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>Confidence: {(recommendation.confidence * 100).toFixed(1)}%</p>
              </div>
              
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
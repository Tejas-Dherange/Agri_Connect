import { NextResponse } from 'next/server';

// Define the expected input type
interface CropRecommendationInput {
  nitrogen: number;
  phosphorous: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
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

// Define crop characteristics for more accurate recommendations
const cropCharacteristics = [
  {
    name: "Rice",
    temperature: { min: 20, max: 35 },
    rainfall: { min: 100, max: 300 },
    humidity: { min: 70, max: 100 },
    ph: { min: 5.5, max: 6.5 },
    nitrogen: { min: 80, max: 140 },
    phosphorous: { min: 40, max: 100 },
    potassium: { min: 30, max: 80 },
    description: "Rice is a staple food for more than half of the world's population. It grows well in flooded fields and requires warm temperatures."
  },
  {
    name: "Wheat",
    temperature: { min: 15, max: 25 },
    rainfall: { min: 30, max: 100 },
    humidity: { min: 40, max: 80 },
    ph: { min: 6.0, max: 7.0 },
    nitrogen: { min: 60, max: 120 },
    phosphorous: { min: 30, max: 90 },
    potassium: { min: 20, max: 70 },
    description: "Wheat is one of the most widely cultivated cereals. It's adaptable to various climates but prefers temperate regions."
  },
  {
    name: "Maize",
    temperature: { min: 18, max: 30 },
    rainfall: { min: 50, max: 150 },
    humidity: { min: 50, max: 90 },
    ph: { min: 5.5, max: 7.5 },
    nitrogen: { min: 70, max: 130 },
    phosphorous: { min: 35, max: 95 },
    potassium: { min: 25, max: 75 },
    description: "Maize (corn) is a versatile crop used for food, feed, and industrial products. It requires moderate rainfall and warm temperatures."
  },
  {
    name: "Sugarcane",
    temperature: { min: 25, max: 35 },
    rainfall: { min: 80, max: 200 },
    humidity: { min: 60, max: 90 },
    ph: { min: 5.5, max: 7.5 },
    nitrogen: { min: 90, max: 140 },
    phosphorous: { min: 45, max: 105 },
    potassium: { min: 35, max: 85 },
    description: "Sugarcane is a tropical crop used primarily for sugar production. It requires high temperatures and significant rainfall."
  },
  {
    name: "Cotton",
    temperature: { min: 20, max: 30 },
    rainfall: { min: 40, max: 120 },
    humidity: { min: 45, max: 85 },
    ph: { min: 5.5, max: 7.5 },
    nitrogen: { min: 100, max: 140 },
    phosphorous: { min: 50, max: 110 },
    potassium: { min: 40, max: 90 },
    description: "Cotton is a fiber crop that grows well in warm climates with moderate rainfall. It's sensitive to frost and requires well-drained soil."
  },
  {
    name: "Soybean",
    temperature: { min: 15, max: 30 },
    rainfall: { min: 45, max: 130 },
    humidity: { min: 50, max: 90 },
    ph: { min: 6.0, max: 7.0 },
    nitrogen: { min: 50, max: 110 },
    phosphorous: { min: 25, max: 85 },
    potassium: { min: 20, max: 70 },
    description: "Soybeans are legumes used for oil, protein, and animal feed. They can fix nitrogen in the soil and are adaptable to various climates."
  },
  {
    name: "Potato",
    temperature: { min: 10, max: 25 },
    rainfall: { min: 35, max: 110 },
    humidity: { min: 55, max: 85 },
    ph: { min: 5.0, max: 6.5 },
    nitrogen: { min: 80, max: 130 },
    phosphorous: { min: 40, max: 100 },
    potassium: { min: 30, max: 80 },
    description: "Potatoes are tuber crops that grow well in cool climates. They require well-drained soil and moderate rainfall."
  },
  {
    name: "Tomato",
    temperature: { min: 18, max: 30 },
    rainfall: { min: 30, max: 90 },
    humidity: { min: 40, max: 80 },
    ph: { min: 5.5, max: 7.0 },
    nitrogen: { min: 70, max: 120 },
    phosphorous: { min: 35, max: 95 },
    potassium: { min: 25, max: 75 },
    description: "Tomatoes are warm-season vegetables that require moderate temperatures and well-drained soil. They're sensitive to frost."
  },
  {
    name: "Coffee",
    temperature: { min: 15, max: 25 },
    rainfall: { min: 60, max: 150 },
    humidity: { min: 70, max: 90 },
    ph: { min: 5.0, max: 6.5 },
    nitrogen: { min: 60, max: 110 },
    phosphorous: { min: 30, max: 90 },
    potassium: { min: 20, max: 70 },
    description: "Coffee is a tropical crop that grows well in high-altitude regions with moderate temperatures and significant rainfall."
  },
  {
    name: "Tea",
    temperature: { min: 15, max: 25 },
    rainfall: { min: 70, max: 160 },
    humidity: { min: 75, max: 95 },
    ph: { min: 4.5, max: 6.0 },
    nitrogen: { min: 50, max: 100 },
    phosphorous: { min: 25, max: 85 },
    potassium: { min: 20, max: 70 },
    description: "Tea is a perennial crop that grows well in cool, humid climates with acidic soil. It requires significant rainfall."
  },
  {
    name: "Banana",
    temperature: { min: 20, max: 30 },
    rainfall: { min: 80, max: 200 },
    humidity: { min: 70, max: 90 },
    ph: { min: 5.5, max: 7.0 },
    nitrogen: { min: 80, max: 130 },
    phosphorous: { min: 40, max: 100 },
    potassium: { min: 30, max: 80 },
    description: "Bananas are tropical fruits that require warm temperatures, high humidity, and significant rainfall. They're sensitive to frost."
  },
  {
    name: "Cassava",
    temperature: { min: 20, max: 30 },
    rainfall: { min: 50, max: 150 },
    humidity: { min: 60, max: 90 },
    ph: { min: 5.0, max: 7.0 },
    nitrogen: { min: 40, max: 90 },
    phosphorous: { min: 20, max: 80 },
    potassium: { min: 15, max: 65 },
    description: "Cassava is a root crop that grows well in tropical climates. It's drought-tolerant and can grow in poor soil conditions."
  }
];

// Validate input parameters
function validateInput(data: CropRecommendationInput) {
  const errors: string[] = [];
  
  for (const [key, value] of Object.entries(data)) {
    const range = validationRanges[key as keyof typeof validationRanges];
    if (value < range.min || value > range.max) {
      errors.push(
        `${key.charAt(0).toUpperCase() + key.slice(1)} must be between ${range.min} and ${range.max} ${range.unit}`
      );
    }
  }
  
  return errors;
}

// Calculate suitability score for a crop based on input parameters
function calculateSuitabilityScore(crop: any, data: CropRecommendationInput): number {
  let score = 0;
  let totalFactors = 0;
  
  // Temperature suitability
  if (data.temperature >= crop.temperature.min && data.temperature <= crop.temperature.max) {
    score += 1;
  } else {
    score += 1 - Math.min(
      Math.abs(data.temperature - crop.temperature.min) / crop.temperature.min,
      Math.abs(data.temperature - crop.temperature.max) / crop.temperature.max
    );
  }
  totalFactors++;
  
  // Rainfall suitability
  if (data.rainfall >= crop.rainfall.min && data.rainfall <= crop.rainfall.max) {
    score += 1;
  } else {
    score += 1 - Math.min(
      Math.abs(data.rainfall - crop.rainfall.min) / crop.rainfall.min,
      Math.abs(data.rainfall - crop.rainfall.max) / crop.rainfall.max
    );
  }
  totalFactors++;
  
  // Humidity suitability
  if (data.humidity >= crop.humidity.min && data.humidity <= crop.humidity.max) {
    score += 1;
  } else {
    score += 1 - Math.min(
      Math.abs(data.humidity - crop.humidity.min) / crop.humidity.min,
      Math.abs(data.humidity - crop.humidity.max) / crop.humidity.max
    );
  }
  totalFactors++;
  
  // pH suitability
  if (data.ph >= crop.ph.min && data.ph <= crop.ph.max) {
    score += 1;
  } else {
    score += 1 - Math.min(
      Math.abs(data.ph - crop.ph.min) / crop.ph.min,
      Math.abs(data.ph - crop.ph.max) / crop.ph.max
    );
  }
  totalFactors++;
  
  // Nutrient suitability (weighted average of N, P, K)
  const nutrientScore = (
    (data.nitrogen >= crop.nitrogen.min && data.nitrogen <= crop.nitrogen.max ? 1 : 0.5) +
    (data.phosphorous >= crop.phosphorous.min && data.phosphorous <= crop.phosphorous.max ? 1 : 0.5) +
    (data.potassium >= crop.potassium.min && data.potassium <= crop.potassium.max ? 1 : 0.5)
  ) / 3;
  
  score += nutrientScore;
  totalFactors++;
  
  return score / totalFactors;
}

// Get crop recommendations based on input parameters
function getCropRecommendations(data: CropRecommendationInput) {
  // Calculate suitability scores for all crops
  const cropScores = cropCharacteristics.map(crop => ({
    ...crop,
    score: calculateSuitabilityScore(crop, data)
  }));
  
  // Sort crops by suitability score (descending)
  cropScores.sort((a, b) => b.score - a.score);
  
  // Get the top 3 crops
  const topCrops = cropScores.slice(0, 3);
  
  // Format the response
  return {
    primary: topCrops[0],
    alternatives: topCrops.slice(1).map(crop => crop.name)
  };
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate input
    const validationErrors = validateInput(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    // Get crop recommendations
    const recommendations = getCropRecommendations(data);
    
    // Return recommendation with confidence score
    return NextResponse.json({
      crop: recommendations.primary.name,
      confidence: recommendations.primary.score,
      message: `Based on the provided parameters, ${recommendations.primary.name} would be the most suitable crop for your conditions. ${recommendations.primary.description}`,
      alternatives: recommendations.alternatives,
      parameters: data,
    });
    
  } catch (error) {
    console.error('Error processing recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to process recommendation request' },
      { status: 500 }
    );
  }
} 
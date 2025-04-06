import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Product type definitions with specific information
const PRODUCT_TYPES = {
  pesticide: {
    usage: "Apply as directed on the product label, typically by spraying or dusting on affected areas. Avoid application during windy conditions.",
    dosage: "Follow the manufacturer's recommended dosage based on the target pest and crop type. Never exceed the recommended rate.",
    safetyInfo: "Wear protective clothing, gloves, and a mask. Avoid contact with skin and eyes. Wash hands thoroughly after use."
  },
  fertilizer: {
    usage: "Apply evenly across the soil surface or mix into the soil. Water thoroughly after application.",
    dosage: "Use according to soil test recommendations or manufacturer's guidelines. Over-application can harm plants.",
    safetyInfo: "Store in a dry place. Keep away from children and pets. Wash hands after handling."
  },
  herbicide: {
    usage: "Apply directly to weeds, avoiding contact with desirable plants. Best applied when weeds are actively growing.",
    dosage: "Follow label instructions for specific weed types and growth stages. Use appropriate dilution rates.",
    safetyInfo: "Wear protective clothing and avoid inhalation. Do not apply near water sources."
  },
  insecticide: {
    usage: "Apply to affected plants or areas where insects are present. Target both adult insects and larvae.",
    dosage: "Use recommended concentration based on insect type and severity of infestation.",
    safetyInfo: "Wear protective gear and avoid application during peak pollinator activity."
  },
  plant_food: {
    usage: "Mix with water according to package instructions and apply to soil or foliage as directed.",
    dosage: "Follow the recommended dilution rate on the package. Frequency depends on plant type and growth stage.",
    safetyInfo: "Store in a cool, dry place. Keep away from children and pets. Wash hands after handling."
  },
  soil_amendment: {
    usage: "Mix into soil before planting or apply as a top dressing around existing plants.",
    dosage: "Use according to soil test results or package instructions. Amount varies by soil type and plant needs.",
    safetyInfo: "Wear gloves when handling. Store in a dry place away from moisture."
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Check if Cloudinary credentials are set
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Convert the file to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    console.log(base64Image);

    // Upload image to Cloudinary with basic settings
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Image}`,
      {
        resource_type: 'image',
        folder: 'agricultural_products',
        tags: ['agriculture', 'product_identification'],
        quality_analysis: true
      }
    );

    // Get basic image analysis results
    const analysisResult = await cloudinary.api.resource(uploadResult.public_id, {
      image_metadata: true,
      quality_analysis: true
    });

    // Extract and process tags
    const tags = analysisResult.tags || [];
    
    // Define specific product categories with weighted keywords
    const productCategories = {
      pesticide: {
        keywords: ['pesticide', 'pest control', 'insect', 'bug killer', 'spray', 'chemical', 'protection', 'bottle', 'container', 'liquid', 'powder', 'agriculture', 'farm', 'crop'],
        weight: 1
      },
      fertilizer: {
        keywords: ['fertilizer', 'nutrient', 'plant food', 'growth', 'soil', 'npk', 'nitrogen', 'phosphorus', 'potassium', 'granular', 'pellet', 'powder', 'agriculture', 'farm', 'crop'],
        weight: 1
      },
      herbicide: {
        keywords: ['herbicide', 'weed', 'killer', 'weedkiller', 'control', 'selective', 'non-selective', 'round-up', 'spray', 'liquid', 'agriculture', 'farm', 'crop'],
        weight: 1
      },
      insecticide: {
        keywords: ['insecticide', 'bug', 'insect', 'bug killer', 'pest', 'control', 'spray', 'dust', 'granular', 'bottle', 'container', 'agriculture', 'farm', 'crop'],
        weight: 1
      },
      plant_food: {
        keywords: ['plant food', 'fertilizer', 'nutrient', 'growth', 'liquid', 'powder', 'granular', 'feed', 'bottle', 'container', 'agriculture', 'farm', 'crop'],
        weight: 1
      },
      soil_amendment: {
        keywords: ['soil', 'amendment', 'compost', 'organic', 'manure', 'mulch', 'peat', 'vermiculite', 'perlite', 'bag', 'sack', 'agriculture', 'farm', 'crop'],
        weight: 1
      }
    };

    // Improved product identification algorithm with scoring system
    let productScores = {};
    let confidenceScores = {};

    // Initialize scores for all product types
    for (const productType of Object.keys(productCategories)) {
      productScores[productType] = 0;
      confidenceScores[productType] = 0;
    }

    // Process each product type
    for (const [productType, criteria] of Object.entries(productCategories)) {
      // Score based on tag matches
      for (const tag of tags) {
        const tagLower = tag.toLowerCase();
        for (const keyword of criteria.keywords) {
          if (tagLower.includes(keyword.toLowerCase())) {
            productScores[productType] += criteria.weight;
          }
        }
      }
      
      // Calculate confidence score (0-1)
      const maxPossibleScore = criteria.keywords.length * criteria.weight;
      confidenceScores[productType] = maxPossibleScore > 0 ? 
        Math.min(1, productScores[productType] / maxPossibleScore) : 0;
    }

    // Find the product with highest score
    let identifiedProduct = null;
    let maxScore = 0;
    let confidence = 0;

    for (const [productType, score] of Object.entries(productScores)) {
      if (score > maxScore) {
        maxScore = score;
        identifiedProduct = productType;
        confidence = confidenceScores[productType];
      }
    }

    // If no product identified with sufficient confidence, try to make a best guess
    if (!identifiedProduct || confidence < 0.1) {
      // Check if any agricultural-related tags were found
      const agriculturalKeywords = [
        'agriculture', 'farm', 'crop', 'plant', 'garden', 'soil', 'grow',
        'chemical', 'spray', 'bottle', 'container', 'package', 'label'
      ];

      const hasAgriculturalTags = tags.some(tag =>
        agriculturalKeywords.some(keyword => tag.toLowerCase().includes(keyword))
      );

      if (hasAgriculturalTags) {
        // Make a best guess based on the most common agricultural product
        identifiedProduct = 'fertilizer';
        confidence = 0.5;
      } else {
        return NextResponse.json(
          { 
            error: 'Unable to identify the image as an agricultural product. Please upload a clear image of a pesticide, fertilizer, herbicide, or insecticide. Make sure the product label or container is visible.',
            debug: {
              scores: productScores,
              confidence: confidenceScores,
              tags: tags.slice(0, 20)
            }
          },
          { status: 400 }
        );
      }
    }

    // Get product-specific information
    const productInfo = PRODUCT_TYPES[identifiedProduct];

    // Find other possible matches (products with at least 30% of the top score)
    const otherMatches = Object.entries(productScores)
      .filter(([type, score]) => type !== identifiedProduct && score >= maxScore * 0.3)
      .sort((a, b) => b[1] - a[1])
      .map(([type, score]) => ({ 
        label: type, 
        score: confidenceScores[type]
      }))
      .slice(0, 2);

    // Return detailed results
    return NextResponse.json({
      product: {
        name: identifiedProduct,
        confidence: confidence,
        predictions: [
          { label: identifiedProduct, score: confidence },
          ...otherMatches
        ],
        usage: productInfo.usage,
        dosage: productInfo.dosage,
        safetyInfo: productInfo.safetyInfo,
        debug: {
          topTags: tags.slice(0, 10) // Top 10 tags for debugging
        }
      }
    });

  } catch (error) {
    console.error('Product identification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process the image' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import { PestReport } from '@/models/schemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Connect to database first
    await connectDB();

    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug log

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 });
    }

    const formData = await req.formData();
    console.log('Form Data:', Object.fromEntries(formData.entries())); // Debug log
    
    // Validate required fields
    const requiredFields = ['pestType', 'description', 'severity', 'location.lat', 'location.lng'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }

    // Upload images to Cloudinary
    const imageFiles = formData.getAll('images');
    const imageUrls = [];
    
    for (const file of imageFiles) {
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'pest_reports' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        
        imageUrls.push(result.secure_url);
      }
    }

    // Create pest report
    const pestReport = new PestReport({
      farmerId: session.user.id,
      pestType: formData.get('pestType'),
      description: formData.get('description'),
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(formData.get('location.lng')),
          parseFloat(formData.get('location.lat'))
        ]
      },
      images: imageUrls,
      severity: formData.get('severity'),
      status: 'reported',
      createdAt: new Date()
    });

    console.log('Pest Report to save:', pestReport); // Debug log

    const savedReport = await pestReport.save();
    console.log('Saved Report:', savedReport); // Debug log

    return NextResponse.json({ 
      success: true, 
      data: savedReport 
    });
  } catch (error) {
    console.error('Error creating pest report:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create pest report' 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));
    const radius = parseFloat(searchParams.get('radius')) || 10; // Default 10km radius

    let query = { farmerId: session.user.id }; // Only show reports for the current user
    
    // Add location filter if coordinates are provided
    if (!isNaN(lat) && !isNaN(lng)) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const reports = await PestReport.find(query)
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching pest reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
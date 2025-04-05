import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import { PestReport } from '@/models/schemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    const pestReport = new PestReport({
      farmerId: session.user.id,
      pestType: data.pestType,
      description: data.description,
      location: {
        type: 'Point',
        coordinates: [data.location.lng, data.location.lat]
      },
      images: data.images,
      voiceNote: data.voiceNote,
      severity: data.severity,
      status: 'reported'
    });

    await pestReport.save();

    return NextResponse.json({ success: true, data: pestReport });
  } catch (error) {
    console.error('Error creating pest report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

    let query = {};
    
    // Only apply location filter if valid coordinates are provided
    if (!isNaN(lat) && !isNaN(lng)) {
      query = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
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
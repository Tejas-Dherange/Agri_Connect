import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ExpertSession, SessionRegistration } from '@/models/expert-sessions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Create a new expert session (Admin/Expert only)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'expert'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    const expertSession = new ExpertSession({
      ...data,
      expertId: session.user.id
    });

    await expertSession.save();

    return NextResponse.json({ success: true, data: expertSession });
  } catch (error) {
    console.error('Error creating expert session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Get all expert sessions
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
    const radius = parseFloat(searchParams.get('radius')) || 50; // Default 50km radius

    let query = {};
    
    // If location parameters are provided, find sessions near the location
    if (!isNaN(lat) && !isNaN(lng)) {
      query = {
        'village.location': {
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

    const sessions = await ExpertSession.find(query)
      .populate('expertId', 'name email')
      .sort({ date: 1 });

    // If user is a farmer, add registration status
    if (session.user.role === 'farmer') {
      const registrations = await SessionRegistration.find({
        farmerId: session.user.id,
        sessionId: { $in: sessions.map(s => s._id) }
      });

      const sessionsWithRegistration = sessions.map(session => ({
        ...session.toObject(),
        registrationStatus: registrations.find(r => r.sessionId.toString() === session._id.toString())?.status || null
      }));

      return NextResponse.json({ success: true, data: sessionsWithRegistration });
    }

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching expert sessions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
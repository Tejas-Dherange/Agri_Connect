import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect.js';
import LaborRequest from '@/models/LaborRequest';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Create a new labor request
export async function POST(req) {
  try {
    console.log('[POST] Connecting to DB...');
    await connectDB();

    const session = await getServerSession(authOptions);
    console.log('[POST] Session:', session);

    if (!session || session.user.role !== 'farmer') {
      console.warn('[POST] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Only farmers can create labor requests' },
        { status: 403 }
      );
    }

    const data = await req.json();
    console.log('[POST] Request Data:', data);

    const laborRequest = await LaborRequest.create({
      ...data,
      farmer: session.user.id,
      status: 'open',
    });

    console.log('[POST] Labor Request Created:', laborRequest);
    return NextResponse.json(laborRequest, { status: 201 });
  } catch (error) {
    console.error('[POST] Error creating labor request:', error);
    return NextResponse.json(
      { error: 'Failed to create labor request' },
      { status: 500 }
    );
  }
}

// Get all labor requests
export async function GET(req) {
  try {
    console.log('[GET] Connecting to DB...');
    await connectDB();

    const session = await getServerSession();
    console.log('[GET] Session:', session);

    if (!session) {
      console.warn('[GET] No session found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const location = searchParams.get('location');

    console.log('[GET] Query Params:', { status, location });

    let query = {};

    if (status) {
      query.status = status;
    }

    if (location) {
      query['location.district'] = location;
    }

    if (session.user.role === 'farmer') {
      query.farmer = session.user.id;
    }

    console.log('[GET] Final Query:', query);

    const laborRequests = await LaborRequest.find(query)
      .populate('farmer', 'name phone location')
      .populate('assignedTo', 'name phone')
      .sort({ createdAt: -1 });

    console.log('[GET] Labor Requests Found:', laborRequests.length);
    return NextResponse.json(laborRequests);
  } catch (error) {
    console.error('[GET] Error fetching labor requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch labor requests' },
      { status: 500 }
    );
  }
}

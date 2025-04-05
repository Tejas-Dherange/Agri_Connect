import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import LaborRequest from '@/models/LaborRequest';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { auth } from '@/lib/auth.js'; 


// ✅ GET /api/labor-requests/:id
export async function GET(req, { params }) {
  try {
    await connectDB();

    const {id} = params;

    const laborRequest = await LaborRequest.findById(id)
      .populate('farmer', '-password')
      .populate('assignedTo', '-password');

    if (!laborRequest) {
      return NextResponse.json({ error: 'Labor request not found' }, { status: 404 });
    }

    return NextResponse.json(laborRequest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
  }
}

// ✅ POST /api/labor-requests/:id — Assign labor head
export async function POST(req, { params }) {
  try {
    const id = params.id;
    await connectDB();
    const session = await auth();

    if (!session || session.user.role !== 'laborHead') {
      return NextResponse.json(
        { error: 'Only labor heads can assign labor groups' },
        { status: 403 }
      );
    }

    const laborRequest = await LaborRequest.findById(id);
    if (!laborRequest) {
      return NextResponse.json({ error: 'Labor request not found' }, { status: 404 });
    }

    if (laborRequest.status !== 'open') {
      return NextResponse.json(
        { error: 'This request is not open for assignment' },
        { status: 400 }
      );
    }

    laborRequest.assignedTo = session.user.id;
    laborRequest.status = 'assigned';

    await laborRequest.save();

    return NextResponse.json({
      message: 'Labor group successfully assigned to request',
      laborRequest,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to assign labor group' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ExpertSession, SessionRegistration } from '@/models/expert-sessions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await req.json();
    await connectDB();

    // Check if session exists and has available slots
    const expertSession = await ExpertSession.findById(sessionId);
    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (expertSession.status !== 'scheduled') {
      return NextResponse.json({ error: 'Session is not available for registration' }, { status: 400 });
    }

    const registeredCount = await SessionRegistration.countDocuments({ sessionId });
    if (registeredCount >= expertSession.maxParticipants) {
      return NextResponse.json({ error: 'Session is full' }, { status: 400 });
    }

    // Check if already registered
    const existingRegistration = await SessionRegistration.findOne({
      sessionId,
      farmerId: session.user.id
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this session' }, { status: 400 });
    }

    // Create registration
    const registration = new SessionRegistration({
      sessionId,
      farmerId: session.user.id
    });

    await registration.save();

    return NextResponse.json({ success: true, data: registration });
  } catch (error) {
    console.error('Error registering for session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    await connectDB();

    const registration = await SessionRegistration.findOneAndDelete({
      sessionId,
      farmerId: session.user.id
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error canceling registration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
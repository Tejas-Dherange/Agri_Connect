import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Quiz, QuizResult } from '@/models/expert-sessions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    // Check if quiz exists
    const quiz = await Quiz.findById(data.quizId);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Check if user has already taken the quiz
    const existingResult = await QuizResult.findOne({
      quizId: data.quizId,
      farmerId: session.user.id
    });

    if (existingResult) {
      return NextResponse.json({ error: 'You have already taken this quiz' }, { status: 400 });
    }

    // Create quiz result
    const quizResult = new QuizResult({
      quizId: data.quizId,
      farmerId: session.user.id,
      answers: data.answers,
      score: data.score,
      passed: data.passed,
      rewardClaimed: false
    });

    await quizResult.save();

    // If passed, update user's reward points
    if (data.passed) {
      // TODO: Implement reward points system
      // await User.findByIdAndUpdate(session.user.id, {
      //   $inc: { rewardPoints: quiz.rewardPoints }
      // });
    }

    return NextResponse.json({ success: true, data: quizResult });
  } catch (error) {
    console.error('Error submitting quiz:', error);
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
    const sessionId = searchParams.get('sessionId');

    const quiz = await Quiz.findOne({ sessionId });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Check if user has already taken the quiz
    const result = await QuizResult.findOne({
      quizId: quiz._id,
      farmerId: session.user.id
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        quiz,
        result
      }
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
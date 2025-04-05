import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Solution from '@/models/Solution';
import CommunityPost from '@/models/CommunityPost';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const solutions = await Solution.find({ post: postId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(solutions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();

    const solution = await Solution.create({
      ...data,
      author: session.user.id
    });

    // Update the community post with the new solution
    await CommunityPost.findByIdAndUpdate(
      data.post,
      { $push: { solutions: solution._id } }
    );

    return NextResponse.json(solution);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
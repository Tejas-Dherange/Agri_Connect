import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import CommunityPost from '@/models/CommunityPost';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const cropType = searchParams.get('cropType');
    const problemType = searchParams.get('problemType');
    const tag = searchParams.get('tag');

    let query = {};
    if (cropType) query.cropType = cropType;
    if (problemType) query.problemType = problemType;
    if (tag) query.tags = tag;

    const posts = await CommunityPost.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
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

    const post = await CommunityPost.create({
      ...data,
      author: session.user.id
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
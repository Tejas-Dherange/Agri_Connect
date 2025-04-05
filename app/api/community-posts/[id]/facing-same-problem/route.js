import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import CommunityPost from '@/models/CommunityPost';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const postId = params.id;
    const userId = session.user.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const hasAlreadyFaced = post.facingSameProblem.includes(userId);
    
    if (hasAlreadyFaced) {
      // Remove user from facing same problem
      await CommunityPost.findByIdAndUpdate(postId, {
        $pull: { facingSameProblem: userId }
      });
    } else {
      // Add user to facing same problem
      await CommunityPost.findByIdAndUpdate(postId, {
        $addToSet: { facingSameProblem: userId }
      });
    }

    return NextResponse.json({ success: true, hasAlreadyFaced: !hasAlreadyFaced });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';

export default function PostCard({ post, onUpdate }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState('');
  const [showSolutions, setShowSolutions] = useState(false);
  const [solutions, setSolutions] = useState([]);

  const handleFacingSameProblem = async () => {
    try {
      const response = await fetch(`/api/community-posts/${post._id}/facing-same-problem`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to update');
      
      onUpdate();
    } catch (error) {
      toast.error('Error updating post');
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!solution.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/solutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: solution,
          post: post._id,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit solution');

      toast.success('Solution submitted successfully');
      setSolution('');
      fetchSolutions();
    } catch (error) {
      toast.error('Error submitting solution');
    } finally {
      setLoading(false);
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await fetch(`/api/solutions?postId=${post._id}`);
      const data = await response.json();
      setSolutions(data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const toggleSolutions = () => {
    setShowSolutions(!showSolutions);
    if (!showSolutions) {
      fetchSolutions();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-start gap-2">
          <span className="text-lg font-semibold">{post.title}</span>
          <Badge variant="outline" className="shrink-0">{post.cropType}</Badge>
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge>{post.problemType}</Badge>
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="mb-4 flex-1">{post.description}</p>
        
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {post.images.map((image, index) => (
              <div key={index} className="relative h-40">
                <Image
                  src={image.url}
                  alt={`Problem image ${index + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFacingSameProblem}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <span>Facing Same Problem</span>
            <Badge variant="secondary" className="ml-auto">{post.facingSameProblem?.length || 0}</Badge>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSolutions}
            className="w-full sm:w-auto"
          >
            {showSolutions ? 'Hide Solutions' : 'Show Solutions'}
          </Button>
        </div>

        {showSolutions && (
          <div className="space-y-4 mt-4">
            <form onSubmit={handleSubmitSolution} className="space-y-2">
              <Textarea
                placeholder="Share your solution..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="min-h-[100px]"
              />
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Submitting...' : 'Submit Solution'}
              </Button>
            </form>

            <div className="space-y-4">
              {solutions.map((solution) => (
                <Card key={solution._id} className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      By {solution.author.name} • {new Date(solution.createdAt).toLocaleDateString()}
                    </p>
                    <p>{solution.content}</p>
                    {solution.images && solution.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {solution.images.map((image, index) => (
                          <div key={index} className="relative h-32">
                            <Image
                              src={image.url}
                              alt={`Solution image ${index + 1}`}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
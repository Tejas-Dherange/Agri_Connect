'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CreatePostDialog from './CreatePostDialog';
import PostCard from './PostCard';

export default function CommunityForum() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    cropType: 'all',
    problemType: 'all',
    tag: ''
  });

  // Fetch posts on initial load and when filters change
  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.cropType && filters.cropType !== 'all') queryParams.append('cropType', filters.cropType);
      if (filters.problemType && filters.problemType !== 'all') queryParams.append('problemType', filters.problemType);
      if (filters.tag) queryParams.append('tag', filters.tag);

      const response = await fetch(`/api/community-posts?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <Button onClick={() => setIsCreatePostOpen(true)}>Create New Post</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          value={filters.cropType}
          onValueChange={(value) => setFilters({ ...filters, cropType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Crop Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            <SelectItem value="Rice">Rice</SelectItem>
            <SelectItem value="Wheat">Wheat</SelectItem>
            <SelectItem value="Corn">Corn</SelectItem>
            <SelectItem value="Sugarcane">Sugarcane</SelectItem>
            <SelectItem value="Cotton">Cotton</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.problemType}
          onValueChange={(value) => setFilters({ ...filters, problemType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Problem Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Problems</SelectItem>
            <SelectItem value="Pest">Pest</SelectItem>
            <SelectItem value="Weather">Weather</SelectItem>
            <SelectItem value="Disease">Disease</SelectItem>
            <SelectItem value="Soil">Soil</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by tag"
          value={filters.tag}
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">No posts found</h3>
          <p className="text-gray-400 mt-2">Be the first to create a post in the community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
          ))}
        </div>
      )}

      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        onPostCreated={fetchPosts}
      />
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminExpertSessionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    village: {
      name: '',
      location: {
        coordinates: [0, 0]
      }
    },
    date: '',
    duration: 60,
    maxParticipants: 20,
    topics: []
  });
  const [currentTopic, setCurrentTopic] = useState('');
  const [editingSession, setEditingSession] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    } else {
      fetchSessions();
    }
  }, [status, session, router]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/admin/expert-sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddTopic = () => {
    if (currentTopic.trim()) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, currentTopic.trim()]
      }));
      setCurrentTopic('');
    }
  };

  const handleRemoveTopic = (index) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setFormData({
      ...session,
      date: format(new Date(session.date), "yyyy-MM-dd'T'HH:mm"),
    });
    setIsDialogOpen(true);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/expert-sessions?id=${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      toast.success('Session deleted successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSession
        ? '/api/admin/expert-sessions'
        : '/api/admin/expert-sessions';
      const method = editingSession ? 'PUT' : 'POST';
      const body = editingSession
        ? { id: editingSession._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save session');
      }

      toast.success(`Session ${editingSession ? 'updated' : 'created'} successfully`);
      setFormData({
        title: '',
        description: '',
        village: {
          name: '',
          location: {
            coordinates: [0, 0]
          }
        },
        date: '',
        duration: 60,
        maxParticipants: 20,
        topics: []
      });
      setEditingSession(null);
      setIsDialogOpen(false);
      fetchSessions();
    } catch (error) {
      toast.error(`Failed to ${editingSession ? 'update' : 'create'} session`);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Expert Sessions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSession(null);
              setFormData({
                title: '',
                description: '',
                village: {
                  name: '',
                  location: {
                    coordinates: [0, 0]
                  }
                },
                date: '',
                duration: 60,
                maxParticipants: 20,
                topics: []
              });
            }}>
              Create New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? 'Edit Session' : 'Create New Session'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Village Name</label>
                <Input
                  name="village.name"
                  value={formData.village.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date & Time</label>
                <Input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Participants</label>
                <Input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Topics</label>
                <div className="flex gap-2">
                  <Input
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    placeholder="Add a topic"
                  />
                  <Button type="button" onClick={handleAddTopic}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.topics.map((topic, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingSession ? 'Update Session' : 'Create Session'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions found</p>
        ) : (
          sessions.map(session => (
            <Card key={session._id}>
              <CardHeader>
                <CardTitle>{session.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Village:</strong> {session.village.name}</p>
                  <p><strong>Date:</strong> {format(new Date(session.date), 'PPP p')}</p>
                  <p><strong>Duration:</strong> {session.duration} minutes</p>
                  <p><strong>Max Participants:</strong> {session.maxParticipants}</p>
                  <div>
                    <strong>Topics:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {session.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 px-2 py-1 rounded text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleEditSession(session)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteSession(session._id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 
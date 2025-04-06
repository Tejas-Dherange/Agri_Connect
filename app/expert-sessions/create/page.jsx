'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function CreateSessionForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    maxParticipants: '',
    topics: '',
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      date: new Date(form.date),
      duration: parseInt(form.duration),
      maxParticipants: parseInt(form.maxParticipants),
      topics: form.topics.split(',').map((t) => t.trim()),
    };

    try {
      const response = await fetch('/api/expert-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create session');
      }

      router.push('/expert-sessions');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Create Expert Session</h2>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" value={form.description} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="date">Date & Time</Label>
        <Input name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input name="duration" type="number" value={form.duration} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="maxParticipants">Max Participants</Label>
        <Input name="maxParticipants" type="number" value={form.maxParticipants} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="topics">Topics (comma-separated)</Label>
        <Input name="topics" value={form.topics} onChange={handleChange} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Session'}
      </Button>
    </form>
  );
}

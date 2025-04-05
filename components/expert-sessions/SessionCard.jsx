'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SessionCard({ session, onRegister, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await onRegister(session._id);
      toast.success('Successfully registered for the session');
    } catch (error) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await onCancel(session._id);
      toast.success('Registration cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel registration');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case 'scheduled':
        return <Badge variant="default">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{session.title}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Expert</p>
            <p className="font-medium">{session.expertId?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{session.village.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">
              {format(new Date(session.date), 'PPP p')}
            </p>
            <p className="text-sm text-gray-500">
              Duration: {session.duration} minutes
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Topics</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {session.topics.map((topic, index) => (
                <Badge key={index} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {session.registrationStatus === 'registered' ? (
            <span className="text-green-600">Registered</span>
          ) : session.registrationStatus === 'attended' ? (
            <span className="text-blue-600">Attended</span>
          ) : null}
        </div>
        {session.status === 'scheduled' && (
          <div className="space-x-2">
            {session.registrationStatus === 'registered' ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel Registration
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleRegister}
                disabled={isLoading}
              >
                Register
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function LaborRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/labor-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch labor requests');
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/labor-requests/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'I have accepted your labor request. I will contact you shortly with more details.'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      // Refresh the requests list
      fetchRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Labor Requests</h1>
        <div className="flex items-center gap-4">
          {session?.user?.role === 'farmer' && (
            <Link
              href="/labor-requests/create"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Create New Request
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{request.title}</h2>
                <p className="text-gray-600 mt-2">{request.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  request.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'assigned'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {request.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Work Type</p>
                <p className="font-medium">{request.workType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number of Labors</p>
                <p className="font-medium">{request.numberOfLabors}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Daily Wage</p>
                <p className="font-medium">₹{request.dailyWage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {request.location.village}, {request.location.district}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {new Date(request.startDate).toLocaleDateString()} -{' '}
                  {new Date(request.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/labor-requests/${request._id}`}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  View Details
                </Link>
                {session?.user?.role === 'laborHead' && request.status === 'open' && (
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Accept Request
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No labor requests found</p>
          </div>
        )}
      </div>
    </div>
  );
} 
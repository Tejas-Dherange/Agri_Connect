'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

export default function LaborRequestDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    if (id) fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      console.log(id);
      const response = await fetch(`/api/labor-requests/${id}`);
      if (!response.ok) throw new Error('Failed to fetch request details');
      const data = await response.json();
      setRequest(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRequest = async () => {
    try {
      const response = await fetch(`/api/labor-requests/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: bookingMessage || 'I am interested in this request and will contact you shortly.',
        }),
      });

      if (!response.ok) throw new Error('Failed to book request');

      fetchRequestDetails();
      router.push('/labor-requests');
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

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500">Request not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{request.title}</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Work Type</p>
                <p className="font-medium">{request.workType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number of Labors Required</p>
                <p className="font-medium">{request.numberOfLabors}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Daily Wage</p>
                <p className="font-medium">₹{request.dailyWage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {new Date(request.startDate).toLocaleDateString()} -{' '}
                  {new Date(request.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {request.location.village}, {request.location.district}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Farmer Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{request.farmer?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{request.farmer?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {request.farmer?.location?.village}, {request.farmer?.location?.district}
                </p>
              </div>
            </div>
          </div>
        </div>

        {request.status === 'assigned' && request.assignedTo && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Assigned Labor Head Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{request.assignedTo?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{request.assignedTo?.phone}</p>
              </div>
            </div>
          </div>
        )}

        {session?.user?.role === 'laborHead' && request.status === 'open' && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Book This Request</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message to Farmer
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  placeholder="Add a message for the farmer (optional)"
                />
              </div>
              <button
                onClick={handleBookRequest}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Book Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

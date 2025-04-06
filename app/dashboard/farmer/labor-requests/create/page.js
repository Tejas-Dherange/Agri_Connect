'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LaborRequestForm from '@/components/LaborRequestForm';

export default function CreateLaborRequest() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/labor-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create labor request');
      }

      router.push('/dashboard/farmer/labor-requests');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Labor Request</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <LaborRequestForm onSubmit={handleSubmit} />
    </div>
  );
} 
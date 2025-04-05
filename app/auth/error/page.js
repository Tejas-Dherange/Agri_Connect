'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    console.error('Authentication error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            {error === 'Configuration' && 'There is a problem with the server configuration.'}
            {error === 'AccessDenied' && 'You do not have permission to sign in.'}
            {error === 'Verification' && 'The verification token has expired or has already been used.'}
            {error === 'Default' && 'An error occurred during authentication.'}
            {!error && 'An unknown error occurred.'}
          </p>
          <p className="text-sm text-gray-500">
            Error code: {error || 'unknown'}
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/login">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 
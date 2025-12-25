'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function TestConnection() {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();

        // Test 1: Check if client is created
        setDetails('Client created successfully\n');

        // Test 2: Try to get session (should be null since not logged in)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          setStatus('❌ Connection failed');
          setDetails(prev => prev + `\nError: ${sessionError.message}`);
          return;
        }

        setDetails(prev => prev + 'Auth check successful (no session - expected)\n');

        // Test 3: Try a simple query to verify database connection
        const { error: dbError } = await supabase.from('lists').select('count').limit(0);

        if (dbError) {
          // If error is about table not existing, that's actually good - means connection works!
          if (dbError.message.includes('relation') || dbError.message.includes('does not exist')) {
            setStatus('✅ Connection successful! (Database needs migration)');
            setDetails(prev => prev + '\nDatabase connected but tables not created yet.\nYou need to run the migration.');
          } else {
            setStatus('❌ Database connection failed');
            setDetails(prev => prev + `\nDB Error: ${dbError.message}`);
          }
        } else {
          setStatus('✅ Connection successful!');
          setDetails(prev => prev + '\nDatabase connected and ready!');
        }

      } catch (error) {
        setStatus('❌ Connection failed');
        setDetails(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        <div className="mb-4">
          <p className="text-lg font-semibold">{status}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <pre className="whitespace-pre-wrap text-sm">{details}</pre>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Project URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p>API Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </div>
    </div>
  );
}

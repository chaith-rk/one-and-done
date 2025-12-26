import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Test 1: Check auth
    const { error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Auth check failed',
          error: sessionError.message
        },
        { status: 500 }
      );
    }

    // Test 2: Try to query the database
    const { error: dbError } = await supabase.from('lists').select('count').limit(0);

    if (dbError) {
      // If error is about table not existing, connection is good but needs migration
      if (dbError.message.includes('relation') || dbError.message.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          message: 'Connection successful! Database needs migration.',
          needsMigration: true,
          details: 'Tables not created yet. Run the migration script.'
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Database query failed',
          error: dbError.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Connection successful! Database is ready.',
      needsMigration: false
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

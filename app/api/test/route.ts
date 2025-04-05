import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Test the connection by getting server info
    const result = await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      message: 'Successfully connected to MongoDB!',
      ping: result
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find college by email
    const college = await db.collection('colleges').findOne({ email });

    if (!college) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, college.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if college is approved
    // if (college.status !== 'approved') {
    //   return NextResponse.json(
    //     { error: 'Your college account is pending approval' },
    //     { status: 403 }
    //   );
    // }

    // Return necessary data for localStorage
    console.log("Login Successful");
    return NextResponse.json({
      collegeId: college._id.toString(),
      collegeName: college.collegeName,
      email: college.email,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
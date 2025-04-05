import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    // Get the college ID from the request headers
    const collegeId = request.headers.get('X-College-ID');

    if (!collegeId) {
      return NextResponse.json(
        { error: 'Unauthorized - College authentication required' },
        { status: 401 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      department,
      designation,
      employeeId,
      specialization,
      joiningDate,
      password,
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !department || 
        !designation || !employeeId || !specialization || !joiningDate || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Verify that the college exists and is active
    const college = await db.collection('colleges').findOne({
      _id: new ObjectId(collegeId),
      status: 'approved'
    });

    if (!college) {
      return NextResponse.json(
        { error: 'College not found or not approved' },
        { status: 404 }
      );
    }

    // Check if teacher email or employee ID already exists
    const existingTeacher = await db.collection('teachers').findOne({
      $or: [
        { email },
        { employeeId }
      ],
      collegeId: new ObjectId(collegeId)
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher with this email or employee ID already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new teacher record
    const result = await db.collection('teachers').insertOne({
      firstName,
      lastName,
      email,
      phoneNumber,
      department,
      designation,
      employeeId,
      specialization,
      joiningDate,
      password: hashedPassword,
      collegeId: new ObjectId(collegeId),
      collegeName: college.collegeName,
      status: 'active',
      createdAt: new Date(),
      lastUpdated: new Date(),
      roles: ['teacher'], // Can be expanded to include additional roles like 'department_head', 'exam_coordinator', etc.
    });

    return NextResponse.json(
      {
        message: 'Teacher account created successfully',
        teacherId: result.insertedId,
        teacherInfo: {
          firstName,
          lastName,
          email,
          department,
          designation
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Teacher creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
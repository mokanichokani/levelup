import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

interface StudentInput {
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  division: string;
  year: string;
  course: string;
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    // Get the college ID from the request headers
    const collegeId ="67f13efbd048d3520dd82624";

    if (!collegeId) {
      return NextResponse.json(
        { error: 'Unauthorized - College authentication required' },
        { status: 401 }
      );
    }

    const { students } = await request.json() as { students: StudentInput[] };

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: 'No student data provided' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Verify that the college exists and is active
    const college = await db.collection('colleges').findOne({
      _id: new ObjectId(collegeId),
      
    });

    if (!college) {
      return NextResponse.json(
        { error: 'College not found or not approved' },
        { status: 404 }
      );
    }

    // Check for duplicate emails or usernames
    const emails = students.map(student => student.email);
    const usernames = students.map(student => student.username);

    const existingUsers = await db.collection('students').find({
      $or: [
        { email: { $in: emails } },
        { username: { $in: usernames } }
      ],
      collegeId: new ObjectId(collegeId)
    }).toArray();

    if (existingUsers.length > 0) {
      const existingEmails = existingUsers.map(u => u.email);
      const existingUsernames = existingUsers.map(u => u.username);
      
      return NextResponse.json(
        { 
          error: 'Some students already exist', 
          duplicates: {
            emails: existingEmails,
            usernames: existingUsernames
          }
        },
        { status: 400 }
      );
    }

    // Hash password and prepare student records
    const studentRecords = await Promise.all(students.map(async (student) => {
      const hashedPassword = await bcrypt.hash(student.password, 10);
      
      return {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        rollNumber: student.rollNumber,
        division: student.division,
        year: student.year,
        course: student.course,
        username: student.username,
        password: hashedPassword,
        collegeId: new ObjectId(collegeId),
        collegeName: college.collegeName,
        status: 'active',
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
    }));

    // Insert all student records
    const result = await db.collection('students').insertMany(studentRecords);

    return NextResponse.json(
      {
        message: 'Student accounts created successfully',
        createdCount: result.insertedCount,
        studentIds: result.insertedIds
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Student creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
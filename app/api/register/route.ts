import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const {
      collegeName,
      registrationNumber,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      principalName,
      principalEmail,
      principalPhone,
      controllerName,
      controllerEmail,
      controllerPhone,
      password,
    } = await request.json();

    // Validate required fields
    if (!collegeName || !registrationNumber || !email || !phoneNumber || !address || 
        !city || !state || !zipCode || !principalName || !principalEmail || !principalPhone ||
        !controllerName || !controllerEmail || !controllerPhone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if college registration number or email already exists
    const existingCollege = await db.collection('colleges').findOne({
      $or: [
        { registrationNumber },
        { email }
      ]
    });

    if (existingCollege) {
      return NextResponse.json(
        { error: 'College registration number or email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new college record
    const result = await db.collection('colleges').insertOne({
      collegeName,
      registrationNumber,
      email,
      phoneNumber,
      address: {
        street: address,
        city,
        state,
        zipCode
      },
      principal: {
        name: principalName,
        email: principalEmail,
        phone: principalPhone
      },
      controller: {
        name: controllerName,
        email: controllerEmail,
        phone: controllerPhone
      },
      password: hashedPassword,
      status: 'pending', // pending, approved, rejected
      registrationDate: new Date(),
      lastUpdated: new Date(),
      verificationStatus: {
        documents: false,
        email: false,
        phone: false
      }
    });

    return NextResponse.json(
      { 
        message: 'College registration submitted successfully',
        collegeId: result.insertedId,
        collegeInfo: {
          collegeName,
          registrationNumber,
          email,
          status: 'pending'
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
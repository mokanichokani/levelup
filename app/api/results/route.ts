import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, SortDirection } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter: Record<string, any> = {};

    if (searchParams.has('studentId')) {
      const studentId = searchParams.get('studentId');
      filter.studentId = ObjectId.isValid(studentId!) ? new ObjectId(studentId!) : studentId;
    }

    if (searchParams.has('className')) filter.className = searchParams.get('className');
    if (searchParams.has('subject')) filter.subject = searchParams.get('subject');
    
    if (searchParams.has('examId')) {
      const examId = searchParams.get('examId');
      filter.examId = ObjectId.isValid(examId!) ? new ObjectId(examId!) : examId;
    }

    if (searchParams.has('teacherId')) {
      const teacherId = searchParams.get('teacherId');
      filter.teacherId = ObjectId.isValid(teacherId!) ? new ObjectId(teacherId!) : teacherId;
    }

    if (searchParams.has('minScore')) {
      filter.score = { $gte: parseInt(searchParams.get('minScore')!) };
    }

    if (searchParams.has('maxScore')) {
      filter.score = { ...(filter.score || {}), $lte: parseInt(searchParams.get('maxScore')!) };
    }

    if (searchParams.has('dateFrom')) {
      filter.examDate = { $gte: new Date(searchParams.get('dateFrom')!) };
    }

    if (searchParams.has('dateTo')) {
      filter.examDate = { ...(filter.examDate || {}), $lte: new Date(searchParams.get('dateTo')!) };
    }

    const client = await clientPromise;
    const db = client.db();

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const sortField = searchParams.get('sortBy') || 'examDate';
    const sortDirection = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const sort: [string, SortDirection] = [sortField, sortDirection];

    const results = await db
      .collection("results")
      .find(filter)
      .sort([sort])
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await db.collection("results").countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      pagination: { total: totalCount, page, limit, totalPages },
      data: results
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // If basic fields exist, treat as insert
    const { Student, Class, Subject, Exam, Score, Grade, Status } = body;

    if (Student && Class && Subject && Exam && Score != null && Grade && Status) {
      const client = await clientPromise;
      const db = client.db();

      const insertResult = await db.collection("results").insertOne({
        Student,
        Class,
        Subject,
        Exam,
        Score,
        Grade,
        Status,
        createdAt: new Date()
      });

      return NextResponse.json({ message: "Result added", id: insertResult.insertedId }, { status: 201 });
    }

    // Otherwise treat as advanced filter query
    const { filters, pagination, sort } = body;
    const queryFilter: Record<string, any> = {};

    if (filters) {
      if (filters.studentId) {
        queryFilter.studentId = ObjectId.isValid(filters.studentId) ? new ObjectId(filters.studentId) : filters.studentId;
      }
      if (filters.className) {
        queryFilter.className = Array.isArray(filters.className)
          ? { $in: filters.className }
          : filters.className;
      }
      if (filters.subject) {
        queryFilter.subject = Array.isArray(filters.subject)
          ? { $in: filters.subject }
          : filters.subject;
      }
      if (filters.examId) {
        queryFilter.examId = ObjectId.isValid(filters.examId)
          ? new ObjectId(filters.examId)
          : filters.examId;
      }
      if (filters.teacherId) {
        queryFilter.teacherId = ObjectId.isValid(filters.teacherId)
          ? new ObjectId(filters.teacherId)
          : filters.teacherId;
      }
      if (filters.minScore != null || filters.maxScore != null) {
        queryFilter.score = {};
        if (filters.minScore != null) queryFilter.score.$gte = filters.minScore;
        if (filters.maxScore != null) queryFilter.score.$lte = filters.maxScore;
      }
      if (filters.dateFrom || filters.dateTo) {
        queryFilter.examDate = {};
        if (filters.dateFrom) queryFilter.examDate.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) queryFilter.examDate.$lte = new Date(filters.dateTo);
      }
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const sortOptions: Record<string, number> = {};
    if (sort?.field) {
      sortOptions[sort.field] = sort.order === 'asc' ? 1 : -1;
    } else {
      sortOptions.examDate = -1;
    }

    const client = await clientPromise;
    const db = client.db();

    const results = await db
      .collection("results")
      .find(queryFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await db.collection("results").countDocuments(queryFilter);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      pagination: { total: totalCount, page, limit, totalPages },
      data: results
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in POST /results:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

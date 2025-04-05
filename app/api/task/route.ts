import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const validStatuses = ["Pending", "In Progress", "Completed", "Cancelled"];

export async function POST(request: Request) {
  try {
    const {
      teacherName,
      subject,
      class: className,
      dateOfExam,
      status,
    } = await request.json();

    if (!teacherName || !subject || !className || !dateOfExam) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: teacherName, subject, class, dateOfExam.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const newTask = {
      teacherName,
      subject,
      class: className,
      dateOfExam: new Date(dateOfExam),
      status: status || "Pending",
      createdAt: new Date(),
    };

    const result = await db.collection("examtasks").insertOne(newTask);

    return NextResponse.json(
      { message: "Exam task created successfully", taskId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const tasks = await db
      .collection("examtasks")
      .find()
      .sort({ dateOfExam: 1 })
      .toArray();

    return NextResponse.json(
      { success: true, count: tasks.length, data: tasks },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Task ID and status are required." },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection("examtasks")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } },
        { returnDocument: "after" }
      );

    if (!result.value) {
      return NextResponse.json(
        { error: "Exam task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task status updated successfully", data: result.value },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

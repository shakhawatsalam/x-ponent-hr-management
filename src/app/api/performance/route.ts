import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // Get token and verify
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // Only Manager and HR can view performances
    if (decoded.role !== "manager" && decoded.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const performances = await prisma.performance.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
          },
        },
      },
      orderBy: {
        assignAt: "desc",
      },
    });

    return NextResponse.json({ performances }, { status: 200 });
  } catch (error) {
    console.error("Get performances error:", error);
    return NextResponse.json(
      { error: "Failed to fetch performances" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token and verify
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // Only Manager can create performance records
    if (decoded.role !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { employeeId, title, assignAt, completedAt, performanceRating } =
      body;

    // Validate required fields
    if (!employeeId || !title || !assignAt) {
      return NextResponse.json(
        { error: "Employee, title, and assignment date are required" },
        { status: 400 }
      );
    }

    // Check if employee exists
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Prepare create data conditionally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createData: any = {
      employeeId,
      title,
      assignAt: new Date(assignAt),
    };

    // Only add completedAt if provided
    if (completedAt) {
      createData.completedAt = new Date(completedAt);
    }

    // Only add performanceRating if provided
    if (
      performanceRating !== null &&
      performanceRating !== undefined &&
      performanceRating !== ""
    ) {
      createData.performanceRating = parseInt(performanceRating);
    }

    // Create performance record
    const performance = await prisma.performance.create({
      data: createData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Task assigned successfully", performance },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create performance error:", error);
    return NextResponse.json(
      { error: "Failed to assign task" },
      { status: 500 }
    );
  }
}

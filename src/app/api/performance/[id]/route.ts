import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get token and verify
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // Only Manager can update performance records
    if (decoded.role !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, assignAt, completedAt, performanceRating } = body;

    // Check if performance record exists
    const performance = await prisma.performance.findUnique({
      where: { id },
    });

    if (!performance) {
      return NextResponse.json(
        { error: "Performance record not found" },
        { status: 404 }
      );
    }

    // Prepare update data conditionally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      title,
      assignAt: new Date(assignAt),
    };

    // Only add completedAt if provided
    if (completedAt) {
      updateData.completedAt = new Date(completedAt);
    } else {
      updateData.completedAt = null;
    }

    // Only add performanceRating if provided
    if (
      performanceRating !== null &&
      performanceRating !== undefined &&
      performanceRating !== ""
    ) {
      updateData.performanceRating = parseInt(performanceRating);
    }

    // Update performance record
    const updatedPerformance = await prisma.performance.update({
      where: { id },
      data: updateData,
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
      {
        message: "Performance updated successfully",
        performance: updatedPerformance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update performance error:", error);
    return NextResponse.json(
      { error: "Failed to update performance" },
      { status: 500 }
    );
  }
}

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // Get all employees (users with role 'employee')
    const employees = await prisma.user.findMany({
      where: {
        role: "employee",
      },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        salary: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error("Get employees error:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

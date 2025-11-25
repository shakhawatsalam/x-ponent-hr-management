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

    // Both HR and Manager can view payrolls
    if (decoded.role !== "hr" && decoded.role !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payrolls = await prisma.payroll.findMany({
      include: {
        payrollFor: {
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
            salary: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ payrolls }, { status: 200 });
  } catch (error) {
    console.error("Get payrolls error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payrolls" },
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

    // Only HR can create payroll records
    if (decoded.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { employeeId, payrollMonth, totalAmount, reduceAmount } = body;

    // Validate required fields
    if (!employeeId || !payrollMonth || totalAmount === undefined) {
      return NextResponse.json(
        { error: "Employee, payroll month, and total amount are required" },
        { status: 400 }
      );
    }

    // Convert YYYY-MM to DateTime (first day of the month)
    const payrollDate = new Date(`${payrollMonth}-01T00:00:00.000Z`);

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

    // Check if payroll already exists for this employee in this month
    // We need to check for any payroll within the same month
    const [year, month] = payrollMonth.split("-").map(Number);
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const existingPayroll = await prisma.payroll.findFirst({
      where: {
        payrollForId: employeeId,
        payrollMonth: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    if (existingPayroll) {
      return NextResponse.json(
        { error: "Payroll already exists for this employee in this month" },
        { status: 400 }
      );
    }

    // Create payroll record
    const payroll = await prisma.payroll.create({
      data: {
        payrollForId: employeeId,
        payrollMonth: payrollDate,
        totalAmount: parseFloat(totalAmount.toString()),
        reduceAmount: reduceAmount ? parseFloat(reduceAmount.toString()) : 0,
        createdById: decoded.userId,
      },
      include: {
        payrollFor: {
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
            salary: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Payroll created successfully", payroll },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create payroll error:", error);
    return NextResponse.json(
      { error: "Failed to create payroll" },
      { status: 500 }
    );
  }
}

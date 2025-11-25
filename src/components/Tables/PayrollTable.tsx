"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Payroll } from "@/types/types";


interface PayrollTableProps {
  payrolls: Payroll[];
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ payrolls }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatMonth = (monthDate: string | Date) => {
    const date =
      typeof monthDate === "string" && monthDate.length === 7
        ? new Date(monthDate + "-01")
        : new Date(monthDate);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <div className='border rounded-lg'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Base Salary</TableHead>
            <TableHead>Deduction</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='text-center py-8'>
                No payroll records found
              </TableCell>
            </TableRow>
          ) : (
            payrolls.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell>
                  <div>
                    <p className='font-medium'>{payroll.payrollFor.name}</p>
                    <p className='text-sm text-gray-500'>
                      {payroll.payrollFor.designation}
                    </p>
                  </div>
                </TableCell>
                <TableCell className='font-medium'>
                  {formatMonth(payroll.payrollMonth)}
                </TableCell>
                <TableCell>
                  {formatCurrency(payroll.payrollFor.salary)}
                </TableCell>
                <TableCell>
                  <span className='text-red-600'>
                    -{formatCurrency(payroll.reduceAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className='font-semibold text-green-600'>
                    {formatCurrency(payroll.totalAmount)}
                  </span>
                </TableCell>
                <TableCell>{payroll.createdBy.name}</TableCell>
                <TableCell>
                  {new Date(payroll.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

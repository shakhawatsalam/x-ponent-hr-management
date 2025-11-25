"use client";

import { Employee } from "@/types/types";
import { DollarSign } from "lucide-react";


interface PayrollCalculationProps {
  employee: Employee;
  attendanceDays: number;
  calculatedPayable: number;
  reduceAmount: string;
  workingDays: number;
}

export const PayrollCalculation: React.FC<PayrollCalculationProps> = ({
  employee,
  attendanceDays,
  calculatedPayable,
  reduceAmount,
  workingDays,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const finalAmount = calculatedPayable - parseFloat(reduceAmount || "0");

  return (
    <>
      {/* Calculation Section */}
      <div className='bg-blue-50 p-4 rounded-lg space-y-3'>
        <h3 className='font-semibold text-blue-900 flex items-center gap-2'>
          <DollarSign className='h-4 w-4' />
          Payroll Calculation
        </h3>

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Base Salary:</span>
            <span className='font-medium'>
              {formatCurrency(employee.salary)}
            </span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Working Days:</span>
            <span className='font-medium'>{workingDays}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Attendance Days:</span>
            <span className='font-medium'>{attendanceDays}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Per Day Salary:</span>
            <span className='font-medium'>
              {formatCurrency(employee.salary / workingDays)}
            </span>
          </div>

          <div className='border-t border-blue-200 pt-2 flex justify-between'>
            <span className='text-gray-600'>Calculated Payable:</span>
            <span className='font-semibold text-green-600'>
              {formatCurrency(calculatedPayable)}
            </span>
          </div>
        </div>
      </div>

      {/* Final Amount */}
      <div className='bg-green-50 p-4 rounded-lg'>
        <div className='flex justify-between items-center'>
          <span className='text-lg font-semibold text-green-900'>
            Final Payable Amount:
          </span>
          <span className='text-2xl font-bold text-green-600'>
            {formatCurrency(finalAmount)}
          </span>
        </div>
      </div>
    </>
  );
};

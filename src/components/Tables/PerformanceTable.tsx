"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EmployeePerformance } from "@/types/types"; // Import the renamed interface

interface PerformanceTableProps {
  performances: EmployeePerformance[]; // Changed from Performance[] to EmployeePerformance[]
  onEdit: (performance: EmployeePerformance) => void; // Changed parameter type
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({
  performances,
  onEdit,
}) => {
  const getRatingBadgeColor = (rating: number | null) => {
    if (!rating) return "bg-gray-100 text-gray-700";
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-blue-100 text-blue-700";
    if (rating >= 2) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusBadge = (completedAt: string | null) => {
    if (!completedAt) {
      return (
        <span className='inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700'>
          In Progress
        </span>
      );
    }
    return (
      <span className='inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700'>
        Completed
      </span>
    );
  };

  return (
    <div className='border rounded-lg'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Task Title</TableHead>
            <TableHead>Assigned Date</TableHead>
            <TableHead>Completed Date</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {performances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='text-center py-8'>
                No performance records found
              </TableCell>
            </TableRow>
          ) : (
            performances.map((performance) => (
              <TableRow key={performance.id}>
                <TableCell>
                  <div>
                    <p className='font-medium'>{performance.employee.name}</p>
                    <p className='text-sm text-gray-500'>
                      {performance.employee.designation}
                    </p>
                  </div>
                </TableCell>
                <TableCell className='font-medium'>
                  {performance.title}
                </TableCell>
                <TableCell>
                  {new Date(performance.assignAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {performance.completedAt
                    ? new Date(performance.completedAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {performance.performanceRating ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRatingBadgeColor(
                        performance.performanceRating
                      )}`}>
                      {performance.performanceRating}/5
                    </span>
                  ) : (
                    <span className='text-gray-400'>Not rated</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(performance.completedAt)}</TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onEdit(performance)}>
                    <Pencil className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

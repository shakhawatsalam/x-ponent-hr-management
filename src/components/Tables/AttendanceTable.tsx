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
import { Pencil, Trash2 } from "lucide-react";
import { Attendance } from "@/types/types";

interface AttendanceTableProps {
  attendances: Attendance[];
  userRole: string;
  onEdit: (attendance: Attendance) => void;
  onDelete: (attendance: Attendance) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendances,
  userRole,
  onEdit,
  onDelete,
}) => {
  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateWorkHours = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diff = checkOutDate.getTime() - checkInDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const isHR = userRole === "hr";

  return (
    <div className='border rounded-lg'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Work Hours</TableHead>
            {isHR && <TableHead className='text-right'>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isHR ? 6 : 5} className='text-center py-8'>
                No attendance records found
              </TableCell>
            </TableRow>
          ) : (
            attendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>
                  <div>
                    <p className='font-medium'>{attendance.employee.name}</p>
                    <p className='text-sm text-gray-500'>
                      {attendance.employee.designation}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(attendance.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <span className='font-medium text-green-600'>
                    {formatTime(attendance.checkIn)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className='font-medium text-red-600'>
                    {formatTime(attendance.checkOut)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className='inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700'>
                    {calculateWorkHours(
                      attendance.checkIn,
                      attendance.checkOut
                    )}
                  </span>
                </TableCell>
                {isHR && (
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(attendance)}>
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onDelete(attendance)}>
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

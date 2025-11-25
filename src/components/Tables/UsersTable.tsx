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
import { User } from "@/types/types";


interface UserTableProps {
  users: User[];
  userRole: string | null;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  userRole,
  onEdit,
  onDelete,
}) => {
  const canManageUsers = userRole === "hr" || userRole === "manager";

  return (
    <div className='border rounded-lg'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            {canManageUsers && (
              <TableHead className='text-right'>Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={canManageUsers ? 6 : 5}
                className='text-center py-8'>
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.designation}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <span className='inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize bg-blue-50 text-blue-700'>
                    {user.role}
                  </span>
                </TableCell>
                {canManageUsers && (
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(user)}>
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onDelete(user)}>
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

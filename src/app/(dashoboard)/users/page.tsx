"use client";

import {  useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { CreateUserFormData, EditUserFormData, User } from "@/types/types";
import { Toast } from "@/components/Toast";
import { UserTable } from "@/components/Tables/UsersTable";
import { DeleteDialog, UserDialog } from "@/components/Dialogs/UserDialogs";

export default function UsersPage() {
  const {
    users,
    loading,
    toast,
    refetch,
    userRole,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // // Add comprehensive debugging
  // useEffect(() => {
  //   console.log("Loading state:", loading);
  //   console.log("User role:", userRole);
  //   console.log("Users data:", users);
  // }, [loading, userRole, users]);

  // Wait for both users data AND user role to be loaded
  const isLoading = loading || userRole === undefined;
  // Handlers
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  // API Operations
  const handleCreateUser = async (
    data: CreateUserFormData | EditUserFormData
  ) => {
    setIsSubmitting(true);
    const success = await createUser(data);
    if (success) {
      setIsCreateModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleUpdateUser = async (
    data: CreateUserFormData | EditUserFormData
  ) => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    const success = await updateUser(selectedUser.id, data);
    if (success) {
      setIsEditModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    const success = await deleteUser(selectedUser.id);
    if (success) {
      setIsDeleteModalOpen(false);
    }
    setIsSubmitting(false);
  };

  // Updated loading state to check both
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }
  if (userRole == null) {
    refetch();
  }
  const canManageUsers = userRole === "hr" || userRole === "manager";

  return (
    <div className='p-6'>
      <Toast toast={toast} />

      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>User Management</h1>
        {canManageUsers && (
          <Button onClick={handleCreateNew}>
            <Plus className='mr-2 h-4 w-4' /> Add User
          </Button>
        )}
      </div>

      {/* Table */}
      <UserTable
        users={users}
        userRole={userRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      {canManageUsers && (
        <>
          <UserDialog
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            isSubmitting={isSubmitting}
            onSubmit={handleCreateUser}
            onCancel={() => setIsCreateModalOpen(false)}
          />

          <UserDialog
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            user={selectedUser as User}
            isEdit={true}
            isSubmitting={isSubmitting}
            onSubmit={handleUpdateUser}
            onCancel={() => setIsEditModalOpen(false)}
          />

          <DeleteDialog
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            user={selectedUser}
            isSubmitting={isSubmitting}
            onConfirm={handleDeleteUser}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}

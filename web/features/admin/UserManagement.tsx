'use client';

import { useState } from 'react';
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/lib/api/adminApi';
import { AdminUser, UserRole } from '@/types';
import {
  FiUsers,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiShield,
  FiUser,
  FiAlertTriangle,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

export function UserManagement() {
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-fadeIn">
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-muted-foreground text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = 'status' in error
      ? `Error ${error.status}: ${JSON.stringify(error.data)}`
      : 'message' in error ? error.message : 'Unknown error';

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-destructive/10 border border-destructive/20 rounded-2xl p-8 max-w-md animate-fadeIn">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive font-semibold mb-2">Failed to load users</p>
          <details className="text-xs text-left bg-background/50 rounded p-2">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 overflow-auto">{errorMessage}</pre>
          </details>
        </div>
      </div>
    );
  }

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const handleRoleToggle = async (user: AdminUser) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await updateUser({ id: user.id, data: { role: newRole } }).unwrap();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleEditStart = (user: AdminUser) => {
    setEditingUser(user);
    setEditName(user.name);
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    try {
      await updateUser({ id: editingUser.id, data: { name: editName } }).unwrap();
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FiUsers className="w-6 h-6 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border/70 bg-card/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Items
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Purchases
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Last Active
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Joined
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            onClick={handleEditSave}
                            className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium text-foreground">{user.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRoleToggle(user)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors',
                          user.role === 'admin'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'bg-accent text-muted-foreground hover:bg-accent/80'
                        )}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <FiShield className="w-3 h-3" />
                            Admin
                          </>
                        ) : (
                          <>
                            <FiUser className="w-3 h-3" />
                            User
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user.totalInventoryItems}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user.totalPurchases}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.lastActivityAt
                        ? new Date(user.lastActivityAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditStart(user)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirmId === user.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Confirm delete"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(user.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

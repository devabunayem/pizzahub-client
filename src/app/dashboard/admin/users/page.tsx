'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Search, Filter, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManageUsersPage() {
  const { user: currentAdmin, token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [blockModal, setBlockModal] = useState<{
    isOpen: boolean;
    user: any | null;
    loading: boolean;
  }>({
    isOpen: false,
    user: null,
    loading: false,
  });

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (roleFilter !== 'all') params.append('role', roleFilter);

      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleInitiateBlock = (targetUser: any) => {
    if (targetUser._id === currentAdmin?._id) {
      toast.error('You cannot block your own admin account.');
      return;
    }
    setBlockModal({
      isOpen: true,
      user: targetUser,
      loading: false,
    });
  };

  const confirmToggleBlock = async () => {
    const targetUser = blockModal.user;
    if (!targetUser) return;

    setBlockModal((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading(`Updating status for ${targetUser.email}...`);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${targetUser._id}/block`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message, { id: toastId });
        setBlockModal({ isOpen: false, user: null, loading: false });
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to update user block status.', { id: toastId });
        setBlockModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      toast.error('Network error updating user.', { id: toastId });
      setBlockModal((prev) => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} columns={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
          Access Control
        </span>
        <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
          User Directory
        </h1>
        <p className="mt-1 text-sm text-[#6E6259]">
          Search registered accounts, filter by customer or vendor role, and manage platform permissions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="relative w-full flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
          />
        </form>

        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <Filter className="h-4 w-4 shrink-0 text-[#9A4A12]" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-xs font-bold text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none sm:w-auto"
          >
            <option value="all">All roles</option>
            <option value="vendor">Vendors</option>
            <option value="customer">Customers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="space-y-2 rounded-3xl border border-stone-200 bg-white py-16 text-center shadow-sm">
          <Users className="mx-auto h-8 w-8 text-[#9A4A12]" />
          <h3 className="text-base font-extrabold text-[#18120E]">No users found</h3>
          <p className="text-xs text-[#6E6259]">Try different search keywords or role filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-[#6E6259]">
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Subscription</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {users.map((u) => {
                  const isCurrent = u._id === currentAdmin?._id;

                  return (
                    <tr key={u._id} className="transition-colors hover:bg-[#FAF7F2]/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name}
                              className="h-9 w-9 shrink-0 rounded-full border border-stone-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D91E18] text-xs font-bold uppercase text-white">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="flex items-center font-bold text-[#18120E]">
                              {u.name}
                              {isCurrent && (
                                <span className="ml-1.5 rounded-full border border-stone-200 bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-bold text-[#9A4A12]">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 flex items-center text-[11px] text-[#6E6259]">
                              <Mail className="mr-1 h-3 w-3 text-stone-400" />
                              <span>{u.email}</span>
                            </p>
                            {u.role === 'vendor' && u.businessName && (
                              <p className="mt-0.5 text-[11px] font-semibold text-[#9A4A12]">
                                {u.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full border border-stone-200 bg-[#FAF7F2] px-2.5 py-0.5 text-[11px] font-bold capitalize text-[#18120E]">
                          {u.role}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        {u.role === 'vendor' ? (
                          <span
                            className={`text-xs font-bold capitalize ${
                              u.subscriptionPlan === 'premium'
                                ? 'text-[#9A4A12]'
                                : 'text-[#6E6259]'
                            }`}
                          >
                            {u.subscriptionPlan === 'premium' ? 'Premium partner' : 'Free tier'}
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-[#D91E18]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D91E18]" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 font-mono text-[11px] text-[#6E6259] tabular-nums">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleInitiateBlock(u)}
                            className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${
                              u.isBlocked
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                : 'border-stone-200 bg-[#FAF7F2] text-[#18120E] hover:border-red-200 hover:bg-red-50 hover:text-[#D91E18]'
                            }`}
                          >
                            {u.isBlocked ? 'Unblock user' : 'Block user'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={blockModal.isOpen}
        loading={blockModal.loading}
        onClose={() => setBlockModal({ isOpen: false, user: null, loading: false })}
        onConfirm={confirmToggleBlock}
        title={blockModal.user?.isBlocked ? 'Unblock platform account' : 'Block user account'}
        message={
          blockModal.user?.isBlocked
            ? `Are you sure you want to restore access for "${blockModal.user?.email}"? They will regain access to their dashboard.`
            : `Are you sure you want to block "${blockModal.user?.email}"? They will immediately be logged out and prohibited from logging in or using any platform services.`
        }
        confirmText={blockModal.user?.isBlocked ? 'Confirm unblock' : 'Block account'}
        variant={blockModal.user?.isBlocked ? 'warning' : 'danger'}
      />
    </div>
  );
}

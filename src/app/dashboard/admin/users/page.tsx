'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Search,
  Filter,
  Shield,
  Ban,
  CheckCircle,
  Mail,
  Store,
  User as UserIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManageUsersPage() {
  const { user: currentAdmin, token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

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

  const handleToggleBlock = async (targetUser: any) => {
    if (targetUser._id === currentAdmin?._id) {
      toast.error('You cannot block your own admin account.');
      return;
    }

    const action = targetUser.isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${targetUser.email}?`)) return;

    const toastId = toast.loading(`Updating status for ${targetUser.email}...`);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${targetUser._id}/block`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message, { id: toastId });
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to update user block status.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error updating user.', { id: toastId });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading user directory..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          User directory
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Search registered accounts, filter by customer or vendor role, and manage platform permissions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-2 px-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 cursor-pointer w-full sm:w-auto"
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
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
          <Users className="w-8 h-8 mx-auto text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">No users found</h3>
          <p className="text-stone-500 text-xs">Try different search keywords or role filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-5">Role</th>
                  <th className="py-3 px-5">Subscription</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Registered</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {users.map((u) => {
                  const isCurrent = u._id === currentAdmin?._id;

                  return (
                    <tr key={u._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center font-medium text-xs uppercase shrink-0">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-stone-900 dark:text-stone-100 flex items-center">
                              {u.name}
                              {isCurrent && (
                                <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-stone-400 flex items-center mt-0.5">
                              <Mail className="w-3 h-3 mr-1 text-stone-400" />
                              <span>{u.email}</span>
                            </p>
                            {u.role === 'vendor' && u.businessName && (
                              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                                {u.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        {u.role === 'vendor' ? (
                          <span
                            className={`text-xs capitalize font-medium ${
                              u.subscriptionPlan === 'premium'
                                ? 'text-amber-700 dark:text-amber-400 font-semibold'
                                : 'text-stone-500'
                            }`}
                          >
                            {u.subscriptionPlan === 'premium' ? 'Premium partner' : 'Free tier'}
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-stone-500 font-mono text-[11px] tabular-nums">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        {!isCurrent && (
                          <button
                            onClick={() => handleToggleBlock(u)}
                            className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors cursor-pointer border ${
                              u.isBlocked
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/40'
                                : 'bg-stone-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
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
    </div>
  );
}

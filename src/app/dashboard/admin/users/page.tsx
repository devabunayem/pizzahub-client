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
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          Manage Platform Users
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Search registered accounts, filter by role, and manage access permissions or block malicious users.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Roles</option>
            <option value="vendor">Vendors Only</option>
            <option value="customer">Customers Only</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
          <Users className="w-12 h-12 mx-auto text-stone-400" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">No users found</h3>
          <p className="text-stone-500 text-xs">Try different search keywords or role filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-4 px-6">User Details</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Subscription</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Registered</th>
                  <th className="py-4 px-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                {users.map((u) => {
                  const isCurrent = u._id === currentAdmin?._id;

                  return (
                    <tr key={u._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-pizza-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-stone-900 dark:text-white flex items-center">
                              {u.name}
                              {isCurrent && (
                                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-stone-400 flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-stone-400" />
                              <span>{u.email}</span>
                            </p>
                            {u.role === 'vendor' && u.businessName && (
                              <p className="text-[11px] text-pizza-600 dark:text-pizza-400 font-medium mt-0.5">
                                🏪 {u.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            u.role === 'admin'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : u.role === 'vendor'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {u.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {u.role === 'vendor' && <Store className="w-3 h-3 mr-1" />}
                          {u.role === 'customer' && <UserIcon className="w-3 h-3 mr-1" />}
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {u.role === 'vendor' ? (
                          <span
                            className={`text-xs font-bold capitalize ${
                              u.subscriptionPlan === 'premium'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-stone-500'
                            }`}
                          >
                            {u.subscriptionPlan === 'premium' ? '⭐ Premium' : 'Free Tier'}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                            <Ban className="w-3 h-3 mr-1" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-xs text-stone-500">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {!isCurrent && (
                          <button
                            onClick={() => handleToggleBlock(u)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                              u.isBlocked
                                ? 'bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'
                                : 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300'
                            }`}
                          >
                            {u.isBlocked ? 'Unblock User' : 'Block User'}
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

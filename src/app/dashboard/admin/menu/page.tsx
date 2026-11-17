'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  UtensilsCrossed,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  MapPin,
  Clock,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminManageMenuPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const res = await fetch(`${API_BASE}/admin/menu-items?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin menu items:', err);
      toast.error('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const handleUpdateStatus = async (itemId: string, status: string) => {
    const toastId = toast.loading(`Updating status to ${status}...`);

    try {
      const res = await fetch(`${API_BASE}/menu/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Item status updated to ${status}!`, { id: toastId });
        fetchItems();
      } else {
        toast.error(data.message || 'Failed to update item.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error updating item status.', { id: toastId });
    }
  };

  const handleDelete = async (itemId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    const toastId = toast.loading('Deleting menu item...');
    try {
      const res = await fetch(`${API_BASE}/menu/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Item deleted successfully.', { id: toastId });
        fetchItems();
      } else {
        toast.error(data.message || 'Failed to delete item.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error deleting item.', { id: toastId });
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} columns={5} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Menu moderation
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Review pending pizzas, approve or reject submissions, and manage catalogue items.
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
            placeholder="Search pizza items by name..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All statuses</option>
            <option value="pending">Pending approval</option>
            <option value="approved">Approved & active</option>
            <option value="rejected">Rejected</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
          <UtensilsCrossed className="w-8 h-8 mx-auto text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            No menu items found
          </h3>
          <p className="text-stone-500 text-xs">Try different search keywords or status filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Dish</th>
                  <th className="py-3 px-5">Kitchen</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                          alt={item.itemName}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800"
                        />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">
                            {item.itemName}
                          </p>
                          <span className="text-[11px] text-stone-400">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen'}
                      </p>
                      <p className="text-[11px] text-stone-400 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1 text-stone-400" />
                        <span>{item.location}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-5 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                      {formatPrice(item.price)}
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${
                          item.status === 'approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                            : item.status === 'pending'
                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
                            : item.status === 'rejected'
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/40'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'approved'
                              ? 'bg-emerald-500'
                              : item.status === 'pending'
                              ? 'bg-amber-500'
                              : item.status === 'rejected'
                              ? 'bg-red-500'
                              : 'bg-stone-400'
                          }`}
                        />
                        <span className="capitalize">{item.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right space-x-1.5">
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'approved')}
                            className="px-2.5 py-1 rounded-md bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'rejected')}
                            className="px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 text-stone-600 dark:text-stone-300 font-medium text-xs transition-colors inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {item.status === 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'inactive')}
                          className="px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium cursor-pointer"
                        >
                          Deactivate
                        </button>
                      )}

                      {item.status === 'inactive' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'approved')}
                          className="px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer"
                        >
                          Reactivate
                        </button>
                      )}

                      <Link
                        href={`/menu/${item._id}`}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 inline-flex transition-colors"
                        title="View public page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(item._id, item.itemName)}
                        className="p-1 rounded-md text-stone-400 hover:text-red-600 inline-flex transition-colors cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

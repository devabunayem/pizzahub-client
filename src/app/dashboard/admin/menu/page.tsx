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
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

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
    return <LoadingSpinner message="Retrieving submitted pizzas for moderation..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          Manage Menu Items
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Review pending pizzas, approve or reject submissions, and delete non-compliant listings.
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
            placeholder="Search pizza items by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved & Active</option>
            <option value="rejected">Rejected</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-stone-400" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            No menu items found
          </h3>
          <p className="text-stone-500 text-xs">Try different search keywords or status filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Pizza Details</th>
                  <th className="py-4 px-6">Vendor Kitchen</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                          alt={item.itemName}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                        />
                        <div>
                          <p className="font-bold text-stone-900 dark:text-white">
                            {item.itemName}
                          </p>
                          <span className="text-[11px] font-medium text-stone-500">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-stone-900 dark:text-white">
                        {item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen'}
                      </p>
                      <p className="text-xs text-stone-400 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-pizza-500" />
                        <span>{item.location}</span>
                      </p>
                    </td>

                    <td className="py-4 px-6 font-black text-pizza-600">
                      {formatPrice(item.price)}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          item.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300'
                            : item.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : item.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
                        }`}
                      >
                        {item.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                        {item.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1" />}
                        {item.status === 'rejected' && <XCircle className="w-3.5 h-3.5 mr-1" />}
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-1.5">
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'approved')}
                            className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition-colors inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-bold text-xs transition-colors inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {item.status === 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'inactive')}
                          className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold"
                        >
                          Deactivate
                        </button>
                      )}

                      {item.status === 'inactive' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'approved')}
                          className="px-2.5 py-1.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold"
                        >
                          Reactivate
                        </button>
                      )}

                      <Link
                        href={`/menu/${item._id}`}
                        className="p-1.5 rounded-xl text-stone-500 hover:text-pizza-600 inline-flex transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(item._id, item.itemName)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 inline-flex transition-colors"
                        title="Delete Permanently"
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

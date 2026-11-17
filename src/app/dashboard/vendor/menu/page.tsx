'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  PlusCircle,
  Eye,
  Trash2,
  Power,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MyMenuItemsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/menu/vendor/my-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
      toast.error('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token]);

  const toggleAvailability = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'approved' ? 'inactive' : 'approved';
    const toastId = toast.loading('Updating status...');

    try {
      const res = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Item marked as ${nextStatus}.`, { id: toastId });
        fetchItems();
      } else {
        toast.error(data.message || 'Failed to update status.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error updating item status.', { id: toastId });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;

    const toastId = toast.loading('Deleting menu item...');
    try {
      const res = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Item deleted.', { id: toastId });
        fetchItems();
      } else {
        toast.error(data.message || 'Failed to delete item.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error deleting item.', { id: toastId });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your menu..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-white tracking-tight">
            Menu listings
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your kitchen offerings, check approval status, and toggle availability.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-item"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-medium self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add item</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#19191b] rounded-xl border border-black/[0.06] dark:border-white/[0.08] space-y-3">
          <UtensilsCrossed className="w-8 h-8 mx-auto text-stone-400" />
          <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
            No items listed yet
          </p>
          <Link
            href="/dashboard/vendor/add-item"
            className="inline-block px-3 py-1.5 rounded bg-stone-900 text-white text-xs font-medium"
          >
            Add first item
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#19191b] rounded-xl border border-black/[0.06] dark:border-white/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.08] bg-stone-50 dark:bg-white/[0.02] text-stone-500 font-medium">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                          alt={item.itemName}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-white">
                            {item.itemName}
                          </p>
                          <p className="text-[11px] text-stone-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-0.5 text-stone-400" />
                            <span>{item.location}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-600 dark:text-stone-300">
                      {item.category}
                    </td>

                    <td className="py-3 px-4 tabular-nums font-medium text-stone-900 dark:text-white">
                      {formatPrice(item.price)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                          item.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                            : item.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                            : item.status === 'inactive'
                            ? 'bg-stone-100 text-stone-600 dark:bg-white/[0.05] dark:text-stone-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      <Link
                        href={`/menu/${item._id}`}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 inline-flex"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {(item.status === 'approved' || item.status === 'inactive') && (
                        <button
                          onClick={() => toggleAvailability(item._id, item.status)}
                          className={`p-1 rounded inline-flex ${
                            item.status === 'approved'
                              ? 'text-stone-600 hover:text-stone-900'
                              : 'text-stone-400 hover:text-stone-600'
                          }`}
                          title={item.status === 'approved' ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(item._id, item.itemName)}
                        className="p-1 rounded text-stone-400 hover:text-red-600 inline-flex"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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

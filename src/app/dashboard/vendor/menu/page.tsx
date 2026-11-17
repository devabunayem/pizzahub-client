'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  UtensilsCrossed,
  PlusCircle,
  Eye,
  Trash2,
  Power,
  Sparkles,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
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
    const toastId = toast.loading('Updating item status...');

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
        toast.success(`Item marked as ${nextStatus}!`, { id: toastId });
        fetchItems();
      } else {
        toast.error(data.message || 'Failed to update status.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error updating item status.', { id: toastId });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    const toastId = toast.loading('Deleting menu item...');
    try {
      const res = await fetch(`${API_BASE}/menu/${id}`, {
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
    return <LoadingSpinner message="Loading your restaurant menu..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            My Menu Items
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your published pizzas, track admin approval statuses, and toggle availability.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-item"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md shadow-pizza-500/20 transition-all shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Pizza</span>
        </Link>
      </div>

      {/* Items Table / Cards */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-pizza-50 dark:bg-pizza-950/60 text-pizza-500 flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            No pizzas added yet
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs max-w-sm mx-auto">
            Get started by adding your first wood-fired pizza with an appetizing photo and recipe details.
          </p>
          <Link
            href="/dashboard/vendor/add-item"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-pizza-600 text-white font-bold text-xs shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            <span>Add First Menu Item</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Pizza Item</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Approval Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
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
                          <p className="text-xs text-stone-400 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-1 text-pizza-500" />
                            <span>{item.location}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-stone-600 dark:text-stone-300">
                      {item.category}
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
                            : item.status === 'inactive'
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {item.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                        {item.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1" />}
                        {item.status === 'rejected' && <XCircle className="w-3.5 h-3.5 mr-1" />}
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/menu/${item._id}`}
                        className="p-2 rounded-xl text-stone-500 hover:text-pizza-600 hover:bg-stone-100 dark:hover:bg-stone-800 inline-flex transition-colors"
                        title="View Public Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Availability toggle for approved or inactive items */}
                      {(item.status === 'approved' || item.status === 'inactive') && (
                        <button
                          onClick={() => toggleAvailability(item._id, item.status)}
                          className={`p-2 rounded-xl inline-flex transition-colors ${
                            item.status === 'approved'
                              ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40'
                              : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                          title={item.status === 'approved' ? 'Mark Inactive' : 'Activate Item'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(item._id, item.itemName)}
                        className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 inline-flex transition-colors"
                        title="Delete Item"
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

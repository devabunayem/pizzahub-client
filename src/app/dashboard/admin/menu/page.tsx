'use client';

import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

export default function AdminManageMenuPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const inFlightRef = useRef<Set<string>>(new Set());
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string;
    name: string;
    loading: boolean;
  }>({
    isOpen: false,
    itemId: '',
    name: '',
    loading: false,
  });

  const fetchItems = async () => {
    const liveToken =
      typeof window !== 'undefined' ? localStorage.getItem('pizzahub_token') : token;
    if (!liveToken) return;
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);

      const res = await fetch(`${API_BASE}/admin/menu-items?${params.toString()}`, {
        headers: { Authorization: `Bearer ${liveToken}` },
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
  }, [token, statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const handleUpdateStatus = async (itemId: string, status: string) => {
    const liveToken =
      typeof window !== 'undefined' ? localStorage.getItem('pizzahub_token') : token;
    if (!liveToken) {
      toast.error('Session expired. Please sign in again.');
      return;
    }
    if (inFlightRef.current.has(itemId)) return;

    inFlightRef.current.add(itemId);
    setUpdatingIds((prev) => ({ ...prev, [itemId]: true }));
    const toastId = toast.loading(`Updating status to ${status}...`);

    try {
      const res = await fetch(`${API_BASE}/menu/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${liveToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Item status updated to ${status}!`, { id: toastId });
        await fetchItems();
      } else {
        toast.error(data.message || 'Failed to update item.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error updating item status.', { id: toastId });
    } finally {
      inFlightRef.current.delete(itemId);
      setUpdatingIds((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.itemId) return;
    const liveToken =
      typeof window !== 'undefined' ? localStorage.getItem('pizzahub_token') : token;
    if (!liveToken) {
      toast.error('Session expired. Please sign in again.');
      setDeleteModal({ isOpen: false, itemId: '', name: '', loading: false });
      return;
    }

    setDeleteModal((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading('Deleting menu item...');
    try {
      const res = await fetch(`${API_BASE}/menu/${deleteModal.itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${liveToken}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Item deleted successfully.', { id: toastId });
        setDeleteModal({ isOpen: false, itemId: '', name: '', loading: false });
        fetchItems();
      } else {
        toast.error(data.message || 'Failed to delete item.', { id: toastId });
        setDeleteModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      toast.error('Network error deleting item.', { id: toastId });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} columns={5} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
          Quality Control
        </span>
        <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
          Menu Moderation
        </h1>
        <p className="mt-1 text-sm text-[#6E6259]">
          Review pending pizzas, approve or reject submissions, and manage catalogue items.
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
            placeholder="Search pizza items by name..."
            className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
          />
        </form>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 shrink-0 text-[#9A4A12]" />
            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-xs font-bold text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none sm:w-auto"
            >
              <option value="All">All categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-xs font-bold text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none sm:w-auto"
          >
            <option value="All">All statuses</option>
            <option value="pending">Pending approval</option>
            <option value="approved">Approved &amp; active</option>
            <option value="rejected">Rejected</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="space-y-2 rounded-3xl border border-stone-200 bg-white py-16 text-center shadow-sm">
          <UtensilsCrossed className="mx-auto h-8 w-8 text-[#9A4A12]" />
          <h3 className="text-base font-extrabold text-[#18120E]">
            No menu items found
          </h3>
          <p className="text-xs text-[#6E6259]">Try different search keywords or status filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-[#6E6259]">
                  <th className="px-5 py-3.5">Dish</th>
                  <th className="px-5 py-3.5">Kitchen</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {items.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-[#FAF7F2]/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images?.[0] || '/images/cat-classic.jpg'}
                          alt={item.itemName}
                          className="h-12 w-12 shrink-0 rounded-xl border border-stone-200 bg-[#FAF7F2] object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-[#18120E]">
                            {item.itemName}
                          </p>
                          <span className="text-[11px] font-medium text-[#6E6259]">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[#18120E]">
                        {item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen'}
                      </p>
                      <p className="mt-0.5 flex items-center text-[11px] text-[#6E6259]">
                        <MapPin className="mr-1 h-3 w-3 text-[#D91E18]" />
                        <span>{item.location}</span>
                      </p>
                    </td>

                    <td className="font-display px-5 py-3.5 text-base text-[#D91E18] tabular-nums">
                      {formatPrice(item.price)}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          item.status === 'approved'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : item.status === 'pending'
                            ? 'border-amber-200 bg-amber-50 text-[#9A4A12]'
                            : item.status === 'rejected'
                            ? 'border-red-200 bg-red-50 text-[#D91E18]'
                            : 'border-stone-200 bg-[#FAF7F2] text-[#6E6259]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.status === 'approved'
                              ? 'bg-emerald-500'
                              : item.status === 'pending'
                              ? 'bg-amber-500'
                              : item.status === 'rejected'
                              ? 'bg-[#D91E18]'
                              : 'bg-stone-400'
                          }`}
                        />
                        <span className="capitalize">{item.status}</span>
                      </span>
                    </td>

                    <td className="space-x-1.5 px-5 py-3.5 text-right">
                      {item.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            disabled={Boolean(updatingIds[item._id])}
                            onClick={() => handleUpdateStatus(item._id, 'approved')}
                            className="inline-flex cursor-pointer items-center space-x-1 rounded-xl bg-[#18120E] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#D91E18] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            disabled={Boolean(updatingIds[item._id])}
                            onClick={() => handleUpdateStatus(item._id, 'rejected')}
                            className="inline-flex cursor-pointer items-center space-x-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-[#D91E18] transition-colors hover:bg-[#D91E18] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {item.status === 'approved' && (
                        <button
                          type="button"
                          disabled={Boolean(updatingIds[item._id])}
                          onClick={() => handleUpdateStatus(item._id, 'inactive')}
                          className="cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#6E6259] hover:border-[#18120E] hover:text-[#18120E] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      )}

                      {item.status === 'inactive' && (
                        <button
                          type="button"
                          disabled={Boolean(updatingIds[item._id])}
                          onClick={() => handleUpdateStatus(item._id, 'approved')}
                          className="cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#18120E] hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reactivate
                        </button>
                      )}

                      <Link
                        href={`/menu/${item._id}`}
                        className="inline-flex rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-[#FAF7F2] hover:text-[#18120E]"
                        title="View public page"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            itemId: item._id,
                            name: item.itemName,
                            loading: false,
                          })
                        }
                        className="inline-flex cursor-pointer rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-[#D91E18]"
                        title="Delete permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        loading={deleteModal.loading}
        onClose={() =>
          setDeleteModal({ isOpen: false, itemId: '', name: '', loading: false })
        }
        onConfirm={confirmDelete}
        title="Permanently delete pizza listing"
        message={`Are you sure you want to permanently remove "${deleteModal.name}" from the platform? This cannot be undone.`}
        confirmText="Delete permanently"
        variant="danger"
      />
    </div>
  );
}

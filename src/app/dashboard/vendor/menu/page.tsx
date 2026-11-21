'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  PlusCircle,
  Eye,
  Trash2,
  Power,
  Pencil,
  X,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const VALID_CATEGORIES = [
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

export default function MyMenuItemsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
    loading: boolean;
  }>({
    isOpen: false,
    id: '',
    name: '',
    loading: false,
  });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: any | null;
    loading: boolean;
  }>({
    isOpen: false,
    item: null,
    loading: false,
  });

  const [editForm, setEditForm] = useState({
    itemName: '',
    description: '',
    price: '',
    category: 'Classic Pizzas',
    location: '',
  });

  const handleOpenEdit = (item: any) => {
    setEditForm({
      itemName: item.itemName,
      description: item.description,
      price: item.price.toString(),
      category: item.category || 'Classic Pizzas',
      location: item.location,
    });
    setEditModal({
      isOpen: true,
      item,
      loading: false,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.item) return;

    const cleanName = editForm.itemName.trim();
    const cleanDescription = editForm.description.trim();
    const cleanLocation = editForm.location.trim();
    const numPrice = parseFloat(editForm.price);

    if (!cleanName || !cleanDescription || !cleanLocation) {
      toast.error('Item name, location, and description cannot be blank.');
      return;
    }

    if (!Number.isFinite(numPrice) || numPrice <= 0 || numPrice > 10000) {
      toast.error('Price must be between $0.01 and $10,000.');
      return;
    }

    setEditModal((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading('Updating menu item...');

    try {
      const res = await fetch(`${API_BASE}/menu/${editModal.item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName: cleanName,
          description: cleanDescription,
          price: numPrice,
          category: editForm.category,
          location: cleanLocation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Menu item updated successfully.', { id: toastId });
        setEditModal({ isOpen: false, item: null, loading: false });
        fetchItems();
      } else {
        toast.error(data.message || 'Failed to update item.', { id: toastId });
        setEditModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      toast.error('Network error updating item.', { id: toastId });
      setEditModal((prev) => ({ ...prev, loading: false }));
    }
  };

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

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading('Deleting menu item...');
    try {
      const res = await fetch(`${API_BASE}/menu/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Item deleted successfully.', { id: toastId });
        setDeleteModal({ isOpen: false, id: '', name: '', loading: false });
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
    return <TableSkeleton rows={5} columns={5} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
            Kitchen Catalogue
          </span>
          <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
            Menu Listings
          </h1>
          <p className="mt-1 text-sm text-[#6E6259]">
            Manage your kitchen offerings, check approval status, and toggle availability.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-item"
          className="inline-flex shrink-0 items-center space-x-1.5 self-start rounded-full bg-[#D91E18] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#b81712] sm:self-auto"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Item</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="space-y-3 rounded-3xl border border-stone-200 bg-white py-16 text-center shadow-sm">
          <UtensilsCrossed className="mx-auto h-8 w-8 text-[#9A4A12]" />
          <p className="text-base font-extrabold text-[#18120E]">
            No items listed yet
          </p>
          <Link
            href="/dashboard/vendor/add-item"
            className="inline-block rounded-full bg-[#18120E] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#D91E18]"
          >
            Add First Item
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-[#6E6259]">
                  <th className="px-5 py-3.5">Item</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-[#FAF7F2]/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images?.[0] || '/images/cat-classic.jpg'}
                          alt={item.itemName}
                          className="h-11 w-11 rounded-xl border border-stone-200 object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-[#18120E]">
                            {item.itemName}
                          </p>
                          <p className="flex items-center text-[11px] text-[#6E6259]">
                            <MapPin className="mr-1 h-3 w-3 text-[#D91E18]" />
                            <span>{item.location}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-medium text-[#6E6259]">
                      {item.category}
                    </td>

                    <td className="font-display px-5 py-3.5 text-base text-[#D91E18] tabular-nums">
                      {formatPrice(item.price)}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                          item.status === 'approved'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : item.status === 'pending'
                            ? 'border-amber-200 bg-amber-50 text-[#9A4A12]'
                            : item.status === 'inactive'
                            ? 'border-stone-200 bg-[#FAF7F2] text-[#6E6259]'
                            : 'border-red-200 bg-red-50 text-[#D91E18]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="space-x-1 px-5 py-3.5 text-right">
                      <Link
                        href={`/menu/${item._id}`}
                        className="inline-flex rounded-lg p-1.5 text-stone-500 transition hover:bg-[#FAF7F2] hover:text-[#18120E]"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex cursor-pointer rounded-lg p-1.5 text-stone-500 transition hover:bg-[#FAF7F2] hover:text-[#9A4A12]"
                        title="Edit listing"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {(item.status === 'approved' || item.status === 'inactive') && (
                        <button
                          type="button"
                          onClick={() => toggleAvailability(item._id, item.status)}
                          className={`inline-flex cursor-pointer rounded-lg p-1.5 transition hover:bg-[#FAF7F2] ${
                            item.status === 'approved'
                              ? 'text-emerald-600 hover:text-emerald-800'
                              : 'text-stone-400 hover:text-[#18120E]'
                          }`}
                          title={item.status === 'approved' ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            id: item._id,
                            name: item.itemName,
                            loading: false,
                          })
                        }
                        className="inline-flex cursor-pointer rounded-lg p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-[#D91E18]"
                        title="Delete"
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

      {/* Edit Menu Item Modal */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#18120E]/55 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!editModal.loading) setEditModal({ isOpen: false, item: null, loading: false });
          }}
        >
          <div
            className="w-full max-w-lg space-y-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-[0_28px_60px_-20px_rgba(24,18,14,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-[#18120E]">
                  Edit Menu Item
                </h3>
                <p className="mt-0.5 text-xs text-[#6E6259]">
                  Update item details, pricing, and category
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditModal({ isOpen: false, item: null, loading: false })}
                disabled={editModal.loading}
                className="rounded-xl p-1.5 text-stone-400 transition hover:bg-[#FAF7F2] hover:text-[#18120E] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.itemName}
                  onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="10000"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                    Category *
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none"
                  >
                    {VALID_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Kitchen Location *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 border-t border-stone-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, item: null, loading: false })}
                  disabled={editModal.loading}
                  className="cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-4 py-2.5 text-xs font-bold text-[#18120E] transition hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editModal.loading}
                  className="cursor-pointer rounded-xl bg-[#D91E18] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#b81712] disabled:opacity-50"
                >
                  {editModal.loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        loading={deleteModal.loading}
        onClose={() =>
          setDeleteModal({ isOpen: false, id: '', name: '', loading: false })
        }
        onConfirm={confirmDelete}
        title="Delete pizza listing"
        message={`Are you sure you want to permanently remove "${deleteModal.name}" from your menu? This action cannot be reversed.`}
        confirmText="Delete permanently"
        variant="danger"
      />
    </div>
  );
}

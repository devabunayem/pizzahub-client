'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  MessageSquare,
  CheckCircle2,
  XCircle,
  User,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderListSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VendorOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const inFlightRef = useRef<Set<string>>(new Set());
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch vendor orders:', err);
      toast.error('Failed to load incoming orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleUpdateStatus = async (orderId: string, status: 'accepted' | 'rejected') => {
    if (!token || inFlightRef.current.has(orderId)) return;

    inFlightRef.current.add(orderId);
    setUpdatingIds((prev) => ({ ...prev, [orderId]: true }));
    const toastId = toast.loading(`Marking order as ${status}...`);

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Order #${orderId.slice(-6)} has been ${status}!`, { id: toastId });
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
        await fetchOrders();
      } else {
        toast.error(data.message || 'Failed to update order status.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error updating order.', { id: toastId });
    } finally {
      inFlightRef.current.delete(orderId);
      setUpdatingIds((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    }
  };

  if (loading) {
    return <OrderListSkeleton count={4} withFilterTabs />;
  }

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
            Kitchen Queue
          </span>
          <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
            Incoming Orders
          </h1>
          <p className="mt-1 text-sm text-[#6E6259]">
            Review incoming orders, verify scheduled delivery times, and update status.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex items-center gap-1 self-start rounded-full border border-stone-200 bg-white p-1 shadow-sm sm:self-auto">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition-colors ${
                filter === tab
                  ? 'bg-[#18120E] text-white'
                  : 'text-[#6E6259] hover:text-[#18120E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="space-y-2 rounded-3xl border border-stone-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#9A4A12]">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#18120E]">
            No {filter !== 'all' ? filter : ''} orders
          </h3>
          <p className="text-xs text-[#6E6259]">
            {filter === 'pending'
              ? 'All incoming customer orders have been reviewed.'
              : 'Orders placed by customers will appear in this list.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col justify-between gap-5 rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-sm transition-colors lg:flex-row lg:items-center"
            >
              {/* Order Info Left */}
              <div className="flex min-w-0 flex-1 items-start space-x-4">
                <img
                  src={order.itemId?.images?.[0] || '/images/cat-classic.jpg'}
                  alt={order.itemId?.itemName}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-stone-200 bg-[#FAF7F2] object-cover"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-baseline space-x-3">
                    <h3 className="text-base font-extrabold text-[#18120E]">
                      {order.itemId?.itemName || 'Pizza order'}
                    </h3>
                    <span className="font-display text-lg text-[#D91E18] tabular-nums">
                      {formatPrice(order.itemId?.price || 0)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6E6259]">
                    <span className="flex items-center font-medium text-[#18120E]">
                      <User className="mr-1.5 h-3.5 w-3.5 shrink-0 text-[#9A4A12]" />
                      <span className="break-words [overflow-wrap:anywhere]">
                        {order.customerId?.name} ({order.customerId?.email})
                      </span>
                    </span>
                    <span className="flex items-center">
                      <Calendar className="mr-1.5 h-3.5 w-3.5 text-stone-400" />
                      Delivery:{' '}
                      <span className="ml-1 font-semibold text-[#18120E]">
                        {formatDate(order.deliveryDate)}
                      </span>
                    </span>
                  </div>

                  <p className="flex items-start text-xs text-[#6E6259]">
                    <MapPin className="mr-1.5 mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D91E18]" />
                    <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                      {order.deliveryAddress}
                    </span>
                  </p>

                  {order.message && (
                    <div className="mt-1 flex items-start space-x-2 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3 text-xs text-[#6E6259]">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9A4A12]" />
                      <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                        Note: &ldquo;{order.message}&rdquo;
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Actions Right */}
              <div className="flex shrink-0 flex-col items-start justify-between gap-3 border-t border-stone-100 pt-3 sm:flex-row lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                      order.status === 'pending'
                        ? 'border-amber-200 bg-amber-50 text-[#9A4A12]'
                        : order.status === 'accepted'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : order.status === 'rejected'
                        ? 'border-stone-200 bg-[#FAF7F2] text-[#6E6259]'
                        : 'border-red-200 bg-red-50 text-[#D91E18]'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        order.status === 'pending'
                          ? 'bg-amber-500'
                          : order.status === 'accepted'
                          ? 'bg-emerald-500'
                          : order.status === 'cancelled'
                          ? 'bg-[#D91E18]'
                          : 'bg-stone-400'
                      }`}
                    />
                    <span className="capitalize">{order.status}</span>
                  </span>

                  {order.paymentStatus === 'paid' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Paid</span>
                    </span>
                  )}
                </div>

                {order.status === 'pending' ? (
                  <div className="flex w-full space-x-2 sm:w-auto">
                    <button
                      type="button"
                      disabled={Boolean(updatingIds[order._id])}
                      onClick={() => handleUpdateStatus(order._id, 'accepted')}
                      className="flex cursor-pointer items-center space-x-1.5 rounded-xl bg-[#18120E] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#D91E18] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(updatingIds[order._id])}
                      onClick={() => handleUpdateStatus(order._id, 'rejected')}
                      className="flex cursor-pointer items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-[#D91E18] transition-colors hover:bg-[#D91E18] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-[#6E6259]">
                    Decision recorded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

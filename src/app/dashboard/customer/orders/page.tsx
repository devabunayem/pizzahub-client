'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  XCircle,
  Pizza,
  Store,
  ChevronDown,
  ChevronUp,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderListSkeleton } from '@/components/ui/Skeleton';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CustomerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const inFlightCancelRef = useRef<boolean>(false);
  const inFlightPayRef = useRef<Set<string>>(new Set());
  const [payingIds, setPayingIds] = useState<Record<string, boolean>>({});
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    orderId: string;
    loading: boolean;
  }>({
    isOpen: false,
    orderId: '',
    loading: false,
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const confirmCancelOrder = async () => {
    const targetId = cancelModal.orderId;
    if (!targetId || inFlightCancelRef.current) return;

    inFlightCancelRef.current = true;
    setCancelModal((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading('Cancelling order...');
    try {
      const res = await fetch(`${API_BASE}/orders/${targetId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Order has been cancelled.', { id: toastId });
        setOrders((prev) =>
          prev.map((o) => (o._id === targetId ? { ...o, status: 'cancelled' } : o))
        );
        setCancelModal({ isOpen: false, orderId: '', loading: false });
        await fetchOrders();
      } else {
        toast.error(data.message || 'Failed to cancel order.', { id: toastId });
        setCancelModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      toast.error('Network error cancelling order.', { id: toastId });
      setCancelModal((prev) => ({ ...prev, loading: false }));
    } finally {
      inFlightCancelRef.current = false;
    }
  };

  const handlePayOrder = async (orderId: string) => {
    if (!token || inFlightPayRef.current.has(orderId)) return;

    inFlightPayRef.current.add(orderId);
    setPayingIds((prev) => ({ ...prev, [orderId]: true }));
    const toastId = toast.loading('Recording payment...');

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/pay`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Order payment marked as paid!', { id: toastId });
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: 'paid' } : o))
        );
        await fetchOrders();
      } else {
        toast.error(data.message || 'Failed to complete payment.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error completing payment.', { id: toastId });
    } finally {
      inFlightPayRef.current.delete(orderId);
      setPayingIds((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    }
  };

  if (loading) {
    return <OrderListSkeleton count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
            Order History
          </span>
          <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-[#6E6259]">
            Track order preparation, delivery progress, or cancel pending requests.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex shrink-0 items-center space-x-2 self-start rounded-full bg-[#D91E18] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#b81712] sm:self-auto"
        >
          <Pizza className="h-3.5 w-3.5" />
          <span>Browse Menu</span>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="space-y-3 rounded-3xl border border-stone-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#9A4A12]">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#18120E]">No orders placed</h3>
          <p className="mx-auto max-w-sm text-xs text-[#6E6259]">
            You haven&apos;t placed any pizza orders yet. Explore our menu to order fresh, handmade pizza.
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center rounded-full bg-[#18120E] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#D91E18]"
            >
              <span>Explore Menu</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;

            return (
              <div
                key={order._id}
                className="rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-sm transition-colors"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  {/* Left Info */}
                  <div className="flex min-w-0 flex-1 items-start space-x-4">
                    <img
                      src={order.itemId?.images?.[0] || '/images/cat-classic.jpg'}
                      alt={order.itemId?.itemName}
                      className="h-16 w-16 shrink-0 rounded-2xl border border-stone-200 bg-[#FAF7F2] object-cover"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-baseline space-x-3">
                        <h3 className="text-base font-extrabold text-[#18120E]">
                          {order.itemId?.itemName || 'Artisanal Pizza'}
                        </h3>
                        <span className="font-display text-lg text-[#D91E18] tabular-nums">
                          {formatPrice(order.itemId?.price || 0)}
                        </span>
                      </div>

                      <p className="flex items-center text-xs font-medium text-[#6E6259]">
                        <Store className="mr-1.5 h-3.5 w-3.5 shrink-0 text-[#9A4A12]" />
                        <span className="truncate">{order.vendorId?.businessName || order.vendorId?.name}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs text-[#6E6259]">
                        <span className="flex items-center">
                          <Calendar className="mr-1.5 h-3.5 w-3.5 text-stone-400" />
                          Delivery:{' '}
                          <span className="ml-1 font-semibold text-[#18120E]">
                            {formatDate(order.deliveryDate)}
                          </span>
                        </span>
                        <span className="text-stone-400">
                          Placed: {formatDate(order.createdAt)}
                        </span>
                      </div>

                      <p className="flex items-start pt-0.5 text-xs text-[#6E6259]">
                        <MapPin className="mr-1.5 mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D91E18]" />
                        <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                          {order.deliveryAddress}
                        </span>
                      </p>

                      {order.message && (
                        <p className="pt-0.5 text-xs italic text-[#6E6259] break-words [overflow-wrap:anywhere]">
                          Note: &ldquo;{order.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Status & Action */}
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

                    <div className="flex flex-wrap items-center gap-2">
                      {(order.status === 'pending' || order.status === 'accepted') &&
                        order.paymentStatus !== 'paid' && (
                          <button
                            type="button"
                            disabled={Boolean(payingIds[order._id])}
                            onClick={() => handlePayOrder(order._id)}
                            className="flex cursor-pointer items-center space-x-1.5 rounded-xl bg-[#18120E] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#D91E18] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>{payingIds[order._id] ? 'Paying...' : 'Pay Now'}</span>
                          </button>
                        )}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order._id)
                        }
                        className="flex cursor-pointer items-center space-x-1.5 rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2 text-xs font-bold text-[#18120E] transition hover:border-[#18120E]"
                      >
                        <span>{isExpanded ? 'Hide timeline' : 'Track progress'}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {order.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() =>
                            setCancelModal({
                              isOpen: true,
                              orderId: order._id,
                              loading: false,
                            })
                          }
                          className="flex cursor-pointer items-center space-x-1 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-[#D91E18] transition-colors hover:bg-[#D91E18] hover:text-white"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 space-y-3 border-t border-stone-100 pt-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                      Order progress timeline
                    </h4>
                    <StatusTimeline status={order.status} deliveryDate={order.deliveryDate} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={cancelModal.isOpen}
        loading={cancelModal.loading}
        onClose={() =>
          setCancelModal({ isOpen: false, orderId: '', loading: false })
        }
        onConfirm={confirmCancelOrder}
        title="Cancel pending order"
        message="Are you sure you want to cancel this pending pizza order? This action cannot be undone."
        confirmText="Yes, cancel order"
        variant="danger"
      />
    </div>
  );
}

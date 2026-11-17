'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  MessageSquare,
  Clock,
  XCircle,
  Pizza,
  CheckCircle2,
  Store,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CustomerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this pending pizza order?')) return;

    const toastId = toast.loading('Cancelling order...');
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Order has been cancelled.', { id: toastId });
        fetchOrders();
      } else {
        toast.error(data.message || 'Failed to cancel order.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error cancelling order.', { id: toastId });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your orders..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            My Pizza Orders
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Track live preparation and delivery status, or cancel pending requests.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md shadow-pizza-500/20 transition-all shrink-0 self-start sm:self-auto"
        >
          <Pizza className="w-4 h-4" />
          <span>Order Another Pizza</span>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-pizza-50 dark:bg-pizza-950/60 text-pizza-500 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">No orders yet</h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs max-w-sm mx-auto">
            You have not placed any pizza orders yet. Explore our fresh menu to satisfy your cravings.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-pizza-600 text-white font-bold text-xs shadow-md"
          >
            <span>Browse Pizza Menu</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;

            return (
              <div
                key={order._id}
                className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Info */}
                  <div className="flex items-start space-x-4">
                    <img
                      src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                      alt={order.itemId?.itemName}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-stone-900 dark:text-white">
                          {order.itemId?.itemName || 'Gourmet Pizza'}
                        </h3>
                        <span className="font-extrabold text-pizza-600 text-sm">
                          {formatPrice(order.itemId?.price || 0)}
                        </span>
                      </div>

                      <p className="text-xs text-stone-500 flex items-center">
                        <Store className="w-3.5 h-3.5 mr-1 text-pizza-500" />
                        <span>{order.vendorId?.businessName || order.vendorId?.name}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 pt-0.5">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-pizza-500" />
                          Delivery Date: <strong>{formatDate(order.deliveryDate)}</strong>
                        </span>
                        <span className="flex items-center text-[11px] text-stone-400">
                          Placed on: {formatDate(order.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 flex items-start pt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-pizza-500 shrink-0 mt-0.5" />
                        <span>{order.deliveryAddress}</span>
                      </p>

                      {order.message && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 italic pt-0.5">
                          Note: &ldquo;{order.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Status & Action */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : order.status === 'accepted'
                          ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300'
                          : order.status === 'rejected'
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {order.status}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order._id)
                        }
                        className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-1"
                      >
                        <span>{isExpanded ? 'Hide Timeline' : 'Track Status'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-xs transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bonus Requirement 2: Order Status Timeline Expansion */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Live Delivery Progress Timeline
                    </h4>
                    <StatusTimeline status={order.status} deliveryDate={order.deliveryDate} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Receipt, CheckCircle2, Clock, Store, Mail, DollarSign, ShieldAlert } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminTransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        toast.error('Failed to load transaction audit ledger.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTransactions();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner message="Auditing platform transactions..." />;
  }

  const totalRevenue = transactions
    .filter((t) => t.status === 'succeeded')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Platform Transactions Audit
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Read-only financial records of vendor subscription payments processed via Stripe.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center space-x-3 self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Settled Revenue
            </span>
            <p className="text-xl font-black text-stone-900 dark:text-white">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-center">
        <ShieldAlert className="w-4 h-4 mr-2 text-pizza-500 shrink-0" />
        <span>
          <strong>Audit Security Rule:</strong> Administrators cannot alter, mark as paid, or forge
          payment records. All transactions are cryptographically verified by Stripe Webhooks.
        </span>
      </div>

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
          <Receipt className="w-12 h-12 mx-auto text-stone-400" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            No transactions recorded yet
          </h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            When restaurant vendors upgrade to the Premium tier via Stripe Checkout, verified
            records will appear in this ledger.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Vendor Restaurant</th>
                  <th className="py-4 px-6">Subscription Plan</th>
                  <th className="py-4 px-6">Amount Paid</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6">Stripe Reference</th>
                  <th className="py-4 px-6 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="py-4 px-6">
                      <p className="font-bold text-stone-900 dark:text-white">
                        {tx.vendorId?.businessName || tx.vendorId?.name || 'Vendor Account'}
                      </p>
                      <p className="text-xs text-stone-400 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        <span>{tx.vendorId?.email}</span>
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-xs capitalize text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
                        ⭐ {tx.plan}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-black text-stone-900 dark:text-white">
                      {formatPrice(tx.amount)}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          tx.status === 'succeeded'
                            ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        {tx.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-stone-400 font-mono">
                      {tx.stripeSessionId ? `${tx.stripeSessionId.slice(0, 16)}...` : 'Direct API'}
                    </td>

                    <td className="py-4 px-6 text-right text-xs text-stone-500">
                      {formatDate(tx.createdAt)}
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

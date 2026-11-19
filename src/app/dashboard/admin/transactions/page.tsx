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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Transaction audit ledger
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Read-only financial records of vendor subscription payments processed via Stripe.
          </p>
        </div>

        <div className="px-4 py-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center space-x-3 self-start sm:self-auto">
          <div className="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider block">
              Settled revenue
            </span>
            <p className="text-base font-semibold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-center">
        <ShieldAlert className="w-4 h-4 mr-2 text-stone-400 shrink-0" />
        <span>
          <strong className="text-stone-800 dark:text-stone-200 font-medium">Audit note:</strong> Financial records are immutable and cryptographically confirmed via Stripe Webhooks. Manual database edits are restricted.
        </span>
      </div>

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
          <Receipt className="w-8 h-8 mx-auto text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            No transactions recorded
          </h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            When restaurant vendors upgrade to the Premium tier via Stripe Checkout, confirmed records will appear in this ledger.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Restaurant</th>
                  <th className="py-3 px-5">Subscription</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Stripe session</th>
                  <th className="py-3 px-5 text-right">Settled at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {tx.vendorId?.businessName || tx.vendorId?.name || 'Vendor Kitchen'}
                      </p>
                      <p className="text-[11px] text-stone-400 flex items-center mt-0.5">
                        <Mail className="w-3 h-3 mr-1 text-stone-400" />
                        <span>{tx.vendorId?.email}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="font-medium text-[11px] capitalize text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded">
                        {tx.plan} partner
                      </span>
                    </td>

                    <td className="py-3.5 px-5 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                      {formatPrice(tx.amount)}
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${
                          tx.status === 'succeeded'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tx.status === 'succeeded' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="capitalize">{tx.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-[11px] text-stone-400 font-mono">
                      {tx.stripeSessionId ? `${tx.stripeSessionId.slice(0, 16)}...` : 'Direct API'}
                    </td>

                    <td className="py-3.5 px-5 text-right font-mono text-[11px] text-stone-500 tabular-nums">
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

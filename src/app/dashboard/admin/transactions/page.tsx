'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Receipt, Mail, DollarSign, ShieldAlert } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/lib/toast';

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
    return <TableSkeleton rows={6} columns={6} />;
  }

  const totalRevenue = transactions
    .filter((t) => t.status === 'succeeded')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
            Stripe Audit Ledger
          </span>
          <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
            Transaction Audit Ledger
          </h1>
          <p className="mt-1 text-sm text-[#6E6259]">
            Read-only financial records of vendor subscription payments processed via Stripe.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start rounded-2xl border border-stone-200/90 bg-white px-5 py-3 shadow-sm sm:self-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6E6259]">
              Settled revenue
            </span>
            <p className="font-display text-2xl text-[#18120E] tabular-nums">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center rounded-2xl border border-stone-200 bg-white p-4 text-xs text-[#6E6259] shadow-sm">
        <ShieldAlert className="mr-2.5 h-4 w-4 shrink-0 text-[#9A4A12]" />
        <span>
          <strong className="font-bold text-[#18120E]">Audit note:</strong> Financial records are
          immutable and cryptographically confirmed via Stripe Webhooks. Manual database edits are restricted.
        </span>
      </div>

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <div className="space-y-2 rounded-3xl border border-stone-200 bg-white py-16 text-center shadow-sm">
          <Receipt className="mx-auto h-8 w-8 text-[#9A4A12]" />
          <h3 className="text-base font-extrabold text-[#18120E]">
            No transactions recorded
          </h3>
          <p className="mx-auto max-w-sm text-xs text-[#6E6259]">
            When restaurant vendors upgrade to the Premium tier via Stripe Checkout, confirmed records will appear in this ledger.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-[#6E6259]">
                  <th className="px-5 py-3.5">Restaurant</th>
                  <th className="px-5 py-3.5">Subscription</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Stripe session</th>
                  <th className="px-5 py-3.5 text-right">Settled at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="transition-colors hover:bg-[#FAF7F2]/60">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[#18120E]">
                        {tx.vendorId?.businessName || tx.vendorId?.name || 'Vendor Kitchen'}
                      </p>
                      <p className="mt-0.5 flex items-center text-[11px] text-[#6E6259]">
                        <Mail className="mr-1 h-3 w-3 text-stone-400" />
                        <span>{tx.vendorId?.email}</span>
                      </p>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold capitalize text-[#9A4A12]">
                        {tx.plan} partner
                      </span>
                    </td>

                    <td className="font-display px-5 py-3.5 text-base text-[#D91E18] tabular-nums">
                      {formatPrice(tx.amount)}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          tx.status === 'succeeded'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border-amber-200 bg-amber-50 text-[#9A4A12]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            tx.status === 'succeeded' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="capitalize">{tx.status}</span>
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#6E6259]">
                      {tx.stripeSessionId ? `${tx.stripeSessionId.slice(0, 16)}...` : 'Direct API'}
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono text-[11px] text-[#6E6259] tabular-nums">
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

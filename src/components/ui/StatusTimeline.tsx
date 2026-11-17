import React from 'react';
import { Clock, Check, X, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface StatusTimelineProps {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  deliveryDate?: string | Date;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ status, deliveryDate }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center p-3 rounded-lg bg-stone-100 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-stone-600 dark:text-stone-400 text-xs">
        <X className="w-4 h-4 mr-2 text-stone-500 shrink-0" />
        <span>This order was cancelled by customer.</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="flex items-center p-3 rounded-lg bg-stone-100 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-stone-600 dark:text-stone-400 text-xs">
        <AlertCircle className="w-4 h-4 mr-2 text-stone-500 shrink-0" />
        <span>This order was declined by the restaurant.</span>
      </div>
    );
  }

  const steps = [
    {
      id: 'pending',
      label: 'Order submitted',
      completed: true,
      active: status === 'pending',
    },
    {
      id: 'accepted',
      label: 'Accepted by kitchen',
      completed: status === 'accepted',
      active: status === 'accepted',
    },
    {
      id: 'delivery',
      label: deliveryDate ? `Scheduled for ${formatDate(deliveryDate)}` : 'Delivery scheduled',
      completed: status === 'accepted',
      active: false,
    },
  ];

  return (
    <div className="py-2">
      <div className="flex items-center space-x-2 text-xs">
        {steps.map((step, idx) => {
          const isDone = step.completed;
          const isCurrent = step.active;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                    isDone
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 stroke-[2]" /> : idx + 1}
                </div>
                <span
                  className={`font-medium ${
                    isDone
                      ? 'text-stone-900 dark:text-white'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-px transition-colors ${
                    isDone ? 'bg-stone-900 dark:bg-stone-100' : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface StatusTimelineProps {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  deliveryDate?: string | Date;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ status, deliveryDate }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center rounded-2xl border border-stone-200 bg-[#FAF7F2] p-3.5 text-xs font-medium text-[#6E6259]">
        <X className="mr-2 h-4 w-4 shrink-0 text-[#D91E18]" />
        <span>This order was cancelled by customer.</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="flex items-center rounded-2xl border border-stone-200 bg-[#FAF7F2] p-3.5 text-xs font-medium text-[#6E6259]">
        <AlertCircle className="mr-2 h-4 w-4 shrink-0 text-[#9A4A12]" />
        <span>This order was declined by the restaurant kitchen.</span>
      </div>
    );
  }

  const steps = [
    {
      id: 'pending',
      label: 'Order submitted',
      completed: true,
    },
    {
      id: 'accepted',
      label: 'Accepted by kitchen',
      completed: status === 'accepted',
    },
    {
      id: 'delivery',
      label: deliveryDate ? `Scheduled for ${formatDate(deliveryDate)}` : 'Delivery scheduled',
      completed: status === 'accepted',
    },
  ];

  return (
    <div className="py-2">
      <div className="flex flex-wrap items-center gap-2 text-xs sm:flex-nowrap">
        {steps.map((step, idx) => {
          const isDone = step.completed;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                    isDone
                      ? 'bg-[#D91E18] text-white shadow-sm'
                      : 'border border-stone-300 bg-[#FAF7F2] text-[#6E6259]'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : idx + 1}
                </div>
                <span
                  className={`font-semibold ${
                    isDone ? 'text-[#18120E]' : 'text-[#6E6259]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`hidden sm:block h-[2px] flex-1 rounded-full transition-colors ${
                    isDone ? 'bg-[#18120E]' : 'bg-stone-200'
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

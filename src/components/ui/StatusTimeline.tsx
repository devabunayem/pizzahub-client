import React from 'react';
import { Clock, CheckCircle2, XCircle, ChefHat, Bike, AlertCircle } from 'lucide-react';

interface StatusTimelineProps {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  deliveryDate?: string | Date;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ status, deliveryDate }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
        <XCircle className="w-5 h-5 mr-2 shrink-0" />
        <span className="text-xs font-semibold">Order was cancelled by customer</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="flex items-center p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300">
        <AlertCircle className="w-5 h-5 mr-2 text-red-500 shrink-0" />
        <span className="text-xs font-semibold">Order was declined by the restaurant</span>
      </div>
    );
  }

  const steps = [
    {
      id: 'pending',
      label: 'Order Placed',
      desc: 'Waiting for restaurant confirmation',
      icon: Clock,
      completed: true,
      active: status === 'pending',
    },
    {
      id: 'accepted',
      label: 'Accepted & Preparing',
      desc: 'Fresh dough & wood-fire oven',
      icon: ChefHat,
      completed: status === 'accepted',
      active: status === 'accepted',
    },
    {
      id: 'delivery',
      label: 'Delivery Scheduled',
      desc: deliveryDate ? new Date(deliveryDate).toLocaleDateString() : 'Ready for delivery',
      icon: Bike,
      completed: status === 'accepted',
      active: false,
    },
  ];

  return (
    <div className="py-2">
      <div className="relative flex items-center justify-between w-full">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 dark:bg-stone-700 z-0" />
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-pizza-500 z-0 transition-all duration-500"
          style={{ width: status === 'accepted' ? '80%' : '20%' }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = step.completed;
          const isCurrent = step.active;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-pizza-600 text-white shadow-md shadow-pizza-500/30'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                } ${isCurrent ? 'ring-4 ring-pizza-200 dark:ring-pizza-950/60 scale-110' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`mt-2 text-[11px] font-bold ${
                  isDone
                    ? 'text-pizza-700 dark:text-pizza-400'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Pizza } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading hot & fresh pizzas...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-pizza-200 dark:border-stone-800 border-t-pizza-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Pizza className="w-7 h-7 text-pizza-600 animate-bounce" />
        </div>
      </div>
      <p className="text-sm font-medium text-stone-600 dark:text-stone-400 animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50/50 dark:bg-stone-950/50">
        {content}
      </div>
    );
  }

  return content;
};

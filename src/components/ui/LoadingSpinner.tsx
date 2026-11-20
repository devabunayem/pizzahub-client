import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="h-7 w-7 rounded-full border-[2.5px] border-stone-200 border-t-[#D91E18] animate-spin" />
      <p className="text-sm font-medium text-[#6E6259]">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF7F2]/60">
        {content}
      </div>
    );
  }

  return content;
};

'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const confirmColors = {
    danger: 'bg-[#D91E18] hover:bg-[#b81712] text-white',
    warning: 'bg-[#9A4A12] hover:bg-[#7d3b0d] text-white',
    primary: 'bg-[#18120E] hover:bg-[#D91E18] text-white',
  }[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18120E]/55 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!loading) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md space-y-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-[0_24px_56px_-18px_rgba(24,18,14,0.28)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                variant === 'danger'
                  ? 'border-red-100 bg-red-50 text-[#D91E18]'
                  : variant === 'warning'
                  ? 'border-amber-200 bg-[#FAF7F2] text-[#9A4A12]'
                  : 'border-stone-200 bg-[#FAF7F2] text-[#18120E]'
              }`}
            >
              {variant === 'danger' ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-[#18120E]">
                {title}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-[#6E6259]">
                Please confirm this action
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-1.5 text-stone-400 transition-colors hover:bg-[#FAF7F2] hover:text-[#18120E] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-[#6E6259]">
          {message}
        </p>

        <div className="flex items-center justify-end space-x-2.5 border-t border-stone-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-stone-200 bg-[#FAF7F2] px-4 py-2.5 text-xs font-semibold text-[#18120E] transition-colors hover:bg-stone-100 cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${confirmColors}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

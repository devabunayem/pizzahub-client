import React from 'react';
import hotToast from 'react-hot-toast';
import { BrandToast, type BrandToastVariant } from '@/components/ui/BrandToast';

interface ToastObjectInput {
  id?: string;
  title?: string;
  message?: string;
  description?: string;
  duration?: number | null;
}

type ToastInput = string | ToastObjectInput;
type ExtraOptions = { id?: string; duration?: number; description?: string } | string;

interface ParsedToastArgs {
  id?: string;
  title: string;
  description?: string;
  duration?: number;
}

function parseArgs(input: ToastInput, extra?: ExtraOptions): ParsedToastArgs {
  if (typeof input === 'string') {
    if (typeof extra === 'string') {
      return { title: input, description: extra };
    }
    if (extra && typeof extra === 'object') {
      return {
        id: extra.id,
        title: input,
        description: extra.description,
        duration: extra.duration,
      };
    }
    return { title: input };
  }

  return {
    id: input.id,
    title: input.title || input.message || '',
    description: input.description,
    duration: input.duration === null ? Infinity : input.duration,
  };
}

function showBrandToast(
  variant: BrandToastVariant,
  input: ToastInput,
  extra?: ExtraOptions
) {
  const parsed = parseArgs(input, extra);
  const duration =
    parsed.duration !== undefined
      ? parsed.duration
      : variant === 'loading'
      ? Infinity
      : 4200;

  return hotToast.custom(
    (t) =>
      React.createElement(BrandToast, {
        t,
        variant,
        title: parsed.title,
        description: parsed.description,
      }),
    {
      id: parsed.id,
      duration,
    }
  );
}

export const toast = {
  success: (input: ToastInput, extra?: ExtraOptions) =>
    showBrandToast('success', input, extra),

  error: (input: ToastInput, extra?: ExtraOptions) =>
    showBrandToast('error', input, extra),

  info: (input: ToastInput, extra?: ExtraOptions) =>
    showBrandToast('info', input, extra),

  warning: (input: ToastInput, extra?: ExtraOptions) =>
    showBrandToast('warning', input, extra),

  loading: (input: ToastInput, extra?: ExtraOptions) =>
    showBrandToast('loading', input, extra),

  dismiss: (id?: string) => {
    hotToast.dismiss(id);
  },

  promise: hotToast.promise,
};

export default toast;

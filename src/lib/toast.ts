import { sileo, type SileoOptions } from 'sileo';

type ToastInput = string | SileoOptions;
type ExtraOptions = { id?: string; duration?: number; description?: string } | string;

function parseArgs(input: ToastInput, extra?: ExtraOptions): SileoOptions {
  if (typeof input === 'string') {
    if (typeof extra === 'string') {
      return { title: input, description: extra };
    }
    if (extra && typeof extra === 'object') {
      const { description, duration } = extra;
      return {
        title: input,
        description: description,
        duration: duration,
      };
    }
    return { title: input };
  }
  return input;
}

export const toast = {
  success: (input: ToastInput, extra?: ExtraOptions) => {
    if (extra && typeof extra === 'object' && extra.id) {
      sileo.dismiss(extra.id);
    }
    const opts = parseArgs(input, extra);
    return sileo.success(opts);
  },

  error: (input: ToastInput, extra?: ExtraOptions) => {
    if (extra && typeof extra === 'object' && extra.id) {
      sileo.dismiss(extra.id);
    }
    const opts = parseArgs(input, extra);
    return sileo.error(opts);
  },

  info: (input: ToastInput, extra?: ExtraOptions) => {
    if (extra && typeof extra === 'object' && extra.id) {
      sileo.dismiss(extra.id);
    }
    const opts = parseArgs(input, extra);
    return sileo.info(opts);
  },

  warning: (input: ToastInput, extra?: ExtraOptions) => {
    if (extra && typeof extra === 'object' && extra.id) {
      sileo.dismiss(extra.id);
    }
    const opts = parseArgs(input, extra);
    return sileo.warning(opts);
  },

  loading: (input: ToastInput, extra?: ExtraOptions) => {
    const opts = parseArgs(input, extra);
    return sileo.show({
      type: 'loading',
      ...opts,
      duration: null, // Keep loading until dismissed or resolved
    });
  },

  dismiss: (id?: string) => {
    if (id) {
      sileo.dismiss(id);
    } else {
      sileo.clear();
    }
  },

  promise: sileo.promise,
  show: sileo.show,
  raw: sileo,
};

export { sileo };
export default toast;

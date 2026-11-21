import React from 'react';

export interface BrandLogoProps {
  variant?: 'horizontal' | 'icon' | 'full';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ICON_SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
};

const WORDMARK_SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

/**
 * Unified PizzaHub brand mark using the custom brick-oven & flame logo assets.
 */
export const BrandLogo = ({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  className = '',
}: BrandLogoProps) => {
  if (variant === 'full') {
    return (
      <img
        src="/images/logo-full.png"
        alt="PizzaHub"
        className={`object-contain ${className || 'h-24 w-auto'}`}
      />
    );
  }

  const sizeClass = ICON_SIZE_CLASSES[size];
  const iconNode =
    theme === 'dark' ? (
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] p-1 shadow-sm ${sizeClass} ${
          variant === 'icon' ? className : ''
        }`}
      >
        <img
          src="/images/logo-icon.png"
          alt="PizzaHub"
          className="h-full w-full object-contain"
        />
      </span>
    ) : (
      <img
        src="/images/logo-icon.png"
        alt="PizzaHub"
        className={`shrink-0 object-contain ${sizeClass} ${
          variant === 'icon' ? className : ''
        }`}
      />
    );

  if (variant === 'icon') {
    return iconNode;
  }

  const textSizeClass = WORDMARK_SIZE_CLASSES[size];
  const pizzaColorClass = theme === 'dark' ? 'text-white' : 'text-[#18120E]';

  return (
    <span
      className={`inline-flex items-center gap-2 font-black tracking-tight ${textSizeClass} ${className}`}
    >
      {iconNode}
      <span>
        <span className={pizzaColorClass}>Pizza</span>
        <span className="text-[#e50916]">Hub</span>
      </span>
    </span>
  );
};

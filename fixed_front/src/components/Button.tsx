'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Gradient border wrapper variants
const gradientBorderVariants = cva(
  'p-[1.54px] bg-gradient-to-bl from-white/[0.6] to-transparent bg-primary-400',
  {
    variants: {
      size: {
        small: 'rounded-lg',
        medium: 'rounded-xl',
        large: 'rounded-2xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      size: 'medium',
      fullWidth: false,
    },
  },
);

// Inner button variants
const buttonVariants = cva(
  'inline-flex items-center justify-center text-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden w-full h-full',
  {
    variants: {
      variant: {
        primary: [
          'text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700',
          'shadow-lg hover:shadow-xl',
          'focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
        ],
      },
      size: {
        small: 'h-8 px-3 py-1.5 text-xs gap-1.5 rounded-[calc(0.5rem-1.54px)]',
        medium: 'h-10 px-4 py-2 text-sm gap-2 rounded-[calc(0.75rem-1.54px)]',
        large: 'h-12 px-6 py-3 text-md gap-2.5 rounded-[calc(1rem-1.54px)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant,
  size,
  fullWidth,
  className,
  icon,
  iconPosition = 'left',
  loading = false,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  const iconElement = icon && (
    <span className={cn(
      'flex-shrink-0',
      size === 'small' ? 'w-3 h-3' :
        size === 'medium' ? 'w-4 h-4' :
          'w-5 h-5'
    )}>
      {icon}
    </span>
  );

  const loadingSpinner = loading && (
    <svg
      className={cn(
        'animate-spin flex-shrink-0',
        size === 'small' ? 'w-3 h-3' :
          size === 'medium' ? 'w-4 h-4' :
            'w-5 h-5'
      )}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      />
    </svg>
  );

  // Enhanced button with proper gradient border
  return (
    <div className={cn(gradientBorderVariants({ size, fullWidth }))}>
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={props.disabled || loading}
        {...props}
      >
        {/* Enhanced primary button effect */}
        {isPrimary && (
          <>
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/10 rounded-[inherit] pointer-events-none" />

            {/* Top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-[inherit] pointer-events-none" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-inherit">
          {loading && loadingSpinner}
          {!loading && iconPosition === 'left' && iconElement}
          {!loading && children}
          {!loading && iconPosition === 'right' && iconElement}
        </div>
      </button>
    </div>
  );
}
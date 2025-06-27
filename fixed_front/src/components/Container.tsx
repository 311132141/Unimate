import React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

export interface ContainerProps {
  /** Container variant */
  variant?: 'default' | 'glass' | 'elevated';
  /** Container size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Container children */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
}

// Outer wrapper variants with size-dependent styling
const outerWrapperVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-gradient-to-bl from-gray-400 to-transparent bg-white/[0.1] h-full',
      glass: 'bg-white/[0.2] h-full',
      elevated: 'bg-gradient-to-bl from-gray-400 to-transparent bg-white/[0.1] h-full',
    },
    size: {
      xs: 'rounded-xs p-[1px]',
      sm: 'rounded-m p-[2px]',
      md: 'rounded-m p-[2px]',
      lg: 'rounded-m p-[2px]',
      xl: 'rounded-2xl p-[2px]',
      '2xl': 'rounded-3xl p-[px]',
    },
  },
});

// Inner container variants
const innerContainerVariants = cva('w-full h-full', {
  variants: {
    variant: {
      default: 'bg-secondary-900',
      glass: 'bg-gradient-to-bl from-secondary-900 to-secondary-700 bg-secondary-900 backdrop-blur-sm',
      elevated: 'bg-surface-dark shadow-inner',
    },
    size: {
      xs: 'rounded-[calc(6px-1px)] p-2',
      sm: 'rounded-[calc(10px-2px)] p-2',
      md: 'rounded-[calc(12px-2px)] p-2',
      lg: 'rounded-[calc(14px-2px)] p-2',
      xl: 'rounded-[calc(16px-2px)] p-2',
      '2xl': 'rounded-[calc(24px-4px)] p-2',
    },
  },
});

export const Container: React.FC<ContainerProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
}) => {
  return (
    <div className={outerWrapperVariants({ variant, size })}>
      <div className={cn(
        innerContainerVariants({ variant, size }),
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export default Container; 
import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size */
  size?: 'small' | 'medium' | 'large' | 'button-large';
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size = 'medium',
      leftIcon,
      rightIcon,
      error = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const sizeClasses = {
      small: 'h-8 text-sm',
      medium: 'h-10 text-sm',
      large: 'h-12 text-md',
      'button-large': 'h-[3.625rem] text-md',
    };



    // Outer wrapper classes (glass border effect)
    const outerWrapperClasses = [
      'relative transition-all duration-200 overflow-hidden',
      // Glass border effect
      error ? 'bg-destructive/25' : 'bg-white/[0.15]',
      // Hover states for outer wrapper
      error
        ? 'hover:bg-destructive/35'
        : 'hover:bg-white/[0.25]',
      // Focus states for outer wrapper
      error
        ? 'focus-within:bg-destructive/30'
        : 'focus-within:bg-white/[0.3]',
      // Border radius based on size with border thickness
      size === 'small' ? 'rounded-md p-[1px]' :
        size === 'medium' ? 'rounded-lg p-[1px]' :
          size === 'large' ? 'rounded-xl p-[2px]' :
            size === 'button-large' ? 'rounded-xl p-[2px]' : 'rounded-lg p-[1px]',
      // Width
      fullWidth ? 'w-full' : 'w-auto',
      // Disabled states
      disabled && 'opacity-50 cursor-not-allowed',
    ].filter(Boolean);

    // Inner container classes (glass background effect)
    const innerContainerClasses = [
      'relative flex items-center w-full h-full transition-all duration-200 overflow-hidden',
      // Glass background effect similar to glass container
      error
        ? 'bg-gradient-to-bl from-destructive/10 to-destructive/5 bg-background-dark/90'
        : 'bg-gradient-to-bl from-secondary-900 to-secondary-700 bg-secondary-900',
      // Backdrop blur
      'backdrop-blur-sm',
      // Border radius (inner radius calculation)
      size === 'small' ? 'rounded-[calc(0.375rem-1px)]' :
        size === 'medium' ? 'rounded-[calc(0.5rem-1px)]' :
          size === 'large' ? 'rounded-[calc(0.75rem-2px)]' :
            size === 'button-large' ? 'rounded-[calc(0.75rem-2px)]' : 'rounded-[calc(0.5rem-1px)]',
      // Disabled states
      disabled && 'cursor-not-allowed',
    ].filter(Boolean);

    const inputClasses = [
      'flex-1 bg-gradient-to-bl from-secondary-900 to-secondary-700 bg-secondary-900 outline-none text-white w-full',
      'placeholder:text-secondary-400 placeholder:transition-colors',
      'focus:placeholder:text-secondary-300',
      disabled && 'cursor-not-allowed',
      // Remove default padding since container handles it
      'px-0',
      // Force transparent background and remove browser defaults
      '!bg-transparent border-0 focus:bg-transparent focus:border-0',
      // Remove any box-shadow or ring from browser defaults
      'shadow-none focus:shadow-none ring-0 focus:ring-0',
    ].filter(Boolean);

    const iconClasses = error
      ? 'flex-shrink-0 text-destructive/70 transition-colors duration-200'
      : `flex-shrink-0 transition-colors duration-200 ${isFocused ? 'text-primary' : 'text-secondary-400'}`;

    return (
      <div className={cn(...outerWrapperClasses, className)}>
        <div className={cn(...innerContainerClasses)}>
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn(
              "flex-shrink-0 flex items-center justify-center pointer-events-none",
              size === 'small' ? 'w-6 h-6 ml-2' :
                size === 'medium' ? 'w-6 h-6 ml-3' :
                  size === 'large' ? 'w-8 h-8 ml-3' :
                    'w-8 h-8 ml-3'
            )}>
              <span className={iconClasses}>
                {leftIcon}
              </span>
            </div>
          )}

          {/* Input Field */}
          <input
            type={type}
            className={cn(
              ...inputClasses,
              sizeClasses[size],
              leftIcon ? (
                size === 'small' ? 'pl-1 pr-3' :
                  size === 'medium' ? 'pl-1 pr-4' :
                    size === 'large' ? 'pl-2 pr-4' :
                      'pl-2 pr-4'
              ) : rightIcon ? (
                size === 'small' ? 'pl-3 pr-1' :
                  size === 'medium' ? 'pl-4 pr-1' :
                    size === 'large' ? 'pl-4 pr-2' :
                      'pl-4 pr-2'
              ) : (
                size === 'small' ? 'px-3' :
                  size === 'medium' ? 'px-4' :
                    'px-4'
              )
            )}
            style={{ backgroundColor: 'transparent', background: 'none' }}
            ref={ref}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className={cn(
              "flex-shrink-0 flex items-center justify-center pointer-events-none",
              size === 'small' ? 'w-6 h-6 mr-2' :
                size === 'medium' ? 'w-6 h-6 mr-3' :
                  size === 'large' ? 'w-8 h-8 mr-3' :
                    'w-8 h-8 mr-3'
            )}>
              <span className={iconClasses}>
                {rightIcon}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 
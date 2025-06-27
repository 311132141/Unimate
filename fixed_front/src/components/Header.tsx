import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from './Input';
import Button from './Button';

export interface HeaderProps {
  /** Custom className */
  className?: string;
  /** Search value */
  searchValue?: string;
  /** Search change handler */
  onSearchChange?: (value: string) => void;
  /** Login click handler */
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  searchValue,
  onSearchChange,
  onLoginClick,
}) => {
  const router = useRouter();

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push('/login');
    }
  };

  return (
    <header
      className={cn(
        'flex items-center justify-between px-6 py-4 bg-background-dark/95 backdrop-blur-sm border-b border-surface-dark/80 relative z-10',
        className
      )}
    >
      {/* Logo/Title */}
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-s bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <h1 className="text-white text-xl font-semibold">UniMate</h1>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-md mx-8">
        <Input
          size="large"
          placeholder="Search events, news, places..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          leftIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          fullWidth
        />
      </div>

      {/* Login Button */}
      <div>
        <Button
          variant="primary"
          size="large"
          onClick={handleLoginClick}
        >
          Log in
        </Button>
      </div>
    </header>
  );
};

export default Header; 
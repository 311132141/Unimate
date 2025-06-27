import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  /** Toggle options */
  options: string[];
  /** Currently active option */
  activeOption: string;
  /** Callback when option is selected */
  onOptionChange: (option: string) => void;
  /** Custom className */
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  options,
  activeOption,
  onOptionChange,
  className,
}) => {
  return (
    <div className={cn('rounded-m p-[2px]  bg-white/[0.2] min-w-[160px]', className)}>
      <div className="bg-gradient-to-bl from-secondary-900 to-secondary-700 bg-secondary-900 backdrop-blur-sm rounded-[calc(12px-2px)] p-1 flex">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onOptionChange(option)}
            className={cn(
              'flex-1 px-4 py-2 rounded-xs text-sm font-medium transition-all duration-200 relative overflow-hidden w-[76px] text-center',
              activeOption === option
                ? 'text-white bg-background-dark/60 shadow-md'
                : 'text-secondary-300 hover:text-white hover:bg-secondary-800/30'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toggle; 
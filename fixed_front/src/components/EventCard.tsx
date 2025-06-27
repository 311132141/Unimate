import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface EventCardProps {
  /** Event category */
  category: string;
  /** Event title */
  title: string;
  /** Time since posted */
  timeAgo: string;
  /** Author name */
  author: string;
  /** Event image */
  image?: string;
  /** Click handler */
  onClick?: () => void;
  /** Custom className */
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  category,
  title,
  timeAgo,
  author,
  image,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        'group relative bg-secondary-900 backdrop-blur-sm hover:bg-background-dark/60 rounded-m p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-secondary-800/20 hover:border-primary/30 w-full',
        className
      )}
      onClick={onClick}
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-xs text-2xs font-medium bg-primary/10 text-primary border border-primary/20">
          {category}
        </span>
        <span className="text-secondary-400 text-2xs">{timeAgo}</span>
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Event Title */}
          <h3 className="text-white text-lg font-semibold leading-tight mb-1 group-hover:text-primary-100 transition-colors line-clamp-2 h-14  overflow-hidden ">
            {title.length > 25 ? `${title.substring(0, 25)}...` : title}
          </h3>

          {/* Author Info */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary text-xs font-medium">
                {author.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-secondary-400">by</span>
            <span className="text-white font-medium">{author}</span>
          </div>
        </div>

        {/* Event Image */}
        <div className="flex-shrink-0">
          {image ? (
            <div className="relative w-20 h-20 rounded-s overflow-hidden border border-secondary-700/50">
              <Image
                src={image}
                alt={title}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-s bg-gradient-to-br from-secondary-800 to-secondary-900 flex items-center justify-center border border-secondary-700/50 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
              <svg
                className="w-8 h-8 text-secondary-400 group-hover:text-primary/70 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-secondary-700/30 to-transparent" />

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-m bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default EventCard; 
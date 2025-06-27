import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { EventCard } from './EventCard';
import { Container } from './Container';
import { Toggle } from './Toggle';

interface NewsItem {
  category: string;
  title: string;
  timeAgo: string;
  author: string;
  image: string;
  url: string;
}

interface EventItem {
  category: string;
  title: string;
  timeAgo: string;
  author: string;
  image: string;
}

export interface SidebarProps {
  /** Custom className */
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'events' | 'news'>('events');
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);

  // Mock data for events - using placeholder images instead of external URLs
  const techEvents: EventItem[] = [
    {
      category: 'Tech Events',
      title: 'Whatever event name bro',
      timeAgo: '2 hours ago',
      author: 'Mechatronics',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNEE1NTY4Ii8+CjxwYXRoIGQ9Ik0zNCAyOEgzOFYzMkg0MlYzNkg0NlY0MEg0MlY0NEgzOFY0MEgzNFYzNlpNNTAgMjhINTRWMzJINThWMzZINjJWNDBINThWNDRINTRWNDBINTBWMzZaTTY2IDI4SDcwVjMySDc0VjM2SDc4VjQwSDc0VjQ0SDcwVjQwSDY2VjM2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
    },
    {
      category: 'Tech Events',
      title: 'Whatever event name bro',
      timeAgo: '2 hours ago',
      author: 'Mechatronics',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzc0MTUxIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjE2IiBmaWxsPSIjNjM3Mzg1Ii8+CjxwYXRoIGQ9Ik01MiAzMkg2OFYzNkg2NFY0NEg1NlY0MEg1MlYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==',
    },
    {
      category: 'Tech Events',
      title: 'Whatever event name bro',
      timeAgo: '2 hours ago',
      author: 'Mechatronics',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNDMzODU2Ii8+CjxyZWN0IHg9IjMwIiB5PSIyNCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzY5N0M5MyIvPgo8cGF0aCBkPSJNNDAgMzZINDRWNDBINDhWNDRINTJWNDBINTZWMzZINjBWNDBINjRWNDRINjhWNDBINzJWMzZINjhWMzJINjRWNDI4SDYwVjM2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
    },
    {
      category: 'Tech Events',
      title: 'Whatever event name bro',
      timeAgo: '2 hours ago',
      author: 'Mechatronics',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzY0MjRFIi8+Cjxwb2x5Z29uIHBvaW50cz0iNjAsMjAgNDAsMzYgNDAsNDQgNjAsNjAgODAsNDQgODAsMzYiIGZpbGw9IiM2Mzc0ODUiLz4KPGNpcmNsZSBjeD0iNDgiIGN5PSIzMiIgcj0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
    },
    {
      category: 'Tech Events',
      title: 'Another tech event here',
      timeAgo: '4 hours ago',
      author: 'TechHub',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNEE1NTY4Ii8+CjxwYXRoIGQ9Ik0zNCAyOEgzOFYzMkg0MlYzNkg0NlY0MEg0MlY0NEgzOFY0MEgzNFYzNlpNNTAgMjhINTRWMzJINThWMzZINjJWNDBINThWNDRINTRWNDBINTBWMzZaTTY2IDI4SDcwVjMySDc0VjM2SDc4VjQwSDc0VjQ0SDcwVjQwSDY2VjM2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
    },
    {
      category: 'Tech Events',
      title: 'More events to test scroll',
      timeAgo: '6 hours ago',
      author: 'EventOrg',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzc0MTUxIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjE2IiBmaWxsPSIjNjM3Mzg1Ii8+CjxwYXRoIGQ9Ik01MiAzMkg2OFYzNkg2NFY0NEg1NlY0MEg1MlYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==',
    },
  ];

  const techNews: NewsItem[] = [
    {
      category: 'Tech News',
      title: 'Latest AI breakthrough announced',
      timeAgo: '1 hour ago',
      author: 'TechReporter',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkQ1MzdBIi8+CjxyZWN0IHg9IjI0IiB5PSIxNiIgd2lkdGg9IjcyIiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzNENjlBNSIvPgo8dGV4dCB4PSI2MCIgeT0iNDQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5OZXdzPC90ZXh0Pgo8L3N2Zz4K',
      url: 'https://techcrunch.com/ai-breakthrough'
    },
    {
      category: 'Tech News',
      title: 'New startup raises $50M funding',
      timeAgo: '3 hours ago',
      author: 'StartupDaily',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzU0MTRGIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjNDc1NTY5Ii8+CjxwYXRoIGQ9Ik01MCA0MEw1NSAzNUw2MCA0MEw2NSAzNUw3MCA0MEw2NSA0NUw2MCA0MEw1NSA0NUw1MCA0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==',
      url: 'https://techcrunch.com/startup-funding'
    },
    {
      category: 'Tech News',
      title: 'Quantum computing milestone reached',
      timeAgo: '5 hours ago',
      author: 'SciTech',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkY0MTU4Ii8+CjxjaXJjbGUgY3g9IjM2IiBjeT0iMzIiIHI9IjgiIGZpbGw9IiM0QzYzODUiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI0OCIgcj0iMTAiIGZpbGw9IiM2Mzc2OTMiLz4KPGNpcmNsZSBjeD0iODQiIGN5PSIzMiIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
      url: 'https://sciencedaily.com/quantum-milestone'
    },
    {
      category: 'Tech News',
      title: 'Apple announces new product line',
      timeAgo: '7 hours ago',
      author: 'AppleInsider',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzU0MTRGIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjNDc1NTY5Ii8+CjxwYXRoIGQ9Ik01MCA0MEw1NSAzNUw2MCA0MEw2NSAzNUw3MCA0MEw2NSA0NUw2MCA0MEw1NSA0NUw1MCA0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==',
      url: 'https://appleinsider.com/new-products'
    },
    {
      category: 'Tech News',
      title: 'Meta unveils VR headset update',
      timeAgo: '8 hours ago',
      author: 'VRDaily',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzU0MTRGIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjNDc1NTY5Ii8+CjxwYXRoIGQ9Ik01MCA0MEw1NSAzNUw2MCA0MEw2NSAzNUw3MCA0MEw2NSA0NUw2MCA0MEw1NSA0NUw1MCA0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==',
      url: 'https://meta.com/vr-update'
    },
    {
      category: 'Tech News',
      title: 'Tesla robotics division expansion',
      timeAgo: '10 hours ago',
      author: 'TechTimes',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzU0MTRGIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjNDc1NTY5Ii8+CjxwYXRoIGQ9Ik01MCA0MEw1NSAzNUw2MCA0MEw2NSAzNUw3MCA0MEw2NSA0NUw2MCA0MEw1NSA0NUw1MCA0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==',
      url: 'https://tesla.com/robotics'
    },
    {
      category: 'Tech News',
      title: 'Tesla robotics division expansion',
      timeAgo: '10 hours ago',
      author: 'TechTimes',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzU0MTRGIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjNDc1NTY5Ii8+CjxwYXRoIGQ9Ik01MCA0MEw1NSAzNUw2MCA0MEw2NSAzNUw3MCA0MEw2NSA0NUw2MCA0MEw1NSA0NUw1MCA0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==',
      url: 'https://tesla.com/robotics'
    },
  ];

  const currentData = activeTab === 'events' ? techEvents : techNews;
  const currentTitle = activeTab === 'events' ? 'Tech Events' : 'Tech News';

  const closeNewsPopup = () => {
    setSelectedNewsItem(null);
  };

  return (
    <>
      <div className="relative h-full">
        <Container size="xl" variant="default" className="w-[34rem] h-full overflow-hidden ">
          <div className="h-full flex flex-col p-2">
            {/* Header with Title and Toggle - Fixed */}
            <div className="px-4 py-8 border-b border-secondary-800/30 flex-shrink-0">
              <h1 className="text-white text-3xl font-medium mb-6">{currentTitle}</h1>

              {/* Toggle Component with Container styling */}
              <Toggle
                options={['Events', 'News']}
                activeOption={activeTab === 'events' ? 'Events' : 'News'}
                onOptionChange={(option) => setActiveTab(option.toLowerCase() as 'events' | 'news')}
              />
            </div>

            {/* Scrollable Content Area with custom scrollbar */}
            <div className="flex-1 min-h-0">
              <div className="custom-scrollbar h-full overflow-y-auto px-4 pb-6">
                <div className="pt-6">
                  {currentData.map((item, index) => (
                    <div key={`${activeTab}-${index}`}>
                      <EventCard
                        category={item.category}
                        title={item.title}
                        timeAgo={item.timeAgo}
                        author={item.author}
                        image={item.image}
                        onClick={() => {
                          if (activeTab === 'news') {
                            const newsItem = item as NewsItem;
                            setSelectedNewsItem(newsItem);
                          } else {
                            console.log('Event clicked:', item.title);
                          }
                        }}
                      />
                      {/* Separator line between cards */}
                      {index < currentData.length - 1 && (
                        <div className="my-3 h-px bg-gradient-to-r from-secondary-700 via-secondary-400 to-secondary-700" />
                      )}
                    </div>
                  ))}

                  {/* Load more indicator */}
                  <div className="pt-4 pb-2">
                    <div className="text-center">
                      <span className="text-tertiary-light text-sm">
                        {currentData.length} {activeTab} loaded
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* News Item Popup */}
      {selectedNewsItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative">
            {/* Outer stroke for popup */}
            <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

            {/* News item popup container */}
            <div className="w-[32rem] max-h-[85vh] bg-background-dark/95 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col relative border border-secondary-800/20">
              {/* Header with close button */}
              <div className="px-6 py-6 border-b border-secondary-800/30 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {selectedNewsItem.category}
                  </span>
                  <span className="text-secondary-400 text-sm">
                    {selectedNewsItem.timeAgo} • {selectedNewsItem.author}
                  </span>
                </div>
                <button
                  onClick={closeNewsPopup}
                  className="text-secondary-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-secondary-800/30"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* News content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div
                  className="custom-scrollbar flex-1 overflow-y-auto px-6 pb-6"
                >
                  <div className="space-y-6">
                    {/* Article Image */}
                    <div className="w-full h-48 rounded-lg overflow-hidden border border-secondary-800/30">
                      <img
                        src={selectedNewsItem.image}
                        alt={selectedNewsItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Article Title */}
                    <h1 className="text-white text-2xl font-bold leading-tight">
                      {selectedNewsItem.title}
                    </h1>

                    {/* Article Content */}
                    <div className="text-secondary-300 leading-relaxed space-y-4">
                      <p>
                        This is a sample news article content. In a real application, you would fetch the full article content from your backend or news API. The article would contain the complete story with proper formatting, images, and links.
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => window.open(selectedNewsItem.url, '_blank', 'noopener,noreferrer')}
                        className="flex-1 bg-primary hover:bg-primary-600 text-white px-4 py-3 rounded-lg transition-colors font-medium shadow-md"
                      >
                        Read Full Article
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedNewsItem.url);
                          // You could add a toast notification here
                        }}
                        className="px-4 py-3 bg-secondary-800/40 hover:bg-secondary-700/50 text-secondary-300 hover:text-white rounded-lg transition-colors border border-secondary-700/30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
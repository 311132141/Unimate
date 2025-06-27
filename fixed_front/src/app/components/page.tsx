'use client';

import React, { useState } from 'react';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { EventCard } from '@/components/EventCard';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';


// Component showcases that allow us to test each component individually
export default function ComponentShowcase() {
  const [activeComponent, setActiveComponent] = useState<string>('Button');

  const components = [
    'Button',
    'Input',
    'EventCard',
    'Header',
    'Container',

  ];

  const renderButtonShowcase = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-4">Button Component</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Variants</h3>
          <div className="flex flex-wrap gap-4 p-2">
            <Button variant="primary">Primary Button</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Sizes</h3>
          <div className="flex flex-wrap gap-4 items-center p-2">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">States</h3>
          <div className="flex flex-wrap gap-4 p-2">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button fullWidth>Full Width</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">With Icons</h3>
          <div className="flex flex-wrap gap-4 p-2">
            <Button
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
              iconPosition="left"
            >
              Left Icon
            </Button>
            <Button
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
              iconPosition="right"
            >
              Right Icon
            </Button>
          </div>
        </div>






      </div>
    </div>
  );

  const renderInputShowcase = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-4">Input Component</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Sizes</h3>
          <div className="space-y-4 max-w-md">
            <Input size="small" placeholder="Small input" />
            <Input size="medium" placeholder="Medium input" />
            <Input size="large" placeholder="Large input" />
            <Input size="button-large" placeholder="Button large input" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">With Icons</h3>
          <div className="space-y-4 max-w-md">
            <Input
              placeholder="Search..."
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <Input
              placeholder="Enter password"
              type="password"
              rightIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">States</h3>
          <div className="space-y-4 max-w-md">
            <Input placeholder="Normal state" />
            <Input placeholder="Error state" error />
            <Input placeholder="Disabled state" disabled />
            <Input placeholder="Full width" fullWidth />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventCardShowcase = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-4">EventCard Component</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">With Image</h3>
          <div className="max-w-md">
            <EventCard
              category="Tech Events"
              title="React Development Workshop"
              timeAgo="2 hours ago"
              author="TechHub"
              image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNEE1NTY4Ii8+CjxwYXRoIGQ9Ik0zNCAyOEgzOFYzMkg0MlYzNkg0NlY0MEg0MlY0NEgzOFY0MEgzNFYzNlpNNTAgMjhINTRWMzJINThWMzZINjJWNDBINThWNDRINTRWNDBINTBWMzZaTTY2IDI4SDcwVjMySDc0VjM2SDc4VjQwSDc0VjQ0SDcwVjQwSDY2VjM2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K"
              onClick={() => console.log('Event clicked')}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Without Image</h3>
          <div className="max-w-md">
            <EventCard
              category="Study Group"
              title="Mathematics Study Session - Linear Algebra Focus"
              timeAgo="4 hours ago"
              author="MathClub"
              onClick={() => console.log('Event clicked')}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Different Categories</h3>
          <div className="space-y-4 max-w-md">
            <EventCard
              category="Sports"
              title="Basketball Tournament Finals"
              timeAgo="1 day ago"
              author="SportsCentral"
            />
            <EventCard
              category="Social"
              title="Welcome Party for New Students"
              timeAgo="3 days ago"
              author="StudentUnion"
            />
            <EventCard
              category="Academic"
              title="Research Presentation: AI in Education"
              timeAgo="1 week ago"
              author="CS Department"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeaderShowcase = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-4">Header Component</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Default Header</h3>
          <div className="border border-secondary-800/30 rounded-lg overflow-hidden">
            <Header />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">With Search Value</h3>
          <div className="border border-secondary-800/30 rounded-lg overflow-hidden">
            <Header
              searchValue="React workshop"
              onSearchChange={(value) => console.log('Search:', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContainerShowcase = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-4">Container Component</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Container Sizes</h3>
          <div className="space-y-4 p-4">
            <Container size="xs" variant="default">
              <p className="text-white text-sm">XS Container - p-2 padding</p>
            </Container>

            <Container size="sm" variant="default">
              <p className="text-white">SM Container - p-3 padding</p>
            </Container>

            <Container size="md" variant="default">
              <p className="text-white">MD Container - p-4 padding</p>
            </Container>

            <Container size="lg" variant="default">
              <p className="text-white">LG Container - p-5 padding</p>
            </Container>

            <Container size="xl" variant="default">
              <p className="text-white">XL Container - p-6 padding</p>
            </Container>

            <Container size="2xl" variant="default">
              <p className="text-white">2XL Container - p-8 padding</p>
            </Container>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Container Variants</h3>
          <div className="space-y-4 p-4">
            <Container size="lg" variant="default">
              <h4 className="text-white font-semibold mb-2">Default Container</h4>
              <p className="text-secondary-300">
                Default container with gradient border and dark background. Perfect for main content areas.
              </p>
            </Container>

            <Container size="lg" variant="glass">
              <h4 className="text-white font-semibold mb-2">Glass Container</h4>
              <p className="text-secondary-300">
                Glassmorphism effect with blur, transparency, and subtle white borders.
              </p>
            </Container>

            <Container size="lg" variant="elevated">
              <h4 className="text-white font-semibold mb-2">Elevated Container</h4>
              <p className="text-secondary-300">
                Elevated appearance with primary color gradient, shadows, and enhanced depth.
              </p>
            </Container>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Nested Containers</h3>
          <div className="space-y-4 p-4">
            <Container size="2xl" variant="elevated">
              <h4 className="text-white text-xl font-bold mb-4">Outer Container (2XL Elevated)</h4>
              <div className="space-y-4">
                <Container size="lg" variant="glass">
                  <h5 className="text-white font-semibold mb-2">Nested Glass Container (LG)</h5>
                  <p className="text-secondary-300 mb-4">
                    This demonstrates perfect nesting with calculated radii and thickness.
                  </p>
                  <Container size="sm" variant="default">
                    <p className="text-white text-sm">Inner Default Container (SM)</p>
                  </Container>
                </Container>
                <Container size="md" variant="default">
                  <p className="text-white">Sibling Container (MD)</p>
                </Container>
              </div>
            </Container>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Size Comparison Grid</h3>
          <div className="grid grid-cols-3 gap-4 p-4">
            <Container size="xs" variant="glass">
              <p className="text-white text-xs">XS</p>
            </Container>
            <Container size="sm" variant="glass">
              <p className="text-white text-sm">SM</p>
            </Container>
            <Container size="md" variant="glass">
              <p className="text-white">MD</p>
            </Container>
            <Container size="lg" variant="glass">
              <p className="text-white">LG</p>
            </Container>
            <Container size="xl" variant="glass">
              <p className="text-white">XL</p>
            </Container>
            <Container size="2xl" variant="glass">
              <p className="text-white">2XL</p>
            </Container>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Real World Examples</h3>
          <div className="space-y-4">
            <Container size="xl" variant="default">
              <div className="space-y-4">
                <h4 className="text-white text-xl font-bold">Article Container</h4>
                <p className="text-secondary-300 leading-relaxed">
                  Large container for main content with proper spacing and visual hierarchy.
                  The calculated radius ensures perfect border alignment.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">A</span>
                  </div>
                  <span className="text-secondary-400 text-sm">by Author • 2 hours ago</span>
                </div>
              </div>
            </Container>

            <Container size="lg" variant="glass">
              <div className="space-y-4">
                <h4 className="text-white text-xl font-bold">Feature Card</h4>
                <p className="text-secondary-300 leading-relaxed">
                  Medium-large glass container perfect for highlighting special features
                  with premium visual effects.
                </p>
                <Button size="small">Learn More</Button>
              </div>
            </Container>

            <Container size="md" variant="elevated">
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Quick Action</h4>
                <p className="text-secondary-300">
                  Compact elevated container for CTAs and notifications.
                </p>
                <Button size="small">Take Action</Button>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Button':
        return renderButtonShowcase();
      case 'Input':
        return renderInputShowcase();
      case 'EventCard':
        return renderEventCardShowcase();
      case 'Header':
        return renderHeaderShowcase();
      case 'Container':
        return renderContainerShowcase();

      default:
        return renderButtonShowcase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark via-background-dark to-surface-dark">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 min-h-screen bg-background-dark/95 backdrop-blur-sm border-r border-secondary-800/30 p-6">
          <h1 className="text-white text-xl font-bold mb-6">Component Showcase</h1>
          <nav className="space-y-2">
            {components.map((component) => (
              <button
                key={component}
                onClick={() => setActiveComponent(component)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${activeComponent === component
                  ? 'bg-primary text-white'
                  : 'text-secondary-300 hover:text-white hover:bg-secondary-800/30'
                  }`}
              >
                {component}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client'

import React from 'react'
import { Button } from '../Button'

// Example icons (you can replace with your preferred icon library)
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M12.6667 4V13.3333C12.6667 14.0697 12.0697 14.6667 11.3333 14.6667H4.66667C3.93029 14.6667 3.33333 14.0697 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93029 5.93029 1.33333 6.66667 1.33333H9.33333C10.0697 1.33333 10.6667 1.93029 10.6667 2.66667V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33333 8H12.6667M12.6667 8L8 3.33333M12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function ButtonExamples() {
  const [loading, setLoading] = React.useState(false)

  const handleLoadingDemo = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="p-8 space-y-12 bg-background text-foreground">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Button Component Examples</h1>
        <p className="text-muted-foreground">
          Comprehensive examples of the Button component matching the Figma design system.
        </p>
      </div>

      {/* Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Sizes</h2>
        <div className="flex flex-wrap items-end gap-4">
          <Button size="small">Small</Button>
          <Button size="medium">Medium (Default)</Button>
          <Button size="large">Large</Button>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">With Icons</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button icon={<PlusIcon />}>Add Item</Button>
            <Button variant="secondary" icon={<PlusIcon />}>
              Create New
            </Button>
            <Button variant="outline" iconRight={<ArrowRightIcon />}>
              Continue
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button variant="destructive" icon={<TrashIcon />} size="small">
              Delete
            </Button>
            <Button variant="ghost" iconRight={<ArrowRightIcon />} size="large">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Icon Only Buttons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Icon Only</h2>
        <div className="flex flex-wrap gap-4">
          <Button size="icon" icon={<PlusIcon />} aria-label="Add item" />
          <Button size="icon-sm" variant="secondary" icon={<PlusIcon />} aria-label="Add item" />
          <Button size="icon-lg" variant="outline" icon={<TrashIcon />} aria-label="Delete item" />
        </div>
      </section>

      {/* States */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">States</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading={loading} onClick={handleLoadingDemo}>
              {loading ? 'Loading...' : 'Click for Loading'}
            </Button>
          </div>
        </div>
      </section>

      {/* Full Width */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Full Width</h2>
        <div className="space-y-4 max-w-md">
          <Button fullWidth>Full Width Primary</Button>
          <Button fullWidth variant="outline" icon={<PlusIcon />}>
            Full Width with Icon
          </Button>
        </div>
      </section>

      {/* Backward Compatibility */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Backward Compatibility</h2>
        <p className="text-sm text-muted-foreground">
          These examples show that the component maintains backward compatibility with existing code.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" size="sm">Old: default + sm</Button>
          <Button variant="default" size="lg">Old: default + lg</Button>
          <Button size="default">Old: size default</Button>
        </div>
      </section>

      {/* Real-world Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Real-world Examples</h2>
        <div className="space-y-6">
          {/* Form Actions */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Form Actions</h3>
            <div className="flex gap-3">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>

          {/* Card Actions */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Card Actions</h3>
            <div className="flex gap-2">
              <Button size="small" variant="ghost">Edit</Button>
              <Button size="small" variant="ghost">Share</Button>
              <Button size="small" variant="destructive">Delete</Button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Call to Action</h3>
            <div className="text-center space-y-4">
              <Button size="large" iconRight={<ArrowRightIcon />}>
                Get Started Today
              </Button>
              <div>
                <Button variant="link">Learn more about our features</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 
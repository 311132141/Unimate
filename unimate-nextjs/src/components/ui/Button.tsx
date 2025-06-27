import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles with accessibility and focus states
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:flex-shrink-0",
  {
    variants: {
      variant: {
        // Primary button - matches Figma #5872c6 with exact styling
        primary: [
          "bg-primary text-primary-foreground shadow-lg",
          "hover:bg-primary/90 hover:shadow-xl",
          "active:bg-primary/95 active:scale-[0.98]",
          "backdrop-blur-[15.41px]", // Exact Figma blur
          "border border-white/10",
        ].join(" "),

        // Default alias for primary (backward compatibility)
        default: [
          "bg-primary text-primary-foreground shadow-lg",
          "hover:bg-primary/90 hover:shadow-xl",
          "active:bg-primary/95 active:scale-[0.98]",
          "backdrop-blur-[15.41px]", // Exact Figma blur
          "border border-white/10",
        ].join(" "),

        // Secondary button - subtle with border
        secondary: [
          "bg-secondary/80 text-secondary-foreground border border-white/10",
          "hover:bg-secondary hover:border-white/20",
          "active:bg-secondary/90 active:scale-[0.98]",
          "backdrop-blur-sm shadow-sm",
        ].join(" "),

        // Outline button - transparent with border
        outline: [
          "border border-white/20 bg-transparent text-foreground",
          "hover:bg-white/5 hover:border-white/30",
          "active:bg-white/10 active:scale-[0.98]",
          "backdrop-blur-sm",
        ].join(" "),

        // Ghost button - minimal styling
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-white/5",
          "active:bg-white/10 active:scale-[0.98]",
        ].join(" "),

        // Destructive button - for dangerous actions
        destructive: [
          "bg-destructive text-destructive-foreground shadow-lg",
          "hover:bg-destructive/90 hover:shadow-xl",
          "active:bg-destructive/95 active:scale-[0.98]",
          "backdrop-blur-sm border border-red-500/20",
        ].join(" "),

        // Link button - text only
        link: [
          "text-primary underline-offset-4",
          "hover:underline hover:text-primary/80",
          "active:text-primary/90",
        ].join(" "),
      },
      size: {
        // Small button - compact for secondary actions
        small: [
          "h-8 px-3 py-1.5 text-sm rounded-lg",
          "[&_svg]:size-3.5",
          "gap-1.5",
        ].join(" "),

        // sm alias for small (backward compatibility)
        sm: [
          "h-8 px-3 py-1.5 text-sm rounded-lg",
          "[&_svg]:size-3.5",
          "gap-1.5",
        ].join(" "),

        // Medium button - default size matching Figma
        medium: [
          "h-11 px-6 py-2.5 text-base rounded-xl",
          "[&_svg]:size-4",
          "gap-2",
          "font-medium tracking-wide", // Matches Figma typography
        ].join(" "),

        // default alias for medium (backward compatibility)
        default: [
          "h-11 px-6 py-2.5 text-base rounded-xl",
          "[&_svg]:size-4",
          "gap-2",
          "font-medium tracking-wide", // Matches Figma typography
        ].join(" "),

        // Large button - prominent for primary actions
        large: [
          "h-12 px-8 py-3 text-lg rounded-xl",
          "[&_svg]:size-5",
          "gap-2.5",
          "font-medium tracking-wide",
        ].join(" "),

        // lg alias for large (backward compatibility)
        lg: [
          "h-12 px-8 py-3 text-lg rounded-xl",
          "[&_svg]:size-5",
          "gap-2.5",
          "font-medium tracking-wide",
        ].join(" "),

        // Icon only button - square aspect ratio
        icon: [
          "size-11 p-0 rounded-xl",
          "[&_svg]:size-5",
        ].join(" "),

        // Small icon button
        "icon-sm": [
          "size-8 p-0 rounded-lg",
          "[&_svg]:size-4",
        ].join(" "),

        // Large icon button
        "icon-lg": [
          "size-12 p-0 rounded-xl",
          "[&_svg]:size-6",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  /**
   * Render as a child component (using Radix Slot)
   */
  asChild?: boolean

  /**
   * Icon to display before the button text
   */
  icon?: React.ReactNode

  /**
   * Icon to display after the button text
   */
  iconRight?: React.ReactNode

  /**
   * Make the button full width
   */
  fullWidth?: boolean

  /**
   * Loading state - shows spinner and disables interaction
   */
  loading?: boolean

  /**
   * Custom aria-label for accessibility
   */
  "aria-label"?: string
}

const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
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
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconRight,
      fullWidth = false,
      loading = false,
      disabled,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    // Auto-generate aria-label for icon-only buttons if not provided
    const isIconOnly = !children && (icon || iconRight)
    const computedAriaLabel = ariaLabel || (isIconOnly ? "Button" : undefined)

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          loading && "cursor-wait",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-label={computedAriaLabel}
        data-loading={loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner className="size-4" />
            {children && <span className="opacity-70">{children}</span>}
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }

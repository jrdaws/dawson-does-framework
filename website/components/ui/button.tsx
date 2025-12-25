import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.25)] hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(249,115,22,0.35)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-orange-500 hover:text-orange-500",
        secondary:
          "border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-orange-500 hover:text-orange-500",
        success:
          "bg-emerald-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:bg-emerald-600 hover:-translate-y-0.5",
        ghost: "hover:bg-orange-500/10 hover:text-orange-500",
        link: "text-orange-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  if (asChild) {
    // Cast to any to handle React 18/19 type mismatch with @radix-ui/react-slot
    const SlotComponent = Slot as React.ComponentType<Record<string, unknown>>
    return (
      <SlotComponent
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
}

export { Button, buttonVariants }

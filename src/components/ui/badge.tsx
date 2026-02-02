import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/utils/ui.ts"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-slate-200  font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-800",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        success:
          "border-transparent bg-green-500 text-slate-50 shadow hover:bg-green-500/80 dark:bg-green-900 dark:text-green-50 dark:hover:bg-green-900/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/80",
        outline: "text-slate-950 dark:text-slate-50",
      },
      size: {
        tiny: "px-2.5 py-0.5 text-xs",
        small: "px-3 py-1 text-sm",
        medium: "px-4 py-1.5 text-base",
        large: "px-8 py-2 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "small",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

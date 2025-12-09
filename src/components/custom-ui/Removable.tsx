import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { IoCloseCircle } from "react-icons/io5"
import { cn } from "@/utils/ui.ts"

const removableVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-800",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-black dark:bg-slate-800 dark:text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        card: "h-full p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface RemovableProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof removableVariants> {
  asChild?: boolean
  onRemove?: () => void
  showRemove?: boolean
}

const Removable = React.forwardRef<HTMLDivElement, RemovableProps>(
  (
    {
      className,
      variant,
      size,
      showRemove = true,
      asChild = false,
      children,
      onRemove,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        className={cn(removableVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {showRemove && (
          <button type="button" onClick={onRemove} className="ml-2">
            <IoCloseCircle size={26} />
          </button>
        )}
      </Comp>
    )
  }
)
Removable.displayName = "Removable"

export { Removable, removableVariants }

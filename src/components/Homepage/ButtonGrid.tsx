import { cn } from "@/utils/ui"
import * as React from "react"

type Props = React.HTMLAttributes<HTMLDivElement>

export const ButtonGrid = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }: Props, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full flex-1 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] grid-rows-[repeat(auto-fill,7rem)] content-start items-start justify-center gap-4",
          className
        )}
        {...props}
      />
    )
  }
)

ButtonGrid.displayName = "ButtonGrid"

import { cn } from "@/utils/ui"
import * as React from "react"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  length?: number
}

export const ButtonGrid = React.forwardRef<HTMLDivElement, Props>(
  ({ className, length, ...props }: Props, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full flex-1 auto-rows-[7rem] content-start items-start justify-center gap-4 max-sm:auto-rows-[5rem] max-sm:grid-cols-1",
          cols(length),
          className
        )}
        {...props}
      />
    )
  }
)

const cols = (layout?: number) => {
  switch (layout) {
    case 0:
      return ""
    case 1:
      return "grid-cols-1"
    case 2:
      return "grid-cols-2"
    case 3:
      return "grid-cols-3"
    default:
      return "grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]"
  }
}

ButtonGrid.displayName = "ButtonGrid"

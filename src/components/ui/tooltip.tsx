import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/utils/ui.ts"

const TooltipProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
>(({
  delayDuration = 0,
  ...props
}, _ref) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
})

const TooltipTrigger = TooltipPrimitive.Trigger

const Tooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    useTouch?: boolean;
    useTap?: boolean;
  }
>(({ useTouch = false, useTap = false, children, ...props }, _ref) => {
  const [open, setOpen] = React.useState(false);

  const handleTouch = (event: React.TouchEvent | React.MouseEvent) => {
    event.persist();
    setOpen(true);
  };

  return (
    <TooltipPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && useTouch) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onTouchStart: handleTouch,
            onMouseDown: handleTouch,
          });
        }
        return child;
      })}
    </TooltipPrimitive.Root>
  );
});
Tooltip.displayName = TooltipPrimitive.Root.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin] dark:bg-slate-50 dark:text-slate-900",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

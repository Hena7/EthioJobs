'use client'

"use client"

import { Tooltip } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({ ...props }: Tooltip.Provider.Props) {
  return <Tooltip.Provider data-slot="tooltip-provider" {...props} />
}

function TooltipRoot({ ...props }: Tooltip.Root.Props) {
  return <Tooltip.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ className, ...props }: Tooltip.Trigger.Props) {
  return (
    <Tooltip.Trigger
      data-slot="tooltip-trigger"
      className={cn("", className)}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: Tooltip.Popup.Props & { sideOffset?: number }) {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={sideOffset}>
        <Tooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md data-[transition-status=open]:animate-in data-[transition-status=closed]:animate-out data-[transition-status=closed]:fade-out-0 data-[transition-status=open]:fade-in-0 data-[transition-status=closed]:zoom-out-95 data-[transition-status=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
            className
          )}
          {...props}
        />
      </Tooltip.Positioner>
    </Tooltip.Portal>
  )
}

export {
  TooltipProvider,
  TooltipRoot as Tooltip,
  TooltipTrigger,
  TooltipContent,
}


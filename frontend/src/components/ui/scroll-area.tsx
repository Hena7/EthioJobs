'use client'

"use client"

import { ScrollArea } from "@base-ui/react/scroll-area"

import { cn } from "@/lib/utils"

function ScrollAreaRoot({
  className,
  children,
  ...props
}: ScrollArea.Root.Props) {
  return (
    <ScrollArea.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollArea.Viewport className="size-full rounded-[inherit]">
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="vertical"
        className={cn(
          "flex touch-none select-none transition-colors",
          "h-full w-2.5 border-l border-l-transparent p-px data-[transition-status=hidden]:opacity-0"
        )}
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className={cn(
          "flex touch-none select-none transition-colors",
          "h-2.5 flex-col border-t border-t-transparent p-px data-[transition-status=hidden]:opacity-0"
        )}
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-border" />
    </ScrollArea.Root>
  )
}

export { ScrollAreaRoot as ScrollArea }


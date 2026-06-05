"use client"

import { Drawer } from "@base-ui/react/drawer"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type Side = "top" | "bottom" | "left" | "right"

const sideStyles: Record<Side, string> = {
  top: "inset-x-0 top-0 border-b data-[transition-status=open]:slide-in-from-top data-[transition-status=closed]:slide-out-to-top",
  bottom:
    "inset-x-0 bottom-0 border-t data-[transition-status=open]:slide-in-from-bottom data-[transition-status=closed]:slide-out-to-bottom",
  left: "inset-y-0 left-0 h-full w-3/4 border-r data-[transition-status=open]:slide-in-from-left data-[transition-status=closed]:slide-out-to-left sm:max-w-sm",
  right:
    "inset-y-0 right-0 h-full w-3/4 border-l data-[transition-status=open]:slide-in-from-right data-[transition-status=closed]:slide-out-to-right sm:max-w-sm",
}

function SheetRoot({ ...props }: Drawer.Root.Props) {
  return <Drawer.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ className, ...props }: Drawer.Trigger.Props) {
  return (
    <Drawer.Trigger
      data-slot="sheet-trigger"
      className={cn("", className)}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: Drawer.Popup.Props & { side?: Side }) {
  return (
    <Drawer.Portal>
      <Drawer.Backdrop
        data-slot="sheet-overlay"
        className={cn(
          "fixed inset-0 z-50 bg-black/50 data-[transition-status=open]:animate-in data-[transition-status=closed]:animate-out data-[transition-status=closed]:fade-out-0 data-[transition-status=open]:fade-in-0"
        )}
      />
      <Drawer.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[transition-status=open]:animate-in data-[transition-status=closed]:animate-out data-[transition-status=closed]:duration-200 data-[transition-status=open]:duration-300",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        <Drawer.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          <X />
          <span className="sr-only">Close</span>
        </Drawer.Close>
      </Drawer.Popup>
    </Drawer.Portal>
  )
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: Drawer.Title.Props) {
  return (
    <Drawer.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: Drawer.Description.Props) {
  return (
    <Drawer.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  SheetRoot as Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

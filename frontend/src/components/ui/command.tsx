"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog } from "@base-ui/react/dialog"

function CommandDialog({
  children,
  ...props
}: Dialog.Root.Props) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className="fixed inset-0 z-50 bg-black/50 data-[transition-status=open]:animate-in data-[transition-status=closed]:animate-out data-[transition-status=closed]:fade-out-0 data-[transition-status=open]:fade-in-0"
        />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[540px] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg data-[transition-status=open]:animate-in data-[transition-status=closed]:animate-out data-[transition-status=closed]:fade-out-0 data-[transition-status=open]:fade-in-0 data-[transition-status=closed]:zoom-out-95 data-[transition-status=open]:zoom-in-95"
          )}
        >
          <>{children}</>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function CommandInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center border-b px-3"
    >
      <Search className="mr-2 size-4 shrink-0 opacity-50" />
      <input
        data-slot="command-input"
        className={cn(
          "flex h-11 w-full rounded-lg bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-list"
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { heading?: string }) {
  return (
    <div
      data-slot="command-group"
      className={cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className)}
      {...props}
    >
      {heading && (
        <div cmdk-group-heading="">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
}

function CommandItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
}

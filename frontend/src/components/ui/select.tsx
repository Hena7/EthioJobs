'use client'

"use client"

import { Select } from "@base-ui/react/select"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

function SelectRoot({
  ...props
}: Select.Root.Props<unknown>) {
  return <Select.Root data-slot="select" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: Select.Trigger.Props) {
  return (
    <Select.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <Select.Icon className="pointer-events-none shrink-0 opacity-50">
        <ChevronDown className="size-4" />
      </Select.Icon>
    </Select.Trigger>
  )
}

function SelectValue({
  className,
  ...props
}: Select.Value.Props) {
  return (
    <Select.Value
      data-slot="select-value"
      className={cn("flex-1 truncate text-left", className)}
      {...props}
    />
  )
}

function SelectContent({
  className,
  ...props
}: Select.Popup.Props) {
  return (
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup
          data-slot="select-content"
          className={cn(
            "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 data-[side]:data-[transition-status=open]:translate-x-0 data-[side]:data-[transition-status=open]:translate-y-0 data-[transition-status=open]:animate-in data-[transition-status=closed]:animate-out data-[transition-status=closed]:fade-out-0 data-[transition-status=open]:fade-in-0 data-[transition-status=closed]:zoom-out-95 data-[transition-status=open]:zoom-in-95",
            className
          )}
          {...props}
        />
      </Select.Positioner>
    </Select.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: Select.Item.Props) {
  return (
    <Select.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <Select.ItemIndicator className="absolute left-2 flex size-3.5 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </Select.ItemIndicator>
      <Select.ItemText className="ml-6">{children}</Select.ItemText>
    </Select.Item>
  )
}

function SelectGroup({
  className,
  ...props
}: Select.Group.Props) {
  return (
    <Select.Group
      data-slot="select-group"
      className={cn("", className)}
      {...props}
    />
  )
}

function SelectLabel({
  className,
  ...props
}: Select.GroupLabel.Props) {
  return (
    <Select.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  SelectRoot as Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
}


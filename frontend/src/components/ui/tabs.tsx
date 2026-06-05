"use client"

import { Tabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

function TabsRoot({ className, ...props }: Tabs.Root.Props) {
  return (
    <Tabs.Root
      data-slot="tabs"
      className={cn("", className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: Tabs.List.Props) {
  return (
    <Tabs.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: Tabs.Tab.Props) {
  return (
    <Tabs.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: Tabs.Panel.Props) {
  return (
    <Tabs.Panel
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export {
  TabsRoot as Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
}

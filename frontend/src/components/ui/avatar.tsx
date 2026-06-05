"use client"

import { Avatar } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"

function AvatarRoot({
  className,
  ...props
}: Avatar.Root.Props) {
  return (
    <Avatar.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: Avatar.Image.Props) {
  return (
    <Avatar.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: Avatar.Fallback.Props) {
  return (
    <Avatar.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium",
        className
      )}
      {...props}
    />
  )
}

export { AvatarRoot as Avatar, AvatarImage, AvatarFallback }

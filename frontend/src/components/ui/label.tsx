'use client'

"use client"

import { Field } from "@base-ui/react/field"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: Field.Label.Props) {
  return (
    <Field.Label
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }


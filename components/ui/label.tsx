"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import styles from "./Label.module.css"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(styles.root, className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

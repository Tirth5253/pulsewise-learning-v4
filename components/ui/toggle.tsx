"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import styles from "./Toggle.module.css"

const toggleVariants = cva(styles.toggleVariants, {
  variants: {
    variant: {
      default: styles.toggleVariantsDefault,
      outline: styles.toggleVariantsOutline,
    },
    size: {
      default: styles.toggleVariantsSizeDefault,
      sm: styles.toggleVariantsSizeSm,
      lg: styles.toggleVariantsSizeLg,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

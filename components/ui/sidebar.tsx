"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import styles from "./Sidebar.module.css"

const sidebarVariants = cva(styles.sidebarVariants, {
  variants: {
    variant: {
      default: styles.sidebarVariantsDefault,
      outline: styles.sidebarVariantsOutline,
    },
    size: {
      default: styles.sidebarVariantsSizeDefault,
      sm: styles.sidebarVariantsSizeSm,
      lg: styles.sidebarVariantsSizeLg,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      className={cn(sidebarVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
)
Sidebar.displayName = "Sidebar"

export { Sidebar, sidebarVariants }

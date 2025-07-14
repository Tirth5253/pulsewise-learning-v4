import * as React from "react"
import styles from "./Badge.module.css"

import { cn } from "@/lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn(styles.root, styles[variant], className)} {...props} />
  )
}

export { Badge }

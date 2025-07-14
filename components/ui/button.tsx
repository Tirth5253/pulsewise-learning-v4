import * as React from "react"
import styles from "./Button.module.css"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
  className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? ("span" as any) : "button"
    return (
      <Comp
        ref={ref}
        className={`
          ${styles.button}
          ${styles[variant] || ""}
          ${styles[size] || ""}
          ${className}
        `}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

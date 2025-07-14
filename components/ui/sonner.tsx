"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import styles from "./Sonner.module.css"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={styles.toaster}
      toastOptions={{
        classNames: {
          actionButton: styles.actionButton,
          cancelButton: styles.cancelButton,
          closeButton: styles.closeButton,
          description: styles.description,
          error: styles.error,
          icon: styles.icon,
          loader: styles.loader,
          success: styles.success,
          title: styles.title,
          toast: styles.toast,
          warning: styles.warning,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

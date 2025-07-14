"use client"

import { useEffect, useState } from "react"
import styles from "./UseMobile.module.css"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

export function MobileOnly({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile()

  if (!isMobile) return null

  return <div className={styles.mobileOnly}>{children}</div>
}

export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile()

  if (isMobile) return null

  return <div className={styles.desktopOnly}>{children}</div>
}

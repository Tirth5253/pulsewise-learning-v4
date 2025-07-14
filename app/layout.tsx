import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Learning Hub - Master Design & Development Skills",
  description:
    "Interactive learning platform for design and development skills. Track your progress and learn at your own pace.",
  keywords: "learning, design, development, UX, UI, accessibility, user research",
  authors: [{ name: "Learning Hub" }],
  generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

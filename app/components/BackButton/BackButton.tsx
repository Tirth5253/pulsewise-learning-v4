import Link from "next/link"
import styles from "./BackButton.module.css"

interface BackButtonProps {
  href: string
  label?: string,
  className?: string
}

export default function BackButton({ href, label, className }: BackButtonProps) {
  return (
    <Link href={href} className={className ? className : styles.backButton}>
      <div className={className ? className : styles.backIcon}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className ? className : ""}>
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span>Back</span>
    </Link>
  )
}

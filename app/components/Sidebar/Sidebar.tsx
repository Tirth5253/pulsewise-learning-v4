"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import styles from "./Sidebar.module.css"

interface Subject {
  id: string
  title: string
  description: string
  image: string
  category: string
  totalLessons: number
  color: string
}

interface Lesson {
  id: string
  subjectId: string
  title: string
  description: string
  order: number
  totalCards: number
}

interface SidebarProps {
  subjects: Subject[]
  lessons?: Lesson[]
  currentSubjectId?: string
  currentLessonId?: string
}

export default function Sidebar({ subjects, lessons = [], currentSubjectId, currentLessonId }: SidebarProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    currentSubjectId ? new Set([currentSubjectId]) : new Set(),
  )
  const [isOpen, setIsOpen] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

  // Load completed lessons from localStorage
  useEffect(() => {
    const completed = new Set<string>()
    lessons.forEach((lesson) => {
      const isCompleted = localStorage.getItem(`lesson_${lesson.id}_completed`) === "true"
      if (isCompleted) {
        completed.add(lesson.id)
      }
    })
    setCompletedLessons(completed)
  }, [lessons])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects)
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId)
    } else {
      newExpanded.add(subjectId)
    }
    setExpandedSubjects(newExpanded)
  }

  const getSubjectLessons = (subjectId: string) => {
    return lessons.filter((lesson) => lesson.subjectId === subjectId).sort((a, b) => a.order - b.order)
  }

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.has(lessonId)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className={styles.mobileToggle} onClick={toggleSidebar} aria-label="Toggle sidebar">
        <div className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/learning" className={styles.logoLink}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className={styles.sidebarTitle}>Learning Hub</h2>
            </div>
          </Link>
          <button className={styles.closeButton} onClick={toggleSidebar} aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.subjectsList}>
          {subjects.map((subject) => {
            const subjectLessons = getSubjectLessons(subject.id)
            const isExpanded = expandedSubjects.has(subject.id)
            const completedCount = subjectLessons.filter((lesson) => isLessonCompleted(lesson.id)).length
            const progressPercentage =
              subjectLessons.length > 0 ? Math.round((completedCount / subjectLessons.length) * 100) : 0

            return (
              <div key={subject.id} className={styles.subjectGroup}>
                <div
                  className={`${styles.subjectItem} ${currentSubjectId === subject.id ? styles.active : ""}`}
                  onClick={() => toggleSubject(subject.id)}
                >
                  <div className={styles.subjectIcon}>
                    <img src={subject.image || "/placeholder.svg"} alt={subject.title} />
                  </div>
                  <div className={styles.subjectInfo}>
                    <h3 className={styles.subjectTitle}>{subject.title}</h3>
                    <div className={styles.subjectProgress}>
                      {completedCount}/{subject.totalLessons} completed • {progressPercentage}%
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                  <div className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 4L10 8L6 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {isExpanded && subjectLessons.length > 0 && (
                  <div className={styles.lessonsDropdown}>
                    {subjectLessons.map((lesson, index) => {
                      const isCompleted = isLessonCompleted(lesson.id)
                      const isCurrentLesson = currentLessonId === lesson.id

                      return (
                        <Link
                          key={lesson.id}
                          href={`/learning/${subject.id}/${lesson.id}`}
                          className={`${styles.lessonItem} ${isCurrentLesson ? styles.currentLesson : ""}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className={styles.lessonNumber}>{index + 1}</div>
                          <div className={styles.lessonInfo}>
                            <div className={styles.lessonTitle}>{lesson.title}</div>
                            <div className={styles.lessonMeta}>{lesson.totalCards} cards</div>
                          </div>
                          <div className={styles.lessonStatus}>
                            {isCompleted && (
                              <div className={styles.completedDot} title="Completed">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path
                                    d="M10 3L4.5 8.5L2 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

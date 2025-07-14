"use client"
import { useState, useEffect } from "react"

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

interface ProgressTrackerProps {
  subjects: Subject[]
  lessons: Lesson[]
  currentSubjectId?: string
}

interface SubjectProgress {
  completedLessons: number
  totalLessons: number
  percentage: number
}

export default function ProgressTracker({ subjects, lessons, currentSubjectId }: ProgressTrackerProps) {
  const [subjectProgress, setSubjectProgress] = useState<Record<string, SubjectProgress>>({})

  useEffect(() => {
    const calculateProgress = () => {
      const progress: Record<string, SubjectProgress> = {}

      subjects.forEach((subject) => {
        const subjectLessons = lessons.filter((lesson) => lesson.subjectId === subject.id)
        const completedCount = subjectLessons.filter((lesson) => {
          return localStorage.getItem(`lesson_${lesson.id}_completed`) === "true"
        }).length

        progress[subject.id] = {
          completedLessons: completedCount,
          totalLessons: subject.totalLessons,
          percentage: subject.totalLessons > 0 ? Math.round((completedCount / subject.totalLessons) * 100) : 0,
        }
      })

      setSubjectProgress(progress)
    }

    // Calculate initial progress
    calculateProgress()

    // Listen for storage changes to update progress in real-time
    const handleStorageChange = () => {
      calculateProgress()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events when lessons are completed in the same tab
    const handleLessonComplete = () => {
      calculateProgress()
    }

    window.addEventListener("lessonCompleted", handleLessonComplete)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("lessonCompleted", handleLessonComplete)
    }
  }, [subjects, lessons])

  // If we're showing a specific subject, return just that subject's progress
  if (currentSubjectId) {
    const progress = subjectProgress[currentSubjectId]
    if (!progress) return null

    return (
      <div className="subject-progress">
        <div className="subject-meta">
          <span>
            {progress.completedLessons} of {progress.totalLessons} lessons completed
          </span>
          <span className="progress-percentage">{progress.percentage}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress.percentage}%` }}></div>
        </div>
      </div>
    )
  }

  // Return progress for all subjects (for the main learning page)
  return (
    <>
      {subjects.map((subject) => {
        const progress = subjectProgress[subject.id]
        if (!progress) return null

        return (
          <div key={subject.id} className="subject-progress-item">
            <div className="subject-meta">
              <span className="lesson-count">{progress.totalLessons} lessons</span>
              <span className="progress-percentage">{progress.percentage}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.percentage}%` }}></div>
            </div>
          </div>
        )
      })}
    </>
  )
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "../../../components/Card/Card";
import styles from "../subject.module.css";

interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  totalCards: number;
}

interface LessonsGridProps {
  lessons: Lesson[];
  subjectId: string;
}

export default function LessonsGrid({ lessons, subjectId }: LessonsGridProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // Check localStorage for completed lessons on client side
    const completed = new Set<string>();
    lessons.forEach((lesson) => {
      const isCompleted =
        localStorage.getItem(`lesson_${lesson.id}_completed`) === "true";
      if (isCompleted) {
        completed.add(lesson.id);
      }
    });
    setCompletedLessons(completed);
  }, [lessons]);

  // Listen for storage changes to update completion status in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const completed = new Set<string>();
      lessons.forEach((lesson) => {
        const isCompleted =
          localStorage.getItem(`lesson_${lesson.id}_completed`) === "true";
        if (isCompleted) {
          completed.add(lesson.id);
        }
      });
      setCompletedLessons(completed);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("lessonCompleted", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("lessonCompleted", handleStorageChange);
    };
  }, [lessons]);

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.has(lessonId);
  };

  return (
    <div className={styles.lessonsGrid}>
      {lessons.map((lesson, index) => (
        <Link
          key={lesson.id}
          href={`/learning/${subjectId}/${lesson.id}`}
          className={styles.lessonLink}
        >
          <Card className={styles.lessonCard}>
            <div className={styles.lessonNumber}>
              Lesson {index + 1}
              {isLessonCompleted(lesson.id) ? (
                <span className={styles.completedBadge}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.completionIcon}
                  >
                    <path
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                      fill="currentColor"
                    />
                  </svg>
                  Completed
                </span>
              ) : (
                <></>
              )}
            </div>
            <h3 className={styles.lessonTitle}>{lesson.title}</h3>
            <p className={styles.lessonDescription}>{lesson.description}</p>
            <div className={styles.lessonMeta}>
              <span className={styles.cardCount}>
                {lesson.totalCards} cards
              </span>
              <button className={styles.startButton}>Start</button>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

"use client";
import { useState, useCallback, useEffect } from "react";
import styles from "./lesson.module.css";
import Sidebar from "../../../components/Sidebar/Sidebar";
import BackButton from "../../../components/BackButton/BackButton";
import SwipeableCards, {
  type CardData,
} from "../../../components/SwipeableCards/SwipeableCards";

interface Subject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  totalLessons: number;
  color: string;
}

interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  totalCards: number;
}

interface LessonClientProps {
  subjects: Subject[];
  lessons: Lesson[];
  lesson: Lesson;
  cards: CardData[];
  subjectId: string;
  lessonId: string;
}

export default function LessonClient({
  subjects,
  lessons,
  lesson,
  cards,
  subjectId,
  lessonId,
}: LessonClientProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    const progressKey = `lesson_${lessonId}_progress`;
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCompletedCards(progress.completedCards || 0);
        setCurrentCardIndex(progress.completedCards || 0);
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
  }, [lessonId]);

  const handleCardSwipe = useCallback(
    (card: CardData, direction: "left" | "right") => {
      const newCompletedCards = completedCards + 1;
      const newCurrentIndex = currentCardIndex + 1;

      setCompletedCards(newCompletedCards);
      setCurrentCardIndex(newCurrentIndex);

      // Save progress to localStorage
      const progressKey = `lesson_${lessonId}_progress`;
      const newProgress = {
        completedCards: newCompletedCards,
        totalCards: cards.length,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(progressKey, JSON.stringify(newProgress));

      // If all cards completed, mark lesson as complete
      if (newCompletedCards >= cards.length) {
        const lessonCompleteKey = `lesson_${lessonId}_completed`;
        localStorage.setItem(lessonCompleteKey, "true");

        // Dispatch custom event to update progress in other components
        window.dispatchEvent(
          new CustomEvent("lessonCompleted", {
            detail: { lessonId, subjectId },
          })
        );
      }
    },
    [lessonId, cards.length, completedCards, currentCardIndex, subjectId]
  );

  const progressPercentage =
    cards.length > 0 ? Math.round((completedCards / cards.length) * 100) : 0;
  const currentCard = Math.min(currentCardIndex + 1, cards.length);

  const progressBar = (
    <>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {/* <div className={styles.progressText}>{progressPercentage}% Complete</div> */}
    </>
  );

  const lessonProgressInfo = (
    <div
      style={{
        textAlign: "center",
        marginTop: "18px",
        fontSize: "1rem",
        color: "#a855f7",
        fontWeight: 500,
      }}
    >
      {currentCard} of {cards.length}
    </div>
  );

  return (
    <div className={styles.lessonPage}>
      <Sidebar
        subjects={subjects}
        lessons={lessons}
        currentSubjectId={subjectId}
        currentLessonId={lessonId}
      />

      <div className={styles.mainContent}>
        <BackButton
          href={`/learning/${subjectId}`}
          className={styles.backButton}
          label="Back to Lessons"
        />

        <div className={styles.centeredHeaderContainer480}>
          <div className={styles.lessonHeader}>
            <h1 className={styles.lessonTitle}>{lesson.title}</h1>
            {/* <div className={styles.progressInfo}>
              <span>
                {currentCard} of {cards.length}
              </span>
            </div> */}
          </div>
          {/* Progress bar removed from here */}
        </div>

        {completedCards >= cards.length ? (
          <div className={styles.completionMessage}>
            <div className={styles.completionIcon}>
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.celebrationSvg}
              >
                {/* Main completion circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="url(#completionGradient)"
                  stroke="#10B981"
                  strokeWidth="4"
                  className={styles.completionCircle}
                />

                {/* Checkmark */}
                <path
                  d="M30 50 L45 65 L70 35"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.checkmark}
                />

                {/* Completion ring animation */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="276"
                  strokeDashoffset="276"
                  className={styles.completionRing}
                />

                {/* Success sparkles */}
                <circle
                  cx="20"
                  cy="25"
                  r="3"
                  fill="#10B981"
                  className={styles.successSparkle}
                />
                <circle
                  cx="80"
                  cy="30"
                  r="2.5"
                  fill="#34D399"
                  className={styles.successSparkle}
                />
                <circle
                  cx="25"
                  cy="75"
                  r="2"
                  fill="#6EE7B7"
                  className={styles.successSparkle}
                />
                <circle
                  cx="75"
                  cy="70"
                  r="2.5"
                  fill="#10B981"
                  className={styles.successSparkle}
                />

                {/* Completion dots */}
                <circle
                  cx="15"
                  cy="15"
                  r="2"
                  fill="#10B981"
                  className={styles.completionDot}
                />
                <circle
                  cx="85"
                  cy="20"
                  r="2"
                  fill="#34D399"
                  className={styles.completionDot}
                />
                <circle
                  cx="20"
                  cy="85"
                  r="2"
                  fill="#6EE7B7"
                  className={styles.completionDot}
                />
                <circle
                  cx="80"
                  cy="80"
                  r="2"
                  fill="#10B981"
                  className={styles.completionDot}
                />

                {/* Gradients */}
                <defs>
                  <linearGradient
                    id="completionGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#6EE7B7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 className={styles.completionTitle}>Lesson Complete!</h2>
            <p className={styles.completionDescription}>
              Great job! You've completed all {cards.length} cards in this
              lesson.
            </p>
            <BackButton
              href={`/learning/${subjectId}`}
              label="Back to Lessons"
            />
          </div>
        ) : (
          <div className={styles.cardsContainer}>
            <SwipeableCards
              cards={cards}
              onSwipe={handleCardSwipe}
              progressBar={progressBar}
              lessonProgressInfo={lessonProgressInfo}
            />
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className={styles.progressText}>{progressPercentage}% Complete</div>
    </div>
  );
  // const cardProgressBar = (
  //   <div className="cardProgressBarWrapper">
  //     <div
  //       className="cardProgressBar"
  //       style={{ width: `${progressPercentage}%` }}
  //     >
  //       progressBar}
  //     </div>
  //   </div>
  // );

  return (
    <div className={styles.lessonPage}>
      <Sidebar
        subjects={subjects}
        lessons={lessons}
        currentSubjectId={subjectId}
        currentLessonId={lessonId}
      />

      <div className={styles.mainContent}>
        <BackButton href={`/learning/${subjectId}`} className={styles.backButton} label="Back to Lessons" />

        <div className={styles.centeredHeaderContainer480}>
          {/* <div className={styles.centeredHeaderContainer540}> */}
          <div className={styles.lessonHeader}>
            <h1 className={styles.lessonTitle}>{lesson.title}</h1>
            {/* <div className={styles.progressInfo}>
              <span>
                {currentCard} of {cards.length}
              </span>
            </div> */}
          </div>
        </div>

        {completedCards >= cards.length ? (
          <div className={styles.completionMessage}>
            <div className={styles.completionIcon}>🎉</div>
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
            />
          </div>
        )}
      </div>
    </div>
  );
}

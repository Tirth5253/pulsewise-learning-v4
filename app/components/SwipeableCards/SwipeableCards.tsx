"use client"
import { useState, useEffect, useCallback } from "react"
import { useSwipeCard } from "../../hooks/use-swipe-card"
import styles from "./swipeable-cards.module.css"
import cardStyles from "../../components/Card/Card.module.css"

export interface CardData {
  id: number | string
  title: string
  description: string
  image: string
}

interface SwipeableCardsProps {
  cards: CardData[]
  onSwipeLeft?: (card: CardData) => void
  onSwipeRight?: (card: CardData) => void
  onSwipe?: (card: CardData, direction: "left" | "right") => void
  threshold?: number
  className?: string
  progressBar?: React.ReactNode
  lessonProgressInfo?: React.ReactNode
}

interface SwipeableCardProps {
  card: CardData
  isTop: boolean
  stackIndex: number
  isAnimating: boolean
  onSwipeLeft?: (card: CardData) => void
  onSwipeRight?: (card: CardData) => void
  onSwipe?: (card: CardData, direction: "left" | "right") => void
  threshold?: number
  onRemove: () => void
  progressBar?: React.ReactNode
  lessonProgressInfo?: React.ReactNode
}

const SwipeableCard = ({
  card,
  isTop,
  stackIndex,
  isAnimating,
  onSwipeLeft,
  onSwipeRight,
  onSwipe,
  threshold,
  onRemove,
  progressBar,
  lessonProgressInfo,
}: SwipeableCardProps) => {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleSwipe = (cardData: CardData, direction: "left" | "right") => {
    setIsRemoving(true)
    onSwipe?.(cardData, direction)
    setTimeout(() => {
      onRemove()
    }, 300)
  }

  const { cardRef, handlers } = useSwipeCard({
    onSwipeLeft: (cardData) => {
      onSwipeLeft?.(cardData)
      handleSwipe(cardData, "left")
    },
    onSwipeRight: (cardData) => {
      onSwipeRight?.(cardData)
      handleSwipe(cardData, "right")
    },
    threshold,
  })

  if (isRemoving) return null

  const getCardStyle = () => {
    const baseZIndex = 10 - stackIndex
    const scale = stackIndex === 0 ? 1 : stackIndex === 1 ? 0.95 : 0.9
    const translateY = stackIndex === 0 ? 0 : stackIndex === 1 ? 40 : 80
    const translateX = stackIndex === 0 ? 0 : stackIndex === 1 ? 4 : 8
    const opacity = stackIndex === 0 ? 1 : stackIndex === 1 ? 0.9 : 0.8
    const shadowIntensity = stackIndex === 0 ? 0.15 : stackIndex === 1 ? 0.1 : 0.05
    const shadowBlur = stackIndex === 0 ? 40 : stackIndex === 1 ? 25 : 15
    const shadowOffset = stackIndex === 0 ? 10 : stackIndex === 1 ? 6 : 3

    return {
      zIndex: baseZIndex,
      transform: `translate(-50%, -50%) scale(${scale}) translate(${translateX}px, ${translateY}px)`,
      opacity: opacity,
      boxShadow: `0 ${shadowOffset}px ${shadowBlur}px rgba(0, 0, 0, ${shadowIntensity})`,
    }
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${cardStyles.gradientBorder} ${isTop ? styles.cardTop : ""} ${isAnimating ? styles.cardAnimating : ""}`}
      style={getCardStyle()}
      tabIndex={-1}
      onMouseDown={isTop ? (e => handlers.onMouseDown(e, card)) : undefined}
      onMouseUp={isTop ? (e => handlers.onMouseUp(card)(e.nativeEvent)) : undefined}
      onTouchStart={isTop ? (e => handlers.onTouchStart(e, card)) : undefined}
      onTouchMove={isTop ? (e => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch && cardRef.current) {
          // Directly update the card transform for touch drag
          const deltaX = touch.clientX - (cardRef.current as any)._startX;
          const deltaY = touch.clientY - (cardRef.current as any)._startY;
          cardRef.current.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px) rotate(${deltaX * 0.1}deg) scale(1.05)`;
        }
      }) : undefined}
      onTouchEnd={isTop ? (e => handlers.onTouchEnd(card)(e.nativeEvent)) : undefined}
    >
      {progressBar && <div className={styles.cardProgressBarWrapper}>{progressBar}</div>}
      <div className={styles.cardHeader}>
        <div className={styles.cardImage}>
          <img src={card.image || `/placeholder.svg?height=300&width=400`} alt={card.title} draggable={false} />
          <div className={styles.imageOverlay}></div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        <p className={styles.cardDescription}>{card.description}</p>
        {lessonProgressInfo && <div className={styles.cardLessonProgressInfoWrapper}>{lessonProgressInfo}</div>}
      </div>
      {isTop && (
        <></>
      )}
      <div className={styles.cardGlow}></div>
    </div>
  )
}

export default function SwipeableCards({
  cards: initialCards,
  onSwipeLeft,
  onSwipeRight,
  onSwipe,
  threshold = 100,
  className = "",
  progressBar,
  lessonProgressInfo,
}: SwipeableCardsProps) {
  const [allCards, setAllCards] = useState<CardData[]>([])
  const [visibleCards, setVisibleCards] = useState<CardData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setAllCards(initialCards)
    setVisibleCards(initialCards.slice(0, 3))
    setCurrentIndex(0)
  }, [initialCards])

  const moveStackUp = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1
        const nextCards = []
        for (let i = 0; i < 3; i++) {
          const cardIndex = newIndex + i
          if (allCards[cardIndex]) {
            nextCards.push(allCards[cardIndex])
          }
        }
        setVisibleCards(nextCards)
        return newIndex
      })
      setTimeout(() => {
        setIsAnimating(false)
      }, 400)
    }, 50)
  }, [allCards])

  const removeTopCard = useCallback(() => {
    if (allCards.length === 0) return
    moveStackUp()
  }, [moveStackUp, allCards.length])

  if (!isClient) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderCard} />
        </div>
      </div>
    )
  }

  if (allCards.length === 0 || currentIndex >= allCards.length) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎉</div>
          <h3>All cards completed!</h3>
          <p>Great job finishing this lesson!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.cardStack}>
        {visibleCards.map((card, index) => (
          <SwipeableCard
            key={`${card.id}-${currentIndex + index}`}
            card={card}
            isTop={index === 0}
            stackIndex={index}
            isAnimating={isAnimating}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
            onSwipe={onSwipe}
            threshold={threshold}
            onRemove={removeTopCard}
            progressBar={progressBar}
            lessonProgressInfo={lessonProgressInfo}
          />
        ))}
      </div>
    </div>
  )
}

"use client"
import type React from "react"
import { useCallback, useRef, useState, useEffect } from "react"

interface SwipeCardHookProps {
  onSwipeLeft?: (card: any) => void
  onSwipeRight?: (card: any) => void
  onSwipe?: (card: any, direction: "left" | "right") => void
  threshold?: number
}

interface SwipeState {
  isDragging: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
}

export const useSwipeCard = ({ onSwipeLeft, onSwipeRight, onSwipe, threshold = 100 }: SwipeCardHookProps) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  // --- FIX: Store card data in a ref for global access ---
  const cardDataRef = useRef<any>(null)

  const resetSwipeState = useCallback(() => {
    setSwipeState({
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
    })
  }, [])

  const updateCardTransform = useCallback((deltaX: number, deltaY: number, isDragging: boolean) => {
    if (!cardRef.current) return

    const rotation = deltaX * 0.1
    const scale = isDragging ? 1.05 : 1
    const opacity = Math.max(0.7, 1 - Math.abs(deltaX) / 300)

    // Apply transform while maintaining the original centering
    cardRef.current.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg) scale(${scale})`
    cardRef.current.style.opacity = opacity.toString()

    // Show swipe indicators based on direction
    const leftIndicator = cardRef.current.querySelector('[data-swipe="left"]') as HTMLElement
    const rightIndicator = cardRef.current.querySelector('[data-swipe="right"]') as HTMLElement

    if (leftIndicator && rightIndicator) {
      if (deltaX < -50) {
        leftIndicator.style.opacity = Math.min(1, Math.abs(deltaX) / 150).toString()
        rightIndicator.style.opacity = "0"
      } else if (deltaX > 50) {
        rightIndicator.style.opacity = Math.min(1, deltaX / 150).toString()
        leftIndicator.style.opacity = "0"
      } else {
        leftIndicator.style.opacity = "0"
        rightIndicator.style.opacity = "0"
      }
    }
  }, [])

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setSwipeState((prev) => ({
      ...prev,
      isDragging: true,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      deltaX: 0,
      deltaY: 0,
    }))
  }, [])

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      setSwipeState((prev) => {
        if (!prev.isDragging) return prev

        const deltaX = clientX - prev.startX
        const deltaY = clientY - prev.startY

        // Update transform immediately
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }

        animationRef.current = requestAnimationFrame(() => {
          updateCardTransform(deltaX, deltaY, true)
        })

        return {
          ...prev,
          currentX: clientX,
          currentY: clientY,
          deltaX,
          deltaY,
        }
      })
    },
    [updateCardTransform],
  )

  const handleEnd = useCallback(
    (cardData: any) => {
      if (!swipeState.isDragging) return

      const { deltaX, deltaY } = swipeState
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Only trigger swipe if horizontal movement is greater than vertical
      if (absX > threshold && absX > absY) {
        const direction = deltaX > 0 ? "right" : "left"

        if (cardRef.current) {
          const exitX = direction === "right" ? window.innerWidth + 100 : -window.innerWidth - 100
          const exitVelocity = Math.max(0.5, Math.min(1.5, absX / threshold))
          const duration = 300 / exitVelocity

          cardRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.32, 0.99), opacity ${duration}ms ease-out`
          cardRef.current.style.transform = `translate(-50%, -50%) translate(${exitX}px, ${deltaY}px) rotate(${deltaX * 0.2}deg) scale(1.05)`
          cardRef.current.style.opacity = "0"

          setTimeout(() => {
            if (direction === "left") {
              onSwipeLeft?.(cardData)
            } else {
              onSwipeRight?.(cardData)
            }
            onSwipe?.(cardData, direction)
          }, 50)
        }
      } else {
        // Snap back to center
        if (cardRef.current) {
          cardRef.current.style.transition =
            "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out"
          cardRef.current.style.transform = "translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(1)"
          cardRef.current.style.opacity = "1"

          // Hide indicators
          const leftIndicator = cardRef.current.querySelector('[data-swipe="left"]') as HTMLElement
          const rightIndicator = cardRef.current.querySelector('[data-swipe="right"]') as HTMLElement
          if (leftIndicator) leftIndicator.style.opacity = "0"
          if (rightIndicator) rightIndicator.style.opacity = "0"
        }
      }

      resetSwipeState()
    },
    [swipeState, threshold, onSwipeLeft, onSwipeRight, onSwipe, resetSwipeState],
  )

  const handleMouseDown = useCallback(
    (e?: React.MouseEvent, cardData: any = null) => {
      if (!e) return;
      e.preventDefault()
      if (cardData) cardDataRef.current = cardData
      handleStart(e.clientX, e.clientY)
    },
    [handleStart],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      handleMove(e.clientX, e.clientY)
    },
    [handleMove],
  )

  const handleMouseUp = useCallback(
    (cardData: any) => {
      return (e: MouseEvent) => {
        e.preventDefault()
        handleEnd(cardData)
      }
    },
    [handleEnd],
  )

  const handleTouchStart = useCallback(
    (e?: React.TouchEvent, cardData: any = null) => {
      if (!e) return;
      e.preventDefault()
      const touch = e.touches[0]
      if (cardData) cardDataRef.current = cardData
      handleStart(touch.clientX, touch.clientY)
    },
    [handleStart],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        handleMove(touch.clientX, touch.clientY)
      }
    },
    [handleMove],
  )

  const handleTouchEnd = useCallback(
    (cardData: any) => {
      return (e: TouchEvent) => {
        e.preventDefault()
        handleEnd(cardData)
      }
    },
    [handleEnd],
  )

  useEffect(() => {
    if (!swipeState.isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e)
    const handleGlobalTouchMove = (e: TouchEvent) => handleTouchMove(e)
    // --- FIX: Use cardDataRef in global mouseup/touchend ---
    const handleGlobalMouseUp = (e: MouseEvent) => {
      handleEnd(cardDataRef.current)
    }
    const handleGlobalTouchEnd = (e: TouchEvent) => {
      handleEnd(cardDataRef.current)
    }
    document.addEventListener("mousemove", handleGlobalMouseMove, { passive: false })
    document.addEventListener("touchmove", handleGlobalTouchMove, { passive: false })
    document.addEventListener("mouseup", handleGlobalMouseUp, { passive: false })
    document.addEventListener("touchend", handleGlobalTouchEnd, { passive: false })
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("touchmove", handleGlobalTouchMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("touchend", handleGlobalTouchEnd)
    }
  }, [swipeState.isDragging, handleMouseMove, handleTouchMove, handleEnd])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
    cardRef,
    isDragging: swipeState.isDragging,
    deltaX: swipeState.deltaX,
    deltaY: swipeState.deltaY,
    handlers: {
      onMouseDown: handleMouseDown as (e?: React.MouseEvent, cardData?: any) => void,
      onMouseUp: (cardData: any) => (e: MouseEvent) => handleEnd(cardData),
      onTouchStart: handleTouchStart as (e?: React.TouchEvent, cardData?: any) => void,
      onTouchEnd: (cardData: any) => (e: TouchEvent) => handleEnd(cardData),
    },
  }
}

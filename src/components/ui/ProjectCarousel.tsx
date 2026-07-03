'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectCarouselProps {
  screenshots: string[]
  videos?: string[]
  tierColor: string
  projectTitle: string
  aspectRatio?: string
}

const ProjectCarousel = ({
  screenshots,
  videos = [],
  tierColor,
  projectTitle,
  aspectRatio,
}: ProjectCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const videoItems = videos.map((src) => ({ type: 'video' as const, src }))
  const imageItems = screenshots.map((src) => ({ type: 'image' as const, src }))
  const mediaItems = [...videoItems, ...imageItems]

  const hasMedia = mediaItems.length > 0
  const totalSlides = mediaItems.length

  const currentMedia = mediaItems[currentIndex]
  const isVideoActive = currentMedia?.type === 'video'

  const isPortrait = aspectRatio ? (() => {
    const parts = aspectRatio.split('/').map(p => parseFloat(p.trim()))
    return parts.length === 2 && parts[0] < parts[1]
  })() : false

  const navigate = useCallback(
    (dir: number) => {
      if (totalSlides <= 1) return
      setDirection(dir)
      setCurrentIndex((prev) => (prev + dir + totalSlides) % totalSlides)
    },
    [totalSlides]
  )

  // Auto-advance every 4 seconds, unless paused or playing a video
  useEffect(() => {
    if (isPaused || isVideoActive || totalSlides <= 1) return
    const timer = setInterval(() => navigate(1), 4000)
    return () => clearInterval(timer)
  }, [isPaused, isVideoActive, navigate, totalSlides])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [navigate])

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.95,
    }),
  }

  // No footage fallback
  if (!hasMedia) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: aspectRatio || '16 / 10',
          background: 'rgba(10, 10, 15, 0.8)',
          border: `1px solid rgba(255, 255, 255, 0.06)`,
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Scanlines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
            pointerEvents: 'none',
          }}
        />
        {/* Glitch flicker overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, transparent 40%, ${tierColor}08 50%, transparent 60%)`,
            animation: 'shimmer 3s linear infinite',
            pointerEvents: 'none',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          📡 NO FOOTAGE AVAILABLE
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.15)',
            marginTop: '6px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          FEED INTERRUPTED
        </span>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Media container */}
      <div
        style={{
          width: isPortrait ? 'auto' : '100%',
          height: isPortrait ? '430px' : 'auto',
          maxWidth: '100%',
          aspectRatio: aspectRatio || '16 / 10',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          border: `1px solid rgba(255, 255, 255, 0.06)`,
          boxShadow: `0 0 30px ${tierColor}15, 0 8px 32px rgba(0,0,0,0.4)`,
          background: 'rgba(10, 10, 15, 0.6)',
        }}
      >
        {/* Tier-colored top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${tierColor}, transparent)`,
            zIndex: 5,
          }}
        />

        {/* Promo Video Badge */}
        {currentMedia?.type === 'video' && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              padding: '4px 8px',
              borderRadius: '2px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ fontSize: '0.6rem', color: tierColor, display: 'inline-flex' }}>▶</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Promo Video
            </span>
          </div>
        )}

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {currentMedia.type === 'video' ? (
              <video
                src={currentMedia.src}
                autoPlay
                loop={totalSlides === 1}
                muted
                playsInline
                controls
                onEnded={() => {
                  if (totalSlides > 1) {
                    navigate(1)
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : imageErrors.has(currentIndex) ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                  }}
                >
                  📡 SIGNAL LOST
                </span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentMedia.src}
                alt={`${projectTitle} media ${currentIndex + 1} of ${totalSlides}`}
                onError={() =>
                  setImageErrors((prev) => new Set(prev).add(currentIndex))
                }
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(-1)
              }}
              aria-label="Previous screenshot"
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                borderRadius: '2px',
                color: tierColor,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'
                e.currentTarget.style.borderColor = tierColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              ◀
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(1)
              }}
              aria-label="Next screenshot"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                borderRadius: '2px',
                color: tierColor,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'
                e.currentTarget.style.borderColor = tierColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              ▶
            </button>
          </>
        )}

        {/* Slide counter badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            zIndex: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            color: 'var(--text-secondary)',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '2px 6px',
            borderRadius: '2px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {currentIndex + 1} / {totalSlides}
        </div>
      </div>

      {/* Dot indicators */}
      {totalSlides > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '10px',
          }}
        >
          {mediaItems.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1)
                setCurrentIndex(i)
              }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === currentIndex ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background:
                  i === currentIndex ? tierColor : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(ProjectCarousel)

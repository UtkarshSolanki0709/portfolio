'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface ProjectCarouselProps {
  screenshots?: string[]
  videos?: string[]
  tierColor: string
  projectTitle: string
  aspectRatio?: string
}

const ProjectCarousel = ({
  screenshots = [],
  videos = [],
  tierColor,
  projectTitle,
  aspectRatio,
}: ProjectCarouselProps) => {
  const hasVideo = videos.length > 0 && Boolean(videos[0])
  const videoSrc = hasVideo ? videos[0] : null
  const imageSrc = screenshots.length > 0 ? screenshots[0] : null

  const isPortrait = aspectRatio
    ? (() => {
        const parts = aspectRatio.split('/').map((p) => parseFloat(p.trim()))
        return parts.length === 2 && parts[0] < parts[1]
      })()
    : false

  if (!hasVideo && !imageSrc) {
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
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          PREVIEW COMING SOON
        </span>
      </div>
    )
  }

  return (
    <div
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
          border: `1px solid rgba(255, 255, 255, 0.08)`,
          boxShadow: `0 0 30px ${tierColor}15, 0 8px 32px rgba(0,0,0,0.4)`,
          background: 'rgba(10, 10, 15, 0.8)',
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
        {hasVideo && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              padding: '3px 8px',
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

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {hasVideo && videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              controls
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={`${projectTitle} preview`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}

export default memo(ProjectCarousel)

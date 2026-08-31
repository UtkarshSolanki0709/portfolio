'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface SectionFighterPosterProps {
  imageSrc: string
  altText: string
  badgeText: string
  title: string
  subtitle?: string
  accentColor?: string
  stats?: { label: string; val: string }[]
}

export default function SectionFighterPoster({
  imageSrc,
  altText,
  badgeText,
  title,
  subtitle = 'THE MAIN EVENT',
  accentColor = 'var(--gold)',
  stats = [],
}: SectionFighterPosterProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        width: '320px',
        maxWidth: '35vw',
        height: '480px',
        maxHeight: '75vh',
        background: 'linear-gradient(180deg, rgba(15, 15, 25, 0.9) 0%, rgba(5, 5, 10, 0.95) 100%)',
        border: `1px solid ${accentColor}`,
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: `0 0 35px ${accentColor}25, inset 0 0 20px rgba(0, 0, 0, 0.8)`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        marginLeft: 'auto',
      }}
      className="hidden-on-mobile"
    >
      {/* Corner Tech Brackets */}
      <div style={{ position: 'absolute', top: 6, left: 6, width: 14, height: 14, borderTop: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, zIndex: 10 }} />
      <div style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderTop: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 6, left: 6, width: 14, height: 14, borderBottom: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 6, right: 6, width: 14, height: 14, borderBottom: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, zIndex: 10 }} />

      {/* Top Header Badge */}
      <div
        style={{
          padding: '10px 16px',
          background: 'rgba(0, 0, 0, 0.75)',
          borderBottom: `1px solid ${accentColor}40`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: accentColor,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          {badgeText}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
          }}
        >
          99 OVR
        </span>
      </div>

      {/* Main Image Viewport */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        {/* Subtle Scanlines overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />

        {!imgError ? (
          <Image
            src={imageSrc}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out',
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚡</span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                color: accentColor,
                letterSpacing: '0.1em',
              }}
            >
              {title}
            </span>
          </div>
        )}

        {/* Ambient Gradient Fade at Bottom of Image */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(to top, rgba(5, 5, 10, 1) 0%, transparent 100%)',
            zIndex: 3,
          }}
        />
      </div>

      {/* Footer Info Card */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(5, 5, 10, 0.95)',
          borderTop: `1px solid ${accentColor}30`,
          zIndex: 5,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'block',
          }}
        >
          {subtitle}
        </span>
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
            margin: '2px 0 8px 0',
          }}
        >
          {title}
        </h4>

        {stats.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
              gap: '6px',
              paddingTop: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.45rem',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: accentColor,
                    fontWeight: 700,
                  }}
                >
                  {s.val}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

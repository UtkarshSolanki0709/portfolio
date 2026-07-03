'use client'

import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/data/projects'

interface MatchCardProps {
  project: Project
  index: number
  onClick?: () => void
}

const MatchCard = ({ project, index, onClick }: MatchCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const tierColors = {
    'main-event': { border: 'var(--gold)', bg: 'rgba(212,175,55,0.08)', glow: 'rgba(212,175,55,0.15)' },
    featured: { border: 'var(--cyan)', bg: 'rgba(0,229,255,0.08)', glow: 'rgba(0,229,255,0.15)' },
    undercard: { border: 'var(--red-accent)', bg: 'rgba(255,23,68,0.08)', glow: 'rgba(255,23,68,0.15)' },
    'dark-match': { border: 'var(--text-dim)', bg: 'rgba(80,80,96,0.08)', glow: 'rgba(80,80,96,0.15)' },
  }

  const colors = tierColors[project.tier]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.01,
        boxShadow: `0 0 20px ${colors.glow}, 0 8px 32px rgba(0,0,0,0.3)`,
      }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View project: ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(18, 18, 26, 0.93)',
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        borderLeft: `3px solid ${colors.border}`,
        borderRadius: '4px',
        padding: '0',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Background tier tint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: colors.bg,
          pointerEvents: 'none',
        }}
      />

      {/* Top bar - match label */}
      <div
        style={{
          padding: '6px 12px',
          borderBottom: `1px solid rgba(255, 255, 255, 0.05)`,
          background: `linear-gradient(90deg, ${colors.bg}, transparent)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: colors.border,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          {project.matchLabel}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.45rem',
            color: isHovered ? colors.border : 'var(--text-dim)',
            textTransform: 'uppercase',
            transition: 'color 0.2s ease',
          }}
        >
          {isHovered ? 'REPLAY MATCH ▶' : `${project.stack.length} TECH`}
        </span>
      </div>

      {/* VS Card Body */}
      <div
        style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left side - "UTKARSH" */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-primary)',
            }}
          >
            UTKARSH
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: 'var(--text-dim)',
              marginTop: '1px',
            }}
          >
            FULL STACK DEV
          </div>
        </div>

        {/* VS divider */}
        <div
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: colors.border,
              transform: 'rotate(45deg)',
              position: 'absolute',
              opacity: 0.1,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: colors.border,
              position: 'relative',
              zIndex: 1,
            }}
          >
            VS
          </span>
        </div>

        {/* Right side - Project name */}
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: colors.border,
            }}
          >
            {project.opponent}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: 'var(--text-dim)',
              marginTop: '1px',
            }}
          >
            {project.stats.features} FEATURES
          </div>
        </div>
      </div>

      {/* Stack badges */}
      <div
        style={{
          padding: '0 12px 6px',
          display: 'flex',
          gap: '3px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {project.stack.map((tech) => (
          <span
            key={tech}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.45rem',
              padding: '1px 5px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1px',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Description - subtle */}
      <div
        style={{
          padding: '0 12px 10px',
          fontFamily: 'var(--font-body)',
          fontSize: '0.6rem',
          color: 'var(--text-dim)',
          lineHeight: 1.4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {project.description}
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
          position: 'relative',
          overflow: 'hidden',
          opacity: 0.6,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 4s infinite linear',
          }}
        />
      </div>
    </motion.div>
  )
}

export default memo(MatchCard)

'use client'

import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { timeline, type Milestone } from '@/data/timeline'

const typeStyles = {
  education: { color: 'var(--cyan)', icon: '📚' },
  work: { color: 'var(--gold)', icon: '💼' },
  project: { color: 'var(--red-accent)', icon: '🚀' },
  achievement: { color: 'var(--gold-light)', icon: '⭐' },
}

interface TimelineNodeProps {
  milestone: Milestone
  index: number
}

const TimelineNode = ({ milestone, index }: TimelineNodeProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const style = typeStyles[milestone.type] || { color: 'var(--gold)', icon: '💼' }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
      }}
    >
      {/* Interactive Bullet Point */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.4 : 1,
          borderColor: isHovered ? style.color : 'rgba(255, 255, 255, 0.25)',
          backgroundColor: isHovered ? 'rgba(10, 10, 15, 1)' : 'rgba(6, 6, 10, 1)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        style={{
          position: 'absolute',
          left: '-23px',
          top: '4px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          borderWidth: '2px',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: isHovered ? `0 0 12px ${style.color}` : 'none',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: style.color,
          }}
        />
      </motion.div>

      {/* Content Block */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '8px',
          cursor: 'default',
          width: '100%',
        }}
      >
        {/* Header: Year & Icon & Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>{style.icon}</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: style.color,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            {milestone.year}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>—</span>
          <motion.h4
            animate={{
              color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
              x: isHovered ? 4 : 0,
            }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            {milestone.title}
          </motion.h4>
        </div>

        {/* Dynamic Expanding Paragraph */}
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
            marginTop: isHovered ? 6 : 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            overflow: 'hidden',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '480px',
              paddingLeft: '22px', // Align with title text
            }}
          >
            {milestone.description}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

const TimelineLocker = () => {
  return (
    <div
      style={{
        position: 'relative',
        paddingLeft: '24px',
        paddingTop: '8px',
        paddingBottom: '8px',
        width: '100%',
      }}
    >
      {/* Vertical Thread line */}
      <div
        style={{
          position: 'absolute',
          left: '7px',
          top: '12px',
          bottom: '12px',
          width: '2px',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {timeline.map((milestone, index) => (
          <TimelineNode
            key={`${milestone.year}-${milestone.title}`}
            milestone={milestone}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(TimelineLocker)

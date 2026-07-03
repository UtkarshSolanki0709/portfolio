'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { commentaryQuips } from '@/data/commentary'
import type { CommentaryQuip as QuipType } from '@/data/commentary'

interface CommentaryQuipState {
  quip: QuipType | null
  showQuip: (customQuip?: QuipType) => void
}

export function useCommentaryQuip(): CommentaryQuipState {
  const [quip, setQuip] = useState<QuipType | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showQuip = useCallback((customQuip?: QuipType) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const nextQuip = customQuip ||
      commentaryQuips[Math.floor(Math.random() * commentaryQuips.length)]
    setQuip(nextQuip)

    timeoutRef.current = setTimeout(() => {
      setQuip(null)
      timeoutRef.current = null
    }, 3800)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { quip, showQuip }
}

export default function CommentaryQuipDisplay({
  quip,
}: {
  quip: QuipType | null
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 8000,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {quip && (
          <motion.div
            key={quip.text}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '2px',
              padding: '12px 20px',
              maxWidth: '500px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Gold accent glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Commentator name */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '6px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {quip.commentator === 'JR'
                ? '🎙️ GOOD OL\' JR'
                : quip.commentator === 'Tony'
                ? '🎙️ TONY SCHIAVONE'
                : quip.commentator === 'Cole'
                ? '🎙️ MICHAEL COLE'
                : '🎙️ COREY GRAVES'}
            </div>

            {/* Quote text */}
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
                position: 'relative',
                zIndex: 1,
              }}
            >
              &ldquo;{quip.text}&rdquo;
            </div>

            {/* Auto-dismiss bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3.8, ease: 'linear' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '2px',
                background: 'var(--gold)',
                opacity: 0.4,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

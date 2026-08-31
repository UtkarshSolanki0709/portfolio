'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '@/lib/store'
import { AvatarSlamSVG } from '@/components/ui/WrestlingIcons'

interface LoadingScreenProps {
  onEnter?: () => void
}

export default function LoadingScreen({ onEnter }: LoadingScreenProps) {
  const { isLoading, setLoading, loadingProgress, setLoadingProgress } =
    usePortfolioStore()
  const [showLogo, setShowLogo] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  // Animate progress bar — faster to reduce LCP delay
  useEffect(() => {
    let progress = 0
    let lastTime = performance.now()
    
    progressRef.current = setInterval(() => {
      const now = performance.now()
      const delta = now - lastTime
      lastTime = now
      
      // Faster increment: ~1.5s to reach 100% (was ~3-4s)
      const increment = (Math.sin(now * 0.1) + 1.5) * (delta * 0.12)
      progress += increment
      
      if (progress >= 100) {
        progress = 100
        if (progressRef.current) clearInterval(progressRef.current)
      }
      setLoadingProgress(Math.min(progress, 100))
    }, 50)
    
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [setLoadingProgress])

  // Trigger logo slam after mount
  useEffect(() => {
    const t1 = setTimeout(() => setShowLogo(true), 200)
    const t2 = setTimeout(() => setShowContent(true), 500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // Manual dismiss (click anywhere or button)
  const handleDismiss = useCallback(() => {
    setLoading(false)
    if (onEnter) onEnter()
  }, [setLoading, onEnter])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={loadingProgress >= 100 ? handleDismiss : undefined}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-darker)',
            cursor: loadingProgress >= 100 ? 'pointer' : 'default',
            overflow: 'hidden',
          }}
        >
          {/* Scanline overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Animated line that sweeps down */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
              animation: 'scanline 3s linear infinite',
              zIndex: 3,
              opacity: 0.5,
            }}
          />

          {/* Corner accents */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderTop: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)', opacity: 0.4 }} />
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderTop: '2px solid var(--gold)', borderRight: '2px solid var(--gold)', opacity: 0.4 }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '40px', height: '40px', borderBottom: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)', opacity: 0.4 }} />
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', borderBottom: '2px solid var(--gold)', borderRight: '2px solid var(--gold)', opacity: 0.4 }} />

          {/* Custom SVG Avatar Logo */}
          <motion.div
            initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
            animate={showLogo ? { opacity: 1, rotate: 45, scale: 1.2 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              marginBottom: '32px',
              filter: 'drop-shadow(0 0 15px rgba(255,23,68,0.5))'
            }}
          >
            <AvatarSlamSVG style={{ width: '45px', height: '45px' }} glowColor="var(--red-accent)" />
          </motion.div>

          {/* Name + Title */}
          <motion.div
            initial={{ scale: 3, opacity: 0, filter: 'blur(10px)' }}
            animate={
              showLogo
                ? { scale: 1, opacity: 1, filter: 'blur(0px)' }
                : {}
            }
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              scale: {
                type: 'spring',
                damping: 12,
                stiffness: 200,
              },
            }}
            style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 5,
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.45em',
                fontWeight: 400,
                letterSpacing: '0.5em',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              WELCOME TO THE
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                lineHeight: 0.95,
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dim))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.4))',
              }}
            >
              UTKARSH SOLANKI
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginTop: '8px',
                color: 'var(--text-secondary)',
              }}
            >
              MAIN EVENT
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              marginTop: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
            }}
          >
            FULL STACK ENGINEER
          </motion.p>

          {/* Loading bar / Enter Button container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              marginTop: '40px',
              width: 'min(400px, 80vw)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10,
            }}
          >
            {loadingProgress < 100 ? (
              <>
                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-light))',
                      borderRadius: '2px',
                      position: 'relative',
                      width: `${loadingProgress}%`,
                    }}
                    transition={{ duration: 0.15, ease: 'linear' }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite linear',
                      }}
                    />
                  </motion.div>
                </div>

                {/* Percentage */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  <span>LOADING ARENA</span>
                  <span style={{ color: 'var(--gold)' }}>
                    {Math.floor(loadingProgress)}%
                  </span>
                </div>
              </>
            ) : (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'transparent',
                  border: '2px solid var(--gold)',
                  borderRadius: '2px',
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 0 15px rgba(212,175,55,0.2)',
                  animation: 'pulse-glow 2s infinite ease-in-out',
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>ENTER THE ARENA</span>
                {/* Internal shine animation */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)',
                    transform: 'skewX(-20deg)',
                  }}
                />
              </motion.button>
            )}
          </motion.div>



          {/* Controller hints bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 0.6, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{
              position: 'absolute',
              bottom: '24px',
              display: 'flex',
              gap: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {[
              { key: '✕', label: 'SELECT' },
              { key: '○', label: 'BACK' },
              { key: '□', label: 'OPTIONS' },
              { key: '△', label: 'INFO' },
            ].map((btn) => (
              <div
                key={btn.label}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid var(--text-dim)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                  }}
                >
                  {btn.key}
                </span>
                {btn.label}
              </div>
            ))}
          </motion.div>

          {/* Background particles / ambient light */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.06) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 70%, rgba(0,229,255,0.04) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

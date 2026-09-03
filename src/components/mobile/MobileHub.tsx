'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { usePortfolioStore } from '@/lib/store'
import { triggerNextTrack } from '@/hooks/useArenaAudio'
import { HUB_LEVELS, type HubSection } from './levels'

const MobileSectionOverlay = dynamic(() => import('./MobileSectionOverlay'), { ssr: false })
const ProjectDetailOverlay = dynamic(() => import('@/components/ui/ProjectDetailOverlay'), { ssr: false })

interface MobileHubProps {
  onNextTrack?: () => void
}

function GoldNameFrame({ text, side }: { text: string; side: 'left' | 'right' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side]: 0,
        width: 18,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(8, 8, 14, 0.92), rgba(18, 16, 24, 0.7), rgba(8, 8, 14, 0.92))',
        borderRight: side === 'left' ? '1px solid rgba(212, 175, 55, 0.4)' : 'none',
        borderLeft: side === 'right' ? '1px solid rgba(212, 175, 55, 0.4)' : 'none',
        boxShadow: side === 'left' 
          ? 'inset -1px 0 6px rgba(212, 175, 55, 0.15)' 
          : 'inset 1px 0 6px rgba(212, 175, 55, 0.15)',
        zIndex: 10,
      }}
    >
      {/* Top accent notch */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 16, 
          width: 6, 
          height: 2, 
          background: 'var(--gold)',
          boxShadow: '0 0 6px var(--gold)',
        }} 
      />

      <span
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontFamily: 'var(--font-display)',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          textShadow: '0 0 8px rgba(212, 175, 55, 0.4)',
          opacity: 0.75,
        }}
      >
        {text}
      </span>

      {/* Bottom accent notch */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: 16, 
          width: 6, 
          height: 2, 
          background: 'var(--gold)',
          boxShadow: '0 0 6px var(--gold)',
        }} 
      />
    </div>
  )
}

export default function MobileHub({ onNextTrack }: MobileHubProps) {
  const [levelsOpen, setLevelsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<HubSection | null>(null)
  const selectedProject = usePortfolioStore((s) => s.selectedProject)
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject)
  const isMuted = usePortfolioStore((s) => s.isMuted)
  const toggleMute = usePortfolioStore((s) => s.toggleMute)

  const showAudioControls = !activeSection && !selectedProject

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'var(--bg-dark)',
      }}
    >
      {/* Vertical 9:16 Titantron arena backdrop */}
      <Image
        src="/images/titan-mob.png"
        alt="Arena Titantron Stage"
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />

      {/* Subtle vignette gradient overlay so text pops sharply against the lights */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(6, 6, 12, 0.2) 0%, rgba(6, 6, 12, 0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      <GoldNameFrame text="UTKARSH" side="left" />
      <GoldNameFrame text="SOLANKI" side="right" />

      {/* Hub home: identity block + LEVELS entry */}
      {!levelsOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            padding: '0 32px',
            textAlign: 'center',
            zIndex: 5,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.8rem, 3.2vw, 1rem)',
              color: 'var(--cyan)',
              letterSpacing: '0.35em',
              textShadow: '0 0 14px rgba(0, 229, 255, 0.7)',
              fontWeight: 600,
            }}
          >
            THE MAIN EVENT
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(1.4rem, 6vw, 2.1rem)',
              color: 'var(--gold-light)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.6)',
              margin: 0,
              lineHeight: 1.35,
              letterSpacing: '0.04em',
            }}
          >
            UTKARSH SOLANKI
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.75rem, 2.8vw, 0.95rem)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.22em',
              margin: 0,
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)',
            }}
          >
            FULL STACK ENGINEER · SELECT A LEVEL
          </p>
          <button
            type="button"
            className="pixel-cta"
            onClick={() => setLevelsOpen(true)}
            aria-label="Open level select"
            style={{
              fontSize: '1.05rem',
              padding: '16px 44px',
              letterSpacing: '0.18em',
              marginTop: '10px',
            }}
          >
            ▶ LEVELS
          </button>
        </div>
      )}

      {/* Glassmorphic level grid — Centered flex overlay (fixes transform override bug) */}
      {levelsOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pixel-hub-glass"
            role="dialog"
            aria-label="Level select"
            style={{
              width: '100%',
              maxWidth: 320,
              maxHeight: 'calc(100dvh - 32px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '16px 14px',
              boxSizing: 'border-box',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.78rem',
                color: 'var(--gold-light)',
                margin: '0 0 4px',
                textAlign: 'center',
                letterSpacing: '0.1em',
              }}
            >
              SELECT LEVEL
            </h2>
            {HUB_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                className="pixel-level"
                style={{
                  borderLeft: `3px solid ${level.accent}`,
                  borderRight: `3px solid ${level.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  minHeight: '40px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onClick={() => setActiveSection(level.id)}
              >
                <span aria-hidden="true" style={{ fontSize: '1.05rem' }}>{level.icon}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.06em' }}>{level.label}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.58rem',
                      color: level.accent,
                      letterSpacing: '0.15em',
                      opacity: 0.9,
                    }}
                  >
                    · {level.hint}
                  </span>
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setLevelsOpen(false)}
              aria-label="Close level select"
              style={{
                minHeight: 36,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                marginTop: '2px',
                textAlign: 'center',
                width: '100%',
              }}
            >
              ◀ BACK
            </button>
          </motion.div>
        </div>
      )}

      {/* Section overlays mount ABOVE the glass panel — hub state stays put */}
      <AnimatePresence>
        {activeSection && (
          <MobileSectionOverlay
            section={activeSection}
            onClose={() => setActiveSection(null)}
          />
        )}
      </AnimatePresence>

      {/* Reused project detail overlay, reskinned via the pixel-theme wrapper (PRD §7) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="pixel-theme" style={{ zIndex: 600 }}>
            <ProjectDetailOverlay
              slug={selectedProject}
              onClose={() => setSelectedProject(null)}
              onNavigate={(slug) => setSelectedProject(slug)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Lower Left Audio Controls (Mute & Change Song)
          Visible on base page and level display page.
          Hidden completely when any level (Projects, Certificates, Timeline, Skills, Contact) or Project Detail is open */}
      <AnimatePresence>
        {showAudioControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
              left: '26px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 110,
            }}
          >
            {/* Mute / Unmute Button */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
              title={isMuted ? 'Unmute music' : 'Mute music'}
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: 'rgba(12, 12, 20, 0.88)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: isMuted
                  ? '1px solid rgba(255, 75, 75, 0.5)'
                  : '1px solid rgba(212, 175, 55, 0.45)',
                color: isMuted ? '#ff5252' : 'var(--gold)',
                boxShadow: isMuted
                  ? '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 10px rgba(255, 75, 75, 0.25)'
                  : '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 10px rgba(212, 175, 55, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                padding: 0,
              }}
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>

            {/* Change Song / Next Track Button */}
            <button
              type="button"
              onClick={() => {
                if (onNextTrack) {
                  onNextTrack()
                } else {
                  triggerNextTrack()
                }
              }}
              aria-label="Change song"
              title="Change song"
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: 'rgba(12, 12, 20, 0.88)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                color: 'var(--gold)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 10px rgba(212, 175, 55, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                padding: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" fillOpacity="0.25" />
                <line x1="19" y1="5" x2="19" y2="19" strokeWidth="2.5" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

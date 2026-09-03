'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { usePortfolioStore } from '@/lib/store'
import { HUB_LEVELS, type HubSection } from './levels'

const MobileSectionOverlay = dynamic(() => import('./MobileSectionOverlay'), { ssr: false })
const ProjectDetailOverlay = dynamic(() => import('@/components/ui/ProjectDetailOverlay'), { ssr: false })

function GoldNameFrame({ text, side }: { text: string; side: 'left' | 'right' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side]: 0,
        width: 34,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, var(--gold-dim), var(--gold), var(--gold-dim))',
        borderInline: side === 'left' ? '2px solid var(--gold-light)' : '2px solid var(--gold-dim)',
      }}
    >
      <span
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.6rem',
          color: 'var(--bg-dark)',
          letterSpacing: '0.35em',
        }}
      >
        {text}
      </span>
    </div>
  )
}

export default function MobileHub() {
  const [levelsOpen, setLevelsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<HubSection | null>(null)
  const selectedProject = usePortfolioStore((s) => s.selectedProject)
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject)

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'var(--bg-dark)',
      }}
    >
      {/* Pixelated Titantron backdrop (PRD §8) — upscaled from 320px by CSS */}
      <Image
        src="/images/titantron-hub.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', imageRendering: 'pixelated' }}
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
            padding: '0 48px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--cyan)',
              letterSpacing: '0.3em',
            }}
          >
            THE MAIN EVENT
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(0.9rem, 4vw, 1.3rem)',
              color: 'var(--gold-light)',
              textShadow: '3px 3px 0 var(--gold-dim)',
              margin: 0,
              lineHeight: 1.8,
            }}
          >
            UTKARSH SOLANKI
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.2em',
              margin: 0,
            }}
          >
            FULL STACK ENGINEER · SELECT A LEVEL
          </p>
          <button
            type="button"
            className="pixel-cta"
            onClick={() => setLevelsOpen(true)}
            aria-label="Open level select"
          >
            ▶ LEVELS
          </button>
        </div>
      )}

      {/* Glassmorphic level grid — Titantron blurs behind the panel */}
      {levelsOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="pixel-hub-glass"
          role="dialog"
          aria-label="Level select"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 20,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.7rem',
              color: 'var(--gold-light)',
              margin: '0 0 6px',
              textAlign: 'center',
            }}
          >
            SELECT LEVEL
          </h2>
          {HUB_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              className="pixel-level"
              style={{ borderLeft: `4px solid ${level.accent}` }}
              onClick={() => setActiveSection(level.id)}
            >
              <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>{level.icon}</span>
              <span style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{level.label}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    color: 'var(--text-dim)',
                    letterSpacing: '0.25em',
                  }}
                >
                  {level.hint}
                </span>
              </span>
              <span aria-hidden="true" style={{ color: level.accent }}>▶</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setLevelsOpen(false)}
            aria-label="Close level select"
            style={{
              minHeight: 44,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
            }}
          >
            ◀ BACK
          </button>
        </motion.div>
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
    </main>
  )
}

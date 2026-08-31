'use client'

import { useEffect, useCallback, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import type { Project } from '@/data/projects'
import ProjectCarousel from './ProjectCarousel'

interface ProjectDetailOverlayProps {
  slug: string
  onClose: () => void
  onNavigate: (slug: string) => void
}

const TIER_COLORS: Record<Project['tier'], { border: string; bg: string; glow: string }> = {
  'main-event': {
    border: 'var(--gold)',
    bg: 'rgba(212,175,55,0.08)',
    glow: 'rgba(212,175,55,0.2)',
  },
  featured: {
    border: 'var(--cyan)',
    bg: 'rgba(0,229,255,0.08)',
    glow: 'rgba(0,229,255,0.2)',
  },
  undercard: {
    border: 'var(--red-accent)',
    bg: 'rgba(255,23,68,0.08)',
    glow: 'rgba(255,23,68,0.2)',
  },
  'dark-match': {
    border: 'var(--text-dim)',
    bg: 'rgba(80,80,96,0.08)',
    glow: 'rgba(80,80,96,0.2)',
  },
}

const ProjectDetailOverlay = ({ slug, onClose, onNavigate }: ProjectDetailOverlayProps) => {
  const project = useMemo(() => projects.find((p) => p.slug === slug), [slug])
  const currentIndex = useMemo(
    () => projects.findIndex((p) => p.slug === slug),
    [slug]
  )

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  // Close on Escape, Navigate projects on ArrowLeft/ArrowRight
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && prevProject) onNavigate(prevProject.slug)
      if (e.key === 'ArrowRight' && nextProject) onNavigate(nextProject.slug)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onNavigate, prevProject, nextProject])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  if (!project) return null

  const colors = TIER_COLORS[project.tier]
  const descParagraphs = project.longDescription.split('\n\n')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(6, 6, 10, 0.96)',
      }}
    >
      {/* Titantron flash on entry */}
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${colors.glow}, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Outside PREV PROJECT Arrow */}
      {prevProject && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(prevProject.slug)
          }}
          aria-label={`Previous project: ${prevProject.title}`}
          style={{
            position: 'fixed',
            left: 'max(14px, calc(50vw - 610px))',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 510,
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'rgba(15, 15, 22, 0.92)',
            border: `2px solid ${TIER_COLORS[prevProject.tier].border}`,
            color: TIER_COLORS[prevProject.tier].border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.5rem',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 0 25px ${TIER_COLORS[prevProject.tier].glow}, 0 4px 20px rgba(0,0,0,0.6)`,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.18)'
            e.currentTarget.style.background = 'rgba(25, 25, 38, 1)'
            e.currentTarget.style.boxShadow = `0 0 35px ${TIER_COLORS[prevProject.tier].glow}, 0 6px 25px rgba(0,0,0,0.8)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
            e.currentTarget.style.background = 'rgba(15, 15, 22, 0.92)'
            e.currentTarget.style.boxShadow = `0 0 25px ${TIER_COLORS[prevProject.tier].glow}, 0 4px 20px rgba(0,0,0,0.6)`
          }}
        >
          ◀
        </button>
      )}

      {/* Outside NEXT PROJECT Arrow */}
      {nextProject && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(nextProject.slug)
          }}
          aria-label={`Next project: ${nextProject.title}`}
          style={{
            position: 'fixed',
            right: 'max(14px, calc(50vw - 610px))',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 510,
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'rgba(15, 15, 22, 0.92)',
            border: `2px solid ${TIER_COLORS[nextProject.tier].border}`,
            color: TIER_COLORS[nextProject.tier].border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.5rem',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 0 25px ${TIER_COLORS[nextProject.tier].glow}, 0 4px 20px rgba(0,0,0,0.6)`,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.18)'
            e.currentTarget.style.background = 'rgba(25, 25, 38, 1)'
            e.currentTarget.style.boxShadow = `0 0 35px ${TIER_COLORS[nextProject.tier].glow}, 0 6px 25px rgba(0,0,0,0.8)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
            e.currentTarget.style.background = 'rgba(15, 15, 22, 0.92)'
            e.currentTarget.style.boxShadow = `0 0 25px ${TIER_COLORS[nextProject.tier].glow}, 0 4px 20px rgba(0,0,0,0.6)`
          }}
        >
          ▶
        </button>
      )}

      {/* Main panel */}
      <motion.div
        initial={{ scale: 0.92, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 30, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(92vw, 1080px)',
          maxHeight: '88vh',
          background: 'rgba(12, 12, 18, 0.95)',
          border: `1px solid rgba(255, 255, 255, 0.06)`,
          borderTop: `2px solid ${colors.border}`,
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 0 60px ${colors.glow}, 0 25px 80px rgba(0,0,0,0.6)`,
        }}
      >
        {/* ═══ HEADER BAR ═══ */}
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            background: `linear-gradient(90deg, ${colors.bg}, transparent)`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                color: colors.border,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              ▶ MATCH REPLAY
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.45rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '1px 6px',
                border: `1px solid ${colors.border}40`,
                borderRadius: '2px',
              }}
            >
              {project.matchLabel}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close project detail"
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--red-accent)'
              e.currentTarget.style.color = 'var(--red-accent)'
              e.currentTarget.style.background = 'rgba(255,23,68,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
            }}
          >
            ✕
          </button>
        </div>

        {/* ═══ BODY ═══ */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '28px',
              alignItems: 'start',
            }}
            className="project-detail-grid"
          >
            {/* LEFT — Carousel */}
            <div>
              <ProjectCarousel
                screenshots={project.screenshots}
                videos={project.videos}
                aspectRatio={project.aspectRatio}
                tierColor={colors.border}
                projectTitle={project.title}
              />

              {/* Stats bar under carousel */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '14px',
                  padding: '8px 0',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {[
                  { label: 'PLATFORMS', value: project.stats.platforms },
                  { label: 'FEATURES', value: project.stats.features },
                  ...(project.stats.linesOfCode
                    ? [{ label: 'LINES', value: project.stats.linesOfCode.toLocaleString() }]
                    : []),
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center', flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: colors.border,
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.4rem',
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginTop: '3px',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Info panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title */}
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: colors.border,
                    lineHeight: 1.1,
                    marginBottom: '4px',
                  }}
                >
                  {project.title}
                </h2>
                <div
                  style={{
                    width: '40px',
                    height: '2px',
                    background: colors.border,
                    borderRadius: '1px',
                    opacity: 0.6,
                  }}
                />
              </div>

              {/* Long Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {descParagraphs.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Tech Stack */}
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5rem',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  TECH STACK
                </span>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.55rem',
                        padding: '3px 8px',
                        border: `1px solid ${colors.border}30`,
                        borderRadius: '2px',
                        color: colors.border,
                        textTransform: 'uppercase',
                        background: colors.bg,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5rem',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  WHAT OTHERS DON&apos;T HAVE
                </span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px 12px',
                  }}
                >
                  {project.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ color: colors.border, fontSize: '0.5rem' }}>◆</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                {project.live && project.live !== project.release && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: '1 1 auto',
                      minWidth: '130px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      background: `linear-gradient(135deg, ${colors.bg}, ${colors.glow})`,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '3px',
                      color: colors.border,
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 20px ${colors.glow}`
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    🔗 VIEW LIVE MATCH
                  </a>
                )}
                {project.release && (
                  <a
                    href={project.release}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: '1 1 auto',
                      minWidth: '130px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      background: `linear-gradient(135deg, ${colors.bg}, ${colors.glow})`,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '3px',
                      color: colors.border,
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 20px ${colors.glow}`
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    📲 DOWNLOAD APK
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: '1 1 auto',
                      minWidth: '130px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--text-secondary)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    📂 VIEW SOURCE
                  </a>
                )}
                {!project.live && !project.github && !project.release && (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px 16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    LINKS COMING SOON
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Responsive grid override for mobile */}
      <style>{`
        @media (max-width: 768px) {
          .project-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default memo(ProjectDetailOverlay)

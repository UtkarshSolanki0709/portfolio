'use client'

import { motion } from 'framer-motion'
import MatchCard from '@/components/ui/MatchCard'
import CertificatePlaque from '@/components/ui/CertificatePlaque'
import TimelineLocker from '@/components/ui/TimelineLocker'
import SkillBelt from '@/components/ui/SkillBelt'
import { projects } from '@/data/projects'
import { certificates } from '@/data/certificates'
import { skills, superstarStats } from '@/data/skills'
import { usePortfolioStore } from '@/lib/store'
import type { HubSection } from './levels'

const TITLES: Record<HubSection, { eyebrow: string; title: string }> = {
  projects: { eyebrow: "TONIGHT'S CARD", title: 'MATCH CARD' },
  certificates: { eyebrow: 'HALL OF FAME', title: 'TITLE CONTRACTS' },
  timeline: { eyebrow: 'LOCKER ROOM', title: 'CAREER TIMELINE' },
  skills: { eyebrow: 'TRAINING ARSENAL', title: 'SUPERSTAR STATS' },
  contact: { eyebrow: 'FINAL PROMO', title: 'CONTACT' },
}

const CONTACT_LINKS = [
  { label: '✉️ EMAIL', href: 'mailto:solankiut07@gmail.com', external: false },
  { label: '💼 LINKEDIN', href: 'https://www.linkedin.com/in/utkarsh-solanki-424b55291/', external: true },
  { label: '🐙 GITHUB', href: 'https://github.com/UtkarshSolanki0709', external: true },
]

export default function MobileSectionOverlay({
  section,
  onClose,
}: {
  section: HubSection
  onClose: () => void
}) {
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject)
  const meta = TITLES[section]

  return (
    <motion.div
      className="pixel-theme"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role="dialog"
      aria-modal="true"
      aria-label={meta.title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(6, 6, 10, 0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop: '4px solid var(--gold)',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '2px solid var(--border-gold)',
          flexShrink: 0,
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'var(--gold)',
              letterSpacing: '0.3em',
              display: 'block',
            }}
          >
            {meta.eyebrow}
          </span>
          <h2 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '8px 0 0' }}>
            {meta.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${meta.title.toLowerCase()}`}
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 23, 68, 0.12)',
            border: '2px solid var(--red-accent)',
            color: 'var(--red-accent)',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {section === 'projects' &&
          projects.map((project, index) => (
            <MatchCard
              key={project.slug}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project.slug)}
            />
          ))}

        {section === 'certificates' &&
          certificates.map((certificate, index) => (
            <CertificatePlaque key={certificate.name} certificate={certificate} index={index} />
          ))}

        {section === 'timeline' && (
          <div style={{ width: '100%' }}>
            <TimelineLocker compact />
          </div>
        )}

        {section === 'skills' && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 16,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'var(--gold)',
                letterSpacing: '0.2em',
                padding: '8px 0 12px',
              }}
            >
              <span>OVR {superstarStats.overall}</span>
              <span>FRONTEND {superstarStats.frontend}</span>
              <span>BACKEND {superstarStats.backend}</span>
              <span>MOBILE {superstarStats.mobile}</span>
            </div>
            {skills.map((skill, index) => (
              <SkillBelt key={skill.name} skill={skill} index={index} />
            ))}
          </>
        )}

        {section === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              The arena is open. The ring is set. Let&apos;s build something legendary together.
            </p>
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                style={{
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--gold)',
                  color: 'var(--gold)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

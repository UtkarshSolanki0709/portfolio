'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import type { Certificate } from '@/data/certificates'
import { CertificatePlaqueSVG } from '@/components/ui/WrestlingIcons'

interface CertificatePlaqueProps {
  certificate: Certificate
  index: number
}

const CertificatePlaque = ({ certificate, index }: CertificatePlaqueProps) => {
  const tierLabels = {
    heavyweight: '🏆 HEAVYWEIGHT TITLE',
    intercontinental: '🥈 INTERCONTINENTAL',
    hardcore: '🥊 HARDCORE CHAMPION',
  }

  const categoryColors = {
    gold: { border: 'var(--gold)', bg: 'rgba(212,175,55,0.08)', text: 'var(--gold)' },
    cyan: { border: 'var(--cyan)', bg: 'rgba(0,229,255,0.08)', text: 'var(--cyan)' },
    red: { border: 'var(--red-accent)', bg: 'rgba(255,23,68,0.08)', text: 'var(--red-accent)' },
  }

  const colors = categoryColors[certificate.category]

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 20px ${colors.bg}`,
      }}
      onClick={() => window.open(certificate.verificationUrl, '_blank')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 16px',
        background: 'var(--bg-card)',
        border: `1px solid ${colors.border}`,
        borderRadius: '2px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: '74px',
        boxSizing: 'border-box',
      }}
    >
      {/* Background shine sweep */}
      <motion.div
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          pointerEvents: 'none',
          width: '50%',
        }}
      />

      {/* Plaque SVG Asset */}
      <div style={{ flexShrink: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CertificatePlaqueSVG style={{ width: '56px', height: '28px' }} glowColor={colors.border} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.85rem, 3.2vw, 0.95rem)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            wordBreak: 'break-word',
          }}
        >
          {certificate.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
            marginTop: '3px',
            lineHeight: 1.2,
          }}
        >
          SANCTIONED BY: <span style={{ color: colors.text, fontWeight: 600 }}>{certificate.issuer}</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: colors.text,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginTop: '3px',
            opacity: 0.85,
            lineHeight: 1.2,
          }}
        >
          {tierLabels[certificate.tier]}
        </div>
      </div>

      {/* Contract / Registration details */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '2px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'var(--text-secondary)',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <div>SIGNED: {certificate.date}</div>
        <div style={{ opacity: 0.6 }}>ID: {certificate.credentialId}</div>
      </div>
    </motion.div>
  )
}

export default memo(CertificatePlaque)

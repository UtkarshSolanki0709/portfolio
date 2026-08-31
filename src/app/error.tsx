'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Arena Execution Error:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-darker, #06060a)',
        color: 'var(--text-primary, #ffffff)',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: "var(--font-rajdhani, 'Rajdhani', sans-serif)",
      }}
    >
      {/* Heavy Steel Warning Plate */}
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          background: 'rgba(15, 15, 22, 0.95)',
          border: '2px solid var(--red-accent, #ff1744)',
          borderRadius: '8px',
          boxShadow: '0 0 40px rgba(255, 23, 68, 0.25)',
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-share-tech, 'Share Tech Mono', monospace)",
            fontSize: '0.75rem',
            color: 'var(--red-accent, #ff1744)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          TECHNICAL KNOCKOUT · 500
        </span>

        <h1
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: '3rem',
            lineHeight: 1,
            color: 'var(--gold, #d4af37)',
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          DISQUALIFIED BY REVERSED DECISION
        </h1>

        <p
          style={{
            fontFamily: "var(--font-barlow, 'Barlow Condensed', sans-serif)",
            fontSize: '1rem',
            color: 'var(--text-secondary, #a0a0b0)',
            marginBottom: '28px',
            lineHeight: 1.5,
          }}
        >
          A rogue exception entered the ring. The referee has called for a brief stoppage while we restore the match.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, var(--gold, #d4af37), var(--gold-dim, #aa8529))',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: '1.2rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            RESTART MATCH
          </button>

          <Link
            href="/"
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: 'var(--cyan, #00e5ff)',
              border: '1px solid var(--cyan, #00e5ff)',
              borderRadius: '4px',
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: '1.2rem',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            BACKSTAGE PASS
          </Link>
        </div>
      </div>
    </div>
  )
}

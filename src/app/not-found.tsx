import React from 'react'
import Link from 'next/link'

export default function NotFound() {
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
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          background: 'rgba(15, 15, 22, 0.95)',
          border: '2px solid var(--gold, #d4af37)',
          borderRadius: '8px',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)',
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-share-tech, 'Share Tech Mono', monospace)",
            fontSize: '0.75rem',
            color: 'var(--gold, #d4af37)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          COUNTED OUT · 404
        </span>

        <h1
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: '3.5rem',
            lineHeight: 0.95,
            color: 'var(--gold, #d4af37)',
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          MATCH NOT FOUND
        </h1>

        <p
          style={{
            fontFamily: "var(--font-barlow, 'Barlow Condensed', sans-serif)",
            fontSize: '1.05rem',
            color: 'var(--text-secondary, #a0a0b0)',
            marginBottom: '28px',
            lineHeight: 1.5,
          }}
        >
          The referee reached a 10-count. This arena section does not exist or has been removed from tonight&apos;s card.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'linear-gradient(135deg, var(--gold, #d4af37), var(--gold-dim, #aa8529))',
            color: '#000',
            borderRadius: '4px',
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: '1.25rem',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          RETURN TO THE ARENA
        </Link>
      </div>
    </div>
  )
}

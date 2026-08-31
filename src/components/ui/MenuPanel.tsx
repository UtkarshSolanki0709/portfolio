'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '@/lib/store'

interface MenuItem {
  label: string
  icon: string
  id: string
  sceneIndex: number
  projectSlug?: string
}

const menuItems: MenuItem[] = [
  { label: 'ENTRANCE', icon: '🎭', id: 'entrance', sceneIndex: 0 },
  { label: 'MAIN EVENT', icon: '⭐', id: 'mainevent', sceneIndex: 1, projectSlug: 'botzilla-website' },
  { label: 'MATCH CARD', icon: '⚔️', id: 'matchcard', sceneIndex: 1 },
  { label: 'CHAMPIONSHIPS', icon: '🏆', id: 'championships', sceneIndex: 2 },
  { label: 'BACKSTAGE', icon: '🚪', id: 'backstage', sceneIndex: 3 },
  { label: 'CONTACT', icon: '📞', id: 'contact', sceneIndex: 4 },
]

export default function MenuPanel() {
  const { activeMenuItem, setActiveMenuItem, setActiveScene, setSelectedProject } = usePortfolioStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(activeMenuItem + 1, menuItems.length - 1)
        setActiveMenuItem(next)
        const target = menuItems[next]
        setActiveScene(target.sceneIndex)
        if (target.projectSlug) {
          setSelectedProject(target.projectSlug)
        } else {
          setSelectedProject(null)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = Math.max(activeMenuItem - 1, 0)
        setActiveMenuItem(prev)
        const target = menuItems[prev]
        setActiveScene(target.sceneIndex)
        if (target.projectSlug) {
          setSelectedProject(target.projectSlug)
        } else {
          setSelectedProject(null)
        }
      } else if (e.key === 'Escape') {
        setIsExpanded(false)
      }
    },
    [activeMenuItem, setActiveMenuItem, setActiveScene, setSelectedProject]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <motion.nav
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      role="navigation"
      aria-label="Main menu"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        width: isExpanded ? '180px' : '48px',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 100,
        background: 'rgba(10, 10, 15, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Menu header */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          padding: '8px 12px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {isExpanded ? '// NAVIGATE' : '//'}
      </div>

      {menuItems.map((item, index) => {
        const isActive = activeMenuItem === index
        return (
          <motion.button
            key={item.id}
            role="menuitem"
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              setActiveMenuItem(index)
              setActiveScene(item.sceneIndex)
              if (item.projectSlug) {
                setSelectedProject(item.projectSlug)
              } else {
                setSelectedProject(null)
              }
            }}
            onMouseEnter={() => {
              setActiveMenuItem(index)
            }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              background: isActive
                ? 'rgba(212,175,55,0.1)'
                : 'transparent',
              border: 'none',
              borderLeft: isActive
                ? '3px solid var(--gold)'
                : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              outline: 'none',
            }}
          >
            {/* Active indicator glow */}
            {isActive && (
              <motion.div
                layoutId="menu-glow"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(212,175,55,0.08), transparent)',
                  pointerEvents: 'none',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            {/* Icon */}
            <span style={{ fontSize: '1.1rem', flexShrink: 0, position: 'relative', zIndex: 1 }}>
              {item.icon}
            </span>

            {/* Label */}
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.1em',
                    color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Active dot for collapsed state */}
            {isActive && !isExpanded && (
              <div
                style={{
                  position: 'absolute',
                  right: '8px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  boxShadow: '0 0 6px var(--gold)',
                }}
              />
            )}
          </motion.button>
        )
      })}

      {/* Bottom separator + version */}
      <div
        style={{
          marginTop: '8px',
          borderTop: '1px solid var(--border-subtle)',
          padding: '8px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          color: 'var(--text-dim)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {isExpanded ? 'v2.0 · MAIN EVENT' : 'v2'}
      </div>
    </motion.nav>
  )
}

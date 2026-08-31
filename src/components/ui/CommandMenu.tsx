'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '@/lib/store'
import { projects } from '@/data/projects'
import { Search, Trophy, Disc, Radio, ArrowRight, X } from 'lucide-react'

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { setActiveScene, setSelectedProject, toggleMute, isMuted } = usePortfolioStore()

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSelectScene = useCallback(
    (index: number) => {
      setActiveScene(index)
      setSelectedProject(null)
      setIsOpen(false)
      setSearch('')
    },
    [setActiveScene, setSelectedProject]
  )

  const handleSelectProject = useCallback(
    (slug: string) => {
      setActiveScene(1)
      setSelectedProject(slug)
      setIsOpen(false)
      setSearch('')
    },
    [setActiveScene, setSelectedProject]
  )

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.stack.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  const navigationItems = [
    { label: 'ENTRANCE · THE ARENA', sceneIndex: 0, icon: <Disc size={16} color="var(--gold)" /> },
    { label: 'MATCH CARD · PROJECTS', sceneIndex: 1, icon: <Search size={16} color="var(--cyan)" /> },
    { label: 'CHAMPIONSHIPS · CREDENTIALS', sceneIndex: 2, icon: <Trophy size={16} color="var(--gold)" /> },
    { label: 'BACKSTAGE · LOCKER ROOM', sceneIndex: 3, icon: <Radio size={16} color="var(--red-accent)" /> },
    { label: 'CONTACT · CONTRACT SIGNING', sceneIndex: 4, icon: <ArrowRight size={16} color="var(--cyan)" /> },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Arena Command Menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '15vh',
          }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close command menu backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              cursor: 'default',
              padding: 0,
              margin: 0,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '560px',
              background: 'rgba(12, 12, 18, 0.98)',
              border: '1px solid var(--gold, #d4af37)',
              borderRadius: '8px',
              boxShadow: '0 0 50px rgba(212, 175, 55, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Search Input Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                gap: '12px',
              }}
            >
              <label htmlFor="command-search-input" className="sr-only">
                Search arena matches, projects, and scenes
              </label>
              <Search size={20} color="var(--gold)" aria-hidden="true" />
              <input
                id="command-search-input"
                autoFocus
                type="text"
                aria-label="Search arena matches, projects, and scenes"
                placeholder="Search projects, matches, or arena scenes... (ESC to close)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontFamily: "var(--font-rajdhani, 'Rajdhani', sans-serif)",
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              />
              <button
                type="button"
                aria-label="Close command menu"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Results Body */}
            <div
              style={{
                maxHeight: '380px',
                overflowY: 'auto',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {/* Navigation Items */}
              {!search && (
                <div style={{ marginBottom: '8px' }}>
                  <span
                    style={{
                      fontFamily: "var(--font-share-tech, monospace)",
                      fontSize: '0.6rem',
                      color: 'var(--text-dim)',
                      letterSpacing: '0.2em',
                      padding: '4px 8px',
                      display: 'block',
                    }}
                  >
                    ARENA SECTIONS
                  </span>
                  {navigationItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleSelectScene(item.sceneIndex)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                        fontFamily: "var(--font-rajdhani, sans-serif)",
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Projects List */}
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-share-tech, monospace)",
                    fontSize: '0.6rem',
                    color: 'var(--text-dim)',
                    letterSpacing: '0.2em',
                    padding: '4px 8px',
                    display: 'block',
                  }}
                >
                  FEATURED MATCHES ({filteredProjects.length})
                </span>
                {filteredProjects.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => handleSelectProject(p.slug)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'var(--text-primary)',
                      fontFamily: "var(--font-rajdhani, sans-serif)",
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 229, 255, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{p.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {p.stack.slice(0, 3).join(' · ')}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
                      VIEW MATCH →
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
                <button
                  onClick={() => {
                    toggleMute()
                    setIsOpen(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)',
                    fontFamily: "var(--font-rajdhani, sans-serif)",
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span>{isMuted ? '🔊 UNMUTE ARENA AUDIO' : '🔇 MUTE ARENA AUDIO'}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>M</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '10px 16px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.65rem',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span>CMD+K / CTRL+K TO TOGGLE</span>
              <span>ESC TO CLOSE</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

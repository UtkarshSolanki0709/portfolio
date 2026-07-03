'use client'

import { useEffect, useCallback, useState, useRef, startTransition } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import IntroPromo from '@/components/ui/IntroPromo'
import { usePortfolioStore } from '@/lib/store'
import LoadingScreen from '@/components/layout/LoadingScreen'
import MenuPanel from '@/components/ui/MenuPanel'
import MatchCard from '@/components/ui/MatchCard'
import ProjectDetailOverlay from '@/components/ui/ProjectDetailOverlay'
import CertificatePlaque from '@/components/ui/CertificatePlaque'
import TimelineLocker from '@/components/ui/TimelineLocker'
import CommentaryQuipDisplay, { useCommentaryQuip } from '@/components/ui/CommentaryQuip'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { AvatarSlamSVG, RingSVG } from '@/components/ui/WrestlingIcons'
import PipebombOverlay from '@/components/easter-eggs/PipebombOverlay'
import { useArenaAudio } from '@/hooks/useArenaAudio'
import { Howler } from 'howler'
import { useKonamiCode } from '@/hooks/useKonamiCode'
import { usePipebomb } from '@/hooks/usePipebomb'
import { projects } from '@/data/projects'
import { skills } from '@/data/skills'
import { certificates } from '@/data/certificates'
import { timeline } from '@/data/timeline'
import { toasts as toastData } from '@/data/toasts'

// Dynamic imports for 3D components (avoids SSR issues with Three.js)
const SceneWrapper = dynamic(() => import('@/components/layout/SceneWrapper'), { ssr: false })
const Arena = dynamic(() => import('@/components/3d/Arena'), { ssr: false })

const SECTIONS = ['entrance', 'matchcard', 'championships', 'backstage', 'contact']

function PortfolioContent() {
  // Granular Zustand selectors — only re-render when the specific slice changes
  const isLoading = usePortfolioStore(s => s.isLoading)
  const showPipebomb = usePortfolioStore(s => s.showPipebomb)
  const setShowPipebomb = usePortfolioStore(s => s.setShowPipebomb)
  const hardcoreMode = usePortfolioStore(s => s.hardcoreMode)
  const toggleHardcoreMode = usePortfolioStore(s => s.toggleHardcoreMode)
  const incrementAttitude = usePortfolioStore(s => s.incrementAttitude)
  const activeScene = usePortfolioStore(s => s.activeScene)
  const setActiveScene = usePortfolioStore(s => s.setActiveScene)
  const isMuted = usePortfolioStore(s => s.isMuted)
  const toggleMute = usePortfolioStore(s => s.toggleMute)
  const hasSeenPromo = usePortfolioStore(s => s.hasSeenPromo)
  const setHasSeenPromo = usePortfolioStore(s => s.setHasSeenPromo)
  const selectedProject = usePortfolioStore(s => s.selectedProject)
  const setSelectedProject = usePortfolioStore(s => s.setSelectedProject)

  const shouldShowPromo = !isLoading && !hasSeenPromo

  // Deferred 3D scene mount — let 2D UI paint first as LCP element
  const [sceneReady, setSceneReady] = useState(false)
  useEffect(() => {
    if (isLoading) return
    // Use requestIdleCallback (or setTimeout fallback) to defer 3D mount
    const schedule = typeof requestIdleCallback !== 'undefined' ? requestIdleCallback : (cb: () => void) => setTimeout(cb, 100)
    const id = schedule(() => {
      startTransition(() => {
        setSceneReady(true)
      })
    })
    return () => {
      if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(id as number)
      } else {
        clearTimeout(id as number)
      }
    }
  }, [isLoading])

  const { quip, showQuip } = useCommentaryQuip()
  const { showToast } = useToast()
  
  const handleTrackChange = useCallback((track: 'theme' | 'bgm1' | 'bgm2') => {
    if (track === 'bgm2') {
      showQuip({
        text: "Call it WFH the way we ain't working today",
        commentator: 'Graves',
      })
    } else if (track === 'bgm1') {
      showQuip({
        text: "Time to push the code with no tests",
        commentator: 'JR',
      })
    }
  }, [showQuip])

  const { playSound, nextTrack } = useArenaAudio(handleTrackChange)
  const [pyroActive, setPyroActive] = useState(false)
  const isNavigating = useRef(false)


  // Navigation Handler (Wheel / Touch)
  useEffect(() => {
    if (isLoading || showPipebomb || selectedProject) return

    const handleWheel = (e: WheelEvent) => {
      if (isNavigating.current) return
      
      const direction = e.deltaY > 0 ? 1 : -1
      const nextScene = Math.min(Math.max(activeScene + direction, 0), SECTIONS.length - 1)
      
      if (nextScene !== activeScene) {
        isNavigating.current = true
        setActiveScene(nextScene)
        setTimeout(() => { isNavigating.current = false }, 800) // Cooling period
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isLoading, showPipebomb, selectedProject, activeScene, setActiveScene])

  // Konami Code Easter Egg
  useKonamiCode(useCallback(() => {
    toggleHardcoreMode()
    showToast({
      headline: '💀 HARDCORE MODE',
      body: 'You unlocked Hardcore Mode! The arena just got dangerous.',
      variant: 'red',
    })
  }, [toggleHardcoreMode, showToast]))

  // Pipebomb Easter Egg
  usePipebomb(useCallback(() => {
    setShowPipebomb(true)
  }, [setShowPipebomb]))

  // Random Toast on E key, Pyro on P key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      
      if (e.key === 'e' || e.key === 'E') {
        const randomToast = toastData[Math.floor(Math.random() * toastData.length)]
        showToast(randomToast)
      }
      
      if (e.key === 'p' || e.key === 'P') {
        setPyroActive(true)
        playSound('pyro')
        setTimeout(() => setPyroActive(false), 3000)
        showToast({
          headline: '🔥 PYRO!',
          body: 'The arena erupts with pyrotechnics!',
          variant: 'gold',
        })
      }

      if (e.key === 'm' || e.key === 'M') {
        toggleMute()
        showToast({
          headline: isMuted ? '🔊 UNMUTED' : '🔇 MUTED',
          body: isMuted 
            ? 'The crowd and theme music are back!'
            : 'This tab is now silent. (Note: Check other open tabs!)',
          variant: isMuted ? 'gold' : 'red',
        })
      }

      if (e.key === 'n' || e.key === 'N') {
        nextTrack()
        showToast({
          headline: '⏭️ NEXT TRACK',
          body: 'Skipping to the next theme...',
          variant: 'cyan',
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showToast, toggleMute, isMuted, nextTrack, playSound])

  // Attitude Meter - throttled global click counter (max once per 500ms)
  const lastAttitudeClick = useRef(0)
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now()
      if (now - lastAttitudeClick.current >= 500) {
        lastAttitudeClick.current = now
        incrementAttitude()
      }
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [incrementAttitude])

  return (
    <>
      <LoadingScreen onEnter={() => {
        // Unlock Howler AudioContext and play the entrance theme
        try {
          if (Howler.ctx) {
            Howler.ctx.resume()
          }
        } catch (e) {
          console.warn(e)
        }
        playSound('theme')
      }} />
      <PipebombOverlay
        isVisible={showPipebomb}
        onClose={() => setShowPipebomb(false)}
      />
      <CommentaryQuipDisplay quip={quip} />

      {/* Intro Promo Package */}
      {shouldShowPromo && (
        <IntroPromo 
          onComplete={() => {
            setHasSeenPromo(true)
          }} 
        />
      )}

      {/* 3D Arena Background — deferred mount for LCP */}
      {sceneReady && (
        <SceneWrapper>
          <Arena pyroActive={pyroActive} activeSection={activeScene} />
        </SceneWrapper>
      )}

      {!isLoading && (
        <main
          id="main-content"
          style={{
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            filter: hardcoreMode ? 'hue-rotate(20deg) saturate(1.3)' : 'none',
            transition: 'filter 0.5s ease',
          }}
        >
          {/* Fixed UI Layer */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              padding: '0 4px',
            }}
          >
            <MenuPanel
              onHoverItem={() => showQuip()}
            />
          </div>



          {/* Hardcore Mode Badge */}
          {hardcoreMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 200,
                fontFamily: 'var(--font-display)',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--red-accent)',
                background: 'rgba(255,23,68,0.1)',
                border: '1px solid var(--red-accent)',
                padding: '6px 16px',
                borderRadius: '2px',
              }}
            >
              💀 HARDCORE MODE ACTIVE
            </motion.div>
          )}

          {/* ═══════ SCENE 1 — ENTRANCE ═══════ */}
          <AnimatePresence mode="wait">
            {activeScene === 0 && (
              <motion.section
                key="entrance"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(1rem, 5vh, 2rem) 1rem',
                }}
              >
                <div
                  style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
                >
                  <div
                    style={{
                      margin: '0 auto 24px',
                      display: 'flex',
                      justifyContent: 'center',
                      filter: hardcoreMode
                        ? 'drop-shadow(0 0 25px rgba(255,23,68,0.7))'
                        : 'drop-shadow(0 0 15px rgba(255,23,68,0.5))',
                      animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                  >
                    <AvatarSlamSVG style={{ width: '45px', height: '45px' }} glowColor="var(--red-accent)" />
                  </div>

                  <h1
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.8rem, 6vw, 3.2rem)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dim))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '8px',
                      lineHeight: 1,
                    }}
                  >
                    UTKARSH SOLANKI
                  </h1>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'min(0.75rem, 3vw)',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3em',
                    }}
                  >
                    FULL STACK ENGINEER · THE MAIN EVENT
                  </p>
                </div>

                {/* Ticker */}
                <div
                  style={{
                    marginTop: '32px',
                    width: 'min(90%, 900px)',
                    overflow: 'hidden',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '8px 0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '40px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap',
                      animation: 'ticker-scroll 40s linear infinite',
                      width: 'max-content',
                    }}
                  >
                    {[
                      "⚡ By Gawd He's Broken In Half",
                      '🔥 Business Is About To Pick Up',
                      '💻 MERN Stack · 92 OVR',
                      '⚡ Somebody Stop The Damn Build',
                      '📱 React Native · 88 OVR',
                      '🔥 As God As My Witness He Is Broken In Half',
                      '🤖 AI Tooling · 75 OVR',
                      '💻 TypeScript · 82 OVR',
                    ].map((item, i) => (
                      <span key={i}>{item}</span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>SCROLL TO EXPLORE THE WORLD</span>
                  <span style={{ fontSize: '1.2rem' }}>▼</span>
                </div>
              </motion.section>
            )}

            {/* ═══════ SCENE 2 — MATCH CARD ═══════ */}
            {activeScene === 1 && (
              <motion.section
                key="matchcard"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '120px',
                  paddingRight: '40px',
                }}
              >
                <div style={{ maxWidth: '800px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <RingSVG style={{ width: '50px', height: '50px' }} accentColor="var(--gold)" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.3em' }}>TONIGHT&apos;S CARD</span>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>MATCH CARD</h2>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingRight: '12px', flex: 1 }}>
                    {projects.map((project, index) => (
                      <MatchCard
                        key={project.slug}
                        project={project}
                        index={index}
                        onClick={() => setSelectedProject(project.slug)}
                      />
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* ═══════ SCENE 3 — CHAMPIONSHIPS ═══════ */}
            {activeScene === 2 && (
              <motion.section
                key="championships"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '120px',
                }}
              >
                <div style={{ maxWidth: '600px', width: '100%' }}>
                  <div style={{ marginBottom: '40px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--cyan)', letterSpacing: '0.3em' }}>HALL OF FAME</span>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>TITLE CONTRACTS & CREDENTIALS</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {certificates.map((cert, index) => (
                      <CertificatePlaque key={cert.name} certificate={cert} index={index} />
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* ═══════ SCENE 4 — BACKSTAGE ═══════ */}
            {activeScene === 3 && (
              <motion.section
                key="backstage"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '120px',
                }}
              >
                <div style={{ maxWidth: '600px', width: '100%' }}>
                  <div style={{ marginBottom: '40px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--red-accent)', letterSpacing: '0.3em' }}>LOCKER ROOM</span>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>BACKSTAGE</h2>
                  </div>
                  <div style={{ width: '100%' }}>
                    <TimelineLocker />
                  </div>
                </div>
              </motion.section>
            )}

            {/* ═══════ SCENE 5 — CONTACT ═══════ */}
            {activeScene === 4 && (
              <motion.section
                key="contact"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '80px 2rem',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.3em' }}>FINAL PROMO</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: 'var(--gold)' }}>READY FOR THE NEXT MATCH?</h2>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', maxWidth: '400px', margin: '20px auto 40px' }}>
                    The arena is open. The ring is set. Let&apos;s build something legendary together.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {[
                      { label: '✉️ EMAIL', href: 'mailto:utkarsh@example.com', color: 'var(--gold)' },
                      { label: '💼 LINKEDIN', href: '#', color: 'var(--cyan)' },
                    ].map((link) => (
                      <a key={link.label} href={link.href} style={{ padding: '12px 24px', border: `1px solid ${link.color}`, color: link.color, textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600 }}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Controller hints bar - fixed bottom */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 90,
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              padding: '6px',
              background: 'linear-gradient(transparent, rgba(6,6,10,0.9))',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {[
              { key: '✕', label: 'SELECT' },
              { key: '○', label: 'BACK' },
              { key: 'M', label: 'MUTE' },
              { key: 'P', label: 'PYRO' },
              { key: 'E', label: 'NEWS' },
              { key: 'N', label: 'NEXT' },
            ].map((btn) => (
              <div
                key={btn.label}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '1px solid var(--text-dim)',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.5rem',
                  }}
                >
                  {btn.key}
                </span>
                {btn.label}
              </div>
            ))}
          </div>
        </main>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailOverlay
            slug={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNavigate={(slug) => setSelectedProject(slug)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default function PortfolioRoot() {
  return (
    <ToastProvider>
      <PortfolioContent />
    </ToastProvider>
  )
}

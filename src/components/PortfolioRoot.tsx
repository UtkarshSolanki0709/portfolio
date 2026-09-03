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
import SectionFighterPoster from '@/components/ui/SectionFighterPoster'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { AvatarSlamSVG, RingSVG } from '@/components/ui/WrestlingIcons'
import { useArenaAudio, TRACK_METADATA } from '@/hooks/useArenaAudio'
import { Howler } from 'howler'
import { useKonamiCode } from '@/hooks/useKonamiCode'
import { getInitialViewportIsMobile } from '@/hooks/useDeviceCapability'
import { projects } from '@/data/projects'
import { certificates } from '@/data/certificates'
import { toasts as toastData } from '@/data/toasts'

// Dynamic imports for 3D components (avoids SSR issues with Three.js)
const SceneWrapper = dynamic(() => import('@/components/layout/SceneWrapper'), { ssr: false })
const Arena = dynamic(() => import('@/components/3d/Arena'), { ssr: false })
// Mobile 8-bit hub (PRD): only fetched on <768px first-load viewports
const MobileHub = dynamic(() => import('@/components/mobile/MobileHub'), { ssr: false })

const SECTIONS = ['entrance', 'matchcard', 'championships', 'backstage', 'contact']

function PortfolioContent() {
  // Granular Zustand selectors — only re-render when the specific slice changes
  const isLoading = usePortfolioStore(s => s.isLoading)
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
  const setPortalHovered = usePortfolioStore(s => s.setPortalHovered)
  const triggerPortalPulse = usePortfolioStore(s => s.triggerPortalPulse)

  const shouldShowPromo = !isLoading && !hasSeenPromo

  // Decision 1: locked at first load — rotation never swaps experiences mid-session
  const [isMobileViewport] = useState(getInitialViewportIsMobile)

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

  const { showToast } = useToast()

  const { playSound, nextTrack } = useArenaAudio()
  const [pyroActive, setPyroActive] = useState(false)
  const isNavigating = useRef(false)
  const pyroTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (pyroTimer.current) clearTimeout(pyroTimer.current)
    }
  }, [])

  // Entrance portal CTA — cinematic walkout into the Match Card
  const handleEnterArena = useCallback(() => {
    triggerPortalPulse()
    setPyroActive(true)
    playSound('pyro')
    setActiveScene(1)
    if (pyroTimer.current) clearTimeout(pyroTimer.current)
    pyroTimer.current = setTimeout(() => setPyroActive(false), 3000)
  }, [triggerPortalPulse, playSound, setActiveScene])


  // Navigation Handler (Wheel / Touch)
  useEffect(() => {
    if (isLoading || selectedProject || isMobileViewport) return

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
  }, [isLoading, selectedProject, isMobileViewport, activeScene, setActiveScene])

  // Konami Code Easter Egg
  useKonamiCode(useCallback(() => {
    toggleHardcoreMode()
    showToast({
      headline: '💀 HARDCORE MODE UNLOCKED',
      body: 'You entered the cheat code! Maximum distortion enabled.',
      variant: 'red',
    })
  }, [toggleHardcoreMode, showToast]))



  // Random Toast on E key, Pyro on P key, Mute on M, Next Track on N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }
      
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
        const nextKey = nextTrack()
        const meta = TRACK_METADATA[nextKey]
        showToast({
          headline: '🎵 SOUNDTRACK CHANGED',
          body: `Now Playing: ${meta?.title || nextKey} (${meta?.genre || 'BGM'})`,
          variant: 'gold',
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

  // ═══ MOBILE PATH — 8-bit hub, no Three.js (PRD §5/§10) ═══
  if (isMobileViewport) {
    return (
      <>
        <LoadingScreen
          onEnter={() => {
            try {
              if (Howler.ctx) Howler.ctx.resume()
            } catch (e) {
              console.warn(e)
            }
            playSound('theme')
          }}
        />
        {shouldShowPromo && <IntroPromo onComplete={() => setHasSeenPromo(true)} />}
        {!isLoading && <MobileHub />}
      </>
    )
  }

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
            <MenuPanel />
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                }}
              >
                {/* Upper Floating Name (Hovering Above/Over the Ring) */}
                <motion.div
                  initial={{ opacity: 0, y: -25, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    top: 'clamp(20%, 25vh, 28%)',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zIndex: 10,
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                  }}
                >
                  <motion.div
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      y: -30,
                      filter: 'blur(4px)',
                      transition: { duration: 0.5 },
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      filter: hardcoreMode
                        ? 'drop-shadow(0 0 25px rgba(255,23,68,0.7))'
                        : 'drop-shadow(0 0 15px rgba(255,23,68,0.5))',
                      animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                  >
                    <AvatarSlamSVG style={{ width: '40px', height: '40px' }} glowColor="var(--red-accent)" />
                  </motion.div>

                  <h1
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 6.5vw, 3.8rem)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dim))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      margin: 0,
                      lineHeight: 1,
                      filter: 'drop-shadow(0 0 35px rgba(212,175,55,0.45))',
                      display: 'flex',
                      gap: '0.35em',
                      justifyContent: 'center',
                    }}
                  >
                    <motion.span
                      exit={{
                        x: '-35vw',
                        y: '-22vh',
                        scale: 0.6,
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      UTKARSH
                    </motion.span>
                    <motion.span
                      exit={{
                        x: '35vw',
                        y: '-22vh',
                        scale: 0.6,
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      SOLANKI
                    </motion.span>
                  </h1>
                </motion.div>

                {/* Lower Elements (Docked Below the Ring Area) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 35,
                    transition: { duration: 0.5, ease: 'easeOut' },
                  }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(1.5rem, 4vh, 2.8rem)',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    pointerEvents: 'auto',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'min(0.7rem, 2.8vw)',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3em',
                      margin: 0,
                    }}
                  >
                    FULL STACK ENGINEER · THE MAIN EVENT
                  </p>

                  {/* Ticker */}
                  <div
                    style={{
                      width: 'min(90vw, 850px)',
                      overflow: 'hidden',
                      borderTop: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                      padding: '6px 0',
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
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px',
                    }}
                  >
                    <button
                      type="button"
                      className="portal-cta"
                      aria-label="Enter the arena and view the match card"
                      onClick={handleEnterArena}
                      onMouseEnter={() => setPortalHovered(true)}
                      onMouseLeave={() => setPortalHovered(false)}
                      onFocus={() => setPortalHovered(true)}
                      onBlur={() => setPortalHovered(false)}
                    >
                      ENTER THE ARENA
                    </button>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.55rem',
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      OR SCROLL <span style={{ fontSize: '0.8rem' }}>▼</span>
                    </span>
                  </div>
                </motion.div>
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
                  justifyContent: 'space-between',
                  paddingLeft: '120px',
                  paddingRight: '60px',
                  gap: '40px',
                }}
              >
                <div style={{ maxWidth: '750px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <RingSVG style={{ width: '50px', height: '50px' }} accentColor="var(--gold)" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.3em' }}>TONIGHT&apos;S CARD</span>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>MATCH CARD</h2>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingRight: '12px', flex: 1 }}>
                    {projects.length > 0 ? (
                      projects.map((project, index) => (
                        <MatchCard
                          key={project.slug}
                          project={project}
                          index={index}
                          onClick={() => setSelectedProject(project.slug)}
                        />
                      ))
                    ) : (
                      <div
                        style={{
                          padding: '32px',
                          textAlign: 'center',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px dashed var(--border-subtle, rgba(255,255,255,0.1))',
                          borderRadius: '6px',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            color: 'var(--text-dim)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            margin: 0,
                          }}
                        >
                          NO MATCHES SCHEDULED TONIGHT
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right-side Fighter Card Photo */}
                <SectionFighterPoster
                  imageSrc="/images/user-clean.png"
                  altText="Utkarsh Solanki Tale of the Tape"
                  badgeText="TALE OF THE TAPE"
                  title="UTKARSH SOLANKI"
                  subtitle="MAIN EVENT FIGHTER"
                  accentColor="var(--gold)"
                />
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
                  justifyContent: 'space-between',
                  paddingLeft: '120px',
                  paddingRight: '60px',
                  gap: '40px',
                }}
              >
                <div style={{ maxWidth: '620px', width: '100%', flex: 1 }}>
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

                {/* Right-side Championship Belt Photo */}
                <SectionFighterPoster
                  imageSrc="/images/belt.png"
                  altText="Triple Crown Championship Belt"
                  badgeText="TROPHY ROOM"
                  title="GOLDEN BELTS"
                  subtitle="6X CERTIFIED CHAMP"
                  accentColor="var(--cyan)"
                  stats={[
                    { label: 'TITLES', val: '6 Belts' },
                    { label: 'TIER', val: 'Diamond' },
                    { label: 'REIGN', val: 'Active' },
                  ]}
                />
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
                  justifyContent: 'space-between',
                  paddingLeft: '120px',
                  paddingRight: '60px',
                  gap: '40px',
                }}
              >
                <div style={{ maxWidth: '620px', width: '100%', flex: 1 }}>
                  <div style={{ marginBottom: '40px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--red-accent)', letterSpacing: '0.3em' }}>LOCKER ROOM</span>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>BACKSTAGE</h2>
                  </div>
                  <div style={{ width: '100%' }}>
                    <TimelineLocker />
                  </div>
                </div>

                {/* Right-side Locker Room War Room Photo */}
                <SectionFighterPoster
                  imageSrc="/images/locker_room.png"
                  altText="Backstage Training Ground"
                  badgeText="WAR ROOM"
                  title="LOCKER ROOM"
                  subtitle="TRAINING ARSENAL"
                  accentColor="var(--red-accent)"
                  stats={[
                    { label: 'STACK', val: 'MERN/TS' },
                    { label: 'EXPERIENCE', val: 'Production' },
                    { label: 'FOCUS', val: 'Full Stack' },
                  ]}
                />
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
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '60px',
                  padding: '80px 3rem',
                }}
              >
                <div style={{ textAlign: 'center', maxWidth: '480px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.3em' }}>FINAL PROMO</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--gold)' }}>READY FOR THE NEXT MATCH?</h2>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', margin: '16px auto 32px', fontSize: '0.95rem' }}>
                    The arena is open. The ring is set. Let&apos;s build something legendary together.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                      { label: '✉️ EMAIL', href: 'mailto:solankiut07@gmail.com', color: 'var(--gold)', external: false },
                      { label: '💼 LINKEDIN', href: 'https://www.linkedin.com/in/utkarsh-solanki-424b55291/', color: 'var(--cyan)', external: true },
                    ].map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        style={{
                          padding: '12px 24px',
                          border: `1px solid ${link.color}`,
                          color: link.color,
                          textDecoration: 'none',
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right-side Contact Contract Sign Poster */}
                <SectionFighterPoster
                  imageSrc="/images/avatar.png"
                  altText="Main Event Contract Signing"
                  badgeText="SIGN CONTRACT"
                  title="MAIN EVENT DEAL"
                  subtitle="UTKARSH SOLANKI"
                  accentColor="var(--gold)"
                  stats={[
                    { label: 'STATUS', val: 'Available' },
                    { label: 'OFFER', val: 'Open' },
                    { label: 'MATCH', val: 'Book Now' },
                  ]}
                />
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

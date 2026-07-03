'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Howl, Howler } from 'howler'
import { usePortfolioStore } from '@/lib/store'

interface AudioConfig {
  src: string[]
  loop?: boolean
  volume?: number
}

// Audio configs — Howl instances are created lazily on first play
const AUDIO_CONFIGS: Record<string, AudioConfig> = {
  theme: {
    src: ['/audio/entrance-theme.mp3'],
    loop: true,
    volume: 0.5,
  },
  bgm1: {
    src: ['/audio/bgm1.mp3'],
    loop: false,
    volume: 0.5,
  },
  bgm2: {
    src: ['/audio/bgm2.mp3'],
    loop: false,
    volume: 0.5,
  },
  pyro: {
    src: ['/audio/alex_jauk-echoing-explosion-196259.mp3'],
    volume: 0.7,
  },
  crowd: {
    src: ['/audio/crowd-ambience.mp3'],
    loop: true,
    volume: 0.2,
  },
}

export function useArenaAudio(onTrackChange?: (track: 'theme' | 'bgm1' | 'bgm2') => void) {
  const isMuted = usePortfolioStore(s => s.isMuted)
  const isLoading = usePortfolioStore(s => s.isLoading)
  const hasSeenPromo = usePortfolioStore(s => s.hasSeenPromo)
  const sounds = useRef<Record<string, Howl>>({})
  const activeTrackRef = useRef<'theme' | 'bgm1' | 'bgm2' | null>(null)

  const onTrackChangeRef = useRef(onTrackChange)
  useEffect(() => {
    onTrackChangeRef.current = onTrackChange
  }, [onTrackChange])

  // Lazily get or create a Howl instance
  const getSound = useCallback((key: string): Howl | null => {
    if (sounds.current[key]) return sounds.current[key]

    const config = AUDIO_CONFIGS[key]
    if (!config) return null

    const howl = new Howl({
      ...config,
      onloaderror: (_id: number, err: unknown) =>
        console.warn(`[ArenaAudio] ${key} load error:`, err),
      onplayerror: (_id: number, err: unknown) => {
        console.warn(`[ArenaAudio] ${key} play error:`, err)
        // Attempt to recover by unlocking audio context
        Howler.unload()
      },
    })

    sounds.current[key] = howl
    return howl
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(sounds.current).forEach((s) => s.unload())
      sounds.current = {}
    }
  }, [])

  // Sync mute state globally with Howler
  useEffect(() => {
    Howler.mute(isMuted)
  }, [isMuted])

  // Centralized helper to play a music track and stop all others
  const playTrack = useCallback((key: 'theme' | 'bgm1' | 'bgm2') => {
    const musicTracks: ('theme' | 'bgm1' | 'bgm2')[] = ['theme', 'bgm1', 'bgm2']
    
    // Stop all other music tracks unconditionally
    musicTracks.forEach((trackKey) => {
      if (trackKey !== key) {
        const sound = sounds.current[trackKey]
        if (sound) {
          sound.stop()
        }
      }
    })

    const prevTrack = activeTrackRef.current
    activeTrackRef.current = key
    
    // Play the target track if it's not already playing
    const targetSound = getSound(key)
    if (targetSound && !targetSound.playing()) {
      targetSound.play()
    }

    if (prevTrack !== key && onTrackChangeRef.current) {
      onTrackChangeRef.current(key)
    }
  }, [getSound])

  // Central theme/BGM management
  useEffect(() => {
    if (isLoading) return // Do nothing while loading screen is active

    if (!hasSeenPromo) {
      // Intro promo is active -> play entrance theme
      playTrack('theme')
    } else {
      // Promo finished -> stop entrance theme, start alternating BGMs
      const bgm1 = getSound('bgm1')
      const bgm2 = getSound('bgm2')
      if (!bgm1 || !bgm2) return

      // Clear previous 'end' listeners to avoid duplicates
      bgm1.off('end')
      bgm2.off('end')

      bgm1.on('end', () => {
        playTrack('bgm2')
      })

      bgm2.on('end', () => {
        playTrack('bgm1')
      })

      // Start the loop with bgm1 if we just transitioned from theme or have no active track
      if (activeTrackRef.current === 'theme' || !activeTrackRef.current) {
        playTrack('bgm1')
      } else {
        // Ensure the active BGM track is playing if it should be
        const currentKey = activeTrackRef.current
        const activeSound = sounds.current[currentKey]
        if (activeSound && !activeSound.playing() && !isMuted) {
          activeSound.play()
        }
      }
    }
  }, [isLoading, hasSeenPromo, playTrack, getSound, isMuted])

  // Pause / Resume tracks when muting / unmuting, just in case browser autoplay policies complain on background tabs
  useEffect(() => {
    if (!activeTrackRef.current) return

    const sound = sounds.current[activeTrackRef.current]
    if (!sound) return

    if (!isMuted && !isLoading) {
      if (!sound.playing()) {
        sound.play()
      }
    } else if (isMuted && sound.playing()) {
      sound.pause()
    }
  }, [isMuted, isLoading])


  const playSound = useCallback((key: string) => {
    if (key === 'theme' || key === 'bgm1' || key === 'bgm2') {
      playTrack(key)
    } else {
      const sound = getSound(key)
      if (sound && !sound.playing()) {
        sound.play()
      }
    }
  }, [getSound, playTrack])

  const stopSound = useCallback((key: string) => {
    const sound = sounds.current[key]
    if (sound) {
      sound.stop()
    }
  }, [])

  const nextTrack = useCallback(() => {
    if (!hasSeenPromo) return // Don't skip entrance theme

    const currentKey = activeTrackRef.current
    if (currentKey === 'bgm1' || currentKey === 'bgm2') {
      const nextKey = currentKey === 'bgm1' ? 'bgm2' : 'bgm1'
      playTrack(nextKey)
    }
  }, [hasSeenPromo, playTrack])

  return {
    playSound,
    stopSound,
    nextTrack,
  }
}


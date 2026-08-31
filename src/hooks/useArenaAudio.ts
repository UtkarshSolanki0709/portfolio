'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Howl, Howler } from 'howler'
import { usePortfolioStore } from '@/lib/store'

export type MusicTrackKey = 'theme' | 'bgm1' | 'bgm2'

export const TRACK_METADATA: Record<MusicTrackKey, { title: string; genre: string }> = {
  theme: {
    title: 'Entrance Theme · Main Event',
    genre: 'Industrial Metal',
  },
  bgm1: {
    title: 'Match Card · Undisputed BGM 1',
    genre: 'Hard Rock',
  },
  bgm2: {
    title: 'Championship Belt · Main Event BGM 2',
    genre: 'Arena Anthem',
  },
}

interface AudioConfig {
  src: string[]
  loop?: boolean
  volume?: number
}

const AUDIO_CONFIGS: Record<string, AudioConfig> = {
  theme: {
    src: ['/audio/entrance-theme.mp3'],
    loop: false,
    volume: 0.5,
  },
  bgm1: {
    src: ['/audio/bgm1.mp3'],
    loop: false,
    volume: 0.45,
  },
  bgm2: {
    src: ['/audio/bgm2.mp3'],
    loop: false,
    volume: 0.45,
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

export function useArenaAudio(
  onTrackChange?: (track: MusicTrackKey, title: string) => void
) {
  const isMuted = usePortfolioStore((s) => s.isMuted)
  const isLoading = usePortfolioStore((s) => s.isLoading)
  const hasSeenPromo = usePortfolioStore((s) => s.hasSeenPromo)
  const sounds = useRef<Record<string, Howl>>({})
  const activeTrackRef = useRef<MusicTrackKey | null>(null)
  const playTrackRef = useRef<(key: MusicTrackKey) => void>(() => {})

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

  // Central helper to play a music track and auto-chain next track on finish
  const playTrack = useCallback(
    (key: MusicTrackKey) => {
      const musicTracks: MusicTrackKey[] = ['theme', 'bgm1', 'bgm2']

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

      const targetSound = getSound(key)
      if (targetSound) {
        // Remove existing end handler to avoid duplicate callbacks
        targetSound.off('end')

        // When track finishes naturally, alternate between bgm1 and bgm2 in the background
        targetSound.on('end', () => {
          if (key === 'theme' || key === 'bgm2') {
            playTrackRef.current('bgm1')
          } else {
            playTrackRef.current('bgm2')
          }
        })

        if (!targetSound.playing()) {
          targetSound.play()
        }
      }

      if (prevTrack !== key && onTrackChangeRef.current) {
        onTrackChangeRef.current(key, TRACK_METADATA[key]?.title || key)
      }
    },
    [getSound]
  )

  useEffect(() => {
    playTrackRef.current = playTrack
  }, [playTrack])

  // Central lifecycle:
  // 1. Loading screen active -> no audio
  // 2. User enters arena, promo playing (!hasSeenPromo) -> play entrance theme
  // 3. Promo ends (hasSeenPromo) -> switch immediately to bgm1, alternating with bgm2 in background
  useEffect(() => {
    if (isLoading) return

    if (!hasSeenPromo) {
      if (activeTrackRef.current !== 'theme') {
        playTrack('theme')
      }
    } else {
      // If we just finished the promo (or have no background track yet), start bgm1
      if (activeTrackRef.current === 'theme' || !activeTrackRef.current) {
        playTrack('bgm1')
      }
    }
  }, [isLoading, hasSeenPromo, playTrack])

  // Pause / Resume tracks when muting / unmuting
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

  // Play sound effect (pyro, crowd, etc.) or specific music track
  const playSound = useCallback(
    (key: string) => {
      if (key === 'theme' || key === 'bgm1' || key === 'bgm2') {
        playTrack(key as MusicTrackKey)
      } else {
        const sound = getSound(key)
        if (sound && !sound.playing()) {
          sound.play()
        }
      }
    },
    [getSound, playTrack]
  )

  const stopSound = useCallback((key: string) => {
    const sound = sounds.current[key]
    if (sound) {
      sound.stop()
    }
  }, [])

  // Manual next track (switches between bgm1 <-> bgm2)
  const nextTrack = useCallback(() => {
    const currentKey = activeTrackRef.current
    const nextKey: MusicTrackKey = currentKey === 'bgm1' ? 'bgm2' : 'bgm1'
    playTrack(nextKey)
    return nextKey
  }, [playTrack])

  return {
    playSound,
    stopSound,
    nextTrack,
  }
}

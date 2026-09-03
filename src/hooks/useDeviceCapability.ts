'use client'

import { useState, useEffect, useCallback } from 'react'

export interface DeviceCapability {
  isMobile: boolean
  isLowGPU: boolean
  shouldUse3D: boolean
  pixelRatio: number
}

function getCapability(): DeviceCapability {
  if (typeof window === 'undefined') {
    return { isMobile: false, isLowGPU: false, shouldUse3D: true, pixelRatio: 1 }
  }

  const isMobile = window.innerWidth < 768
  const pixelRatio = window.devicePixelRatio || 1
  const isLowGPU = !('gpu' in navigator) && pixelRatio < 2

  let hasWebGL = false
  try {
    const canvas = document.createElement('canvas')
    hasWebGL = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    hasWebGL = false
  }

  const shouldUse3D = !isMobile && !isLowGPU && hasWebGL
  return { isMobile, isLowGPU, shouldUse3D, pixelRatio }
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(getCapability)

  const handleResize = useCallback(() => {
    setCapability((prev) => ({
      ...prev,
      isMobile: window.innerWidth < 768,
    }))
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return capability
}

/**
 * PRD §6: mobile vs desktop is decided ONCE at first client load.
 * Resize/orientation never switches experiences mid-session.
 */
export function getInitialViewportIsMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

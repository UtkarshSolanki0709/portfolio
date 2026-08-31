'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

interface SceneWrapperProps {
  children: React.ReactNode
}

function SceneLoaderFallback() {
  return (
    <mesh position={[0, 2, 0]}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#d4af37" wireframe />
    </mesh>
  )
}

export default function SceneWrapper({ children }: SceneWrapperProps) {
  // Start with on-demand rendering, switch to continuous after first paint
  const [frameloop, setFrameloop] = useState<'demand' | 'always'>('demand')

  useEffect(() => {
    // After first frame paints, switch to continuous rendering
    const raf = requestAnimationFrame(() => {
      setFrameloop('always')
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        frameloop={frameloop}
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{
          fov: 45,
          near: 1,
          far: 200,
          position: [0, 8, 25],
        }}
        style={{ pointerEvents: 'auto', background: '#0a0a0f' }}
      >
        <Suspense fallback={<SceneLoaderFallback />}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}

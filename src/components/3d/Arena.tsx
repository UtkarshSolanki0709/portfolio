'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import WrestlingRing from './WrestlingRing'
import SpotlightRig from './SpotlightRig'
import CrowdSilhouettes from './CrowdSilhouettes'
import Titantron from './Titantron'
import EntrancePortal from './EntrancePortal'
import Pyro from './Pyro'
import Wrestler from './Wrestler'
import { useReducedMotionEffect } from '@/hooks/useReducedMotion'

interface ArenaProps {
  pyroActive?: boolean
  activeSection?: number
}

interface Waypoint {
  position: THREE.Vector3
  target: THREE.Vector3
}

export default function Arena({ pyroActive = false, activeSection = 0 }: ArenaProps) {
  // Waypoints for camera pathing
  const waypoints = useMemo<Waypoint[]>(() => [
    // 0: Entrance - Epic wide shot
    {
      position: new THREE.Vector3(0, 10, 25),
      target: new THREE.Vector3(0, 2, 0),
    },
    // 1: Match Card - Close on ring center
    {
      position: new THREE.Vector3(8, 4, 12),
      target: new THREE.Vector3(0, 1, 0),
    },
    // 2: Championships - Side angle of ring
    {
      position: new THREE.Vector3(-12, 3, 5),
      target: new THREE.Vector3(0, 1, 0),
    },
    // 3: Backstage - Moving into the ramp
    {
      position: new THREE.Vector3(0, 2, -10),
      target: new THREE.Vector3(0, 1.5, -20),
    },
    // 4: Contact - Low angle, looking up at Titantron
    {
      position: new THREE.Vector3(0, 1.5, -16),
      target: new THREE.Vector3(0, 8, -25),
    },
  ], [])

  const currentTarget = useRef(new THREE.Vector3())

  // Reduced motion: cut the camera instead of lerping, no idle drift
  const reducedRef = useRef(false)
  useReducedMotionEffect((reduced) => {
    reducedRef.current = reduced
  })

  // Camera interpolation and auto-drift
  useFrame(({ camera, clock }, delta) => {
    const t = clock.getElapsedTime()
    const wp = waypoints[activeSection] || waypoints[0]

    // Frame-rate independent lerp using exponential decay (speed factor 4.5 for responsive feel)
    const lerpFactor = reducedRef.current ? 1 : 1 - Math.exp(-4.5 * delta)
    camera.position.lerp(wp.position, lerpFactor)

    // Smoothly lerp camera target
    currentTarget.current.lerp(wp.target, lerpFactor)
    camera.lookAt(currentTarget.current)

    // Add subtle floating "float" drift
    if (!reducedRef.current) {
      camera.position.x += Math.sin(t * 0.5) * 0.002
      camera.position.y += Math.cos(t * 0.7) * 0.002
    }
  })

  return (
    <>
      {/* Ambient light - very low */}
      <ambientLight intensity={0.15} color="#1a1a2e" />

      {/* Hemisphere light for subtle fill */}
      <hemisphereLight
        color="#1a1a3e"
        groundColor="#0a0a0f"
        intensity={0.3}
      />

      {/* Arena floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#0d0d14"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Entrance ramp — glossy so it reads as reflective under the spotlights */}
      <mesh position={[0, -0.3, -12]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[4, 0.15, 12]} />
        <meshStandardMaterial
          color="#101018"
          roughness={0.35}
          metalness={0.25}
        />
      </mesh>

      {/* Arena walls (backdrop) */}
      <mesh position={[0, 10, -30]}>
        <planeGeometry args={[80, 25]} />
        <meshStandardMaterial
          color="#08080e"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Side walls */}
      {[-35, 35].map((x) => (
        <mesh key={x} position={[x, 10, 0]} rotation={[0, x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
          <planeGeometry args={[60, 25]} />
          <meshStandardMaterial
            color="#08080e"
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}

       {/* Wrestling Ring */}
       <WrestlingRing />

       {/* Wrestler on the ramp */}
       <Wrestler 
         scale={1.18} 
         activeSection={activeSection}
       />

       {/* Spotlight Rig */}
       <SpotlightRig />

      {/* Titantron */}
      <Titantron />

      {/* Entrance portal — doorway, stage frame, runway strobes, floor branding */}
      <EntrancePortal />

      {/* Crowd — tiered stadium silhouettes around the ring */}
      <CrowdSilhouettes />

      {/* Pyro — fires from ring posts */}
      <Pyro active={pyroActive} position={[-5, 2, -5]} color="#d4af37" />
      <Pyro active={pyroActive} position={[5, 2, -5]} color="#ff1744" />
      <Pyro active={pyroActive} position={[-5, 2, 5]} color="#00e5ff" />
      <Pyro active={pyroActive} position={[5, 2, 5]} color="#d4af37" />

      {/* Pyro — entrance stage bursts flanking the portal */}
      <Pyro active={pyroActive} position={[-3.4, 1.2, -16.6]} color="#d4af37" />
      <Pyro active={pyroActive} position={[3.4, 1.2, -16.6]} color="#00e5ff" />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0f', 30, 70]} />
    </>
  )
}

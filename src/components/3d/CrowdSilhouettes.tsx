'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Crowd configuration
const TIERS = [
  { radius: 14, count: 60, yBase: 0.5,  rowHeight: 0,   color: '#9a8899' },   // Floor level
  { radius: 18, count: 80, yBase: 2.5,  rowHeight: 1.5, color: '#7a6878' },   // Lower bowl
  { radius: 23, count: 100, yBase: 5.0, rowHeight: 3.0, color: '#5a4858' },   // Upper bowl
]

// Two gaps: one for entrance (North), one for camera-side (South)
const northGapStart = 1.1 * Math.PI
const northGapEnd = 1.9 * Math.PI
const southGapStart = 0.4 * Math.PI   // adjust to camera FOV
const southGapEnd = 0.6 * Math.PI

const arc1 = [southGapEnd, northGapStart]        // West side arc
const arc2 = [northGapEnd, southGapStart + 2 * Math.PI] // East side arc

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// Generate crowd positions in rings AROUND the wrestling ring
function generateTierPositions() {
  const allPositions: { x: number; y: number; z: number; scale: number; phase: number; color: string }[] = []

  TIERS.forEach((tier, tierIndex) => {
    for (let i = 0; i < tier.count; i++) {
      const seed = tierIndex * 1000 + i
      
      const useArc1 = i % 2 === 0
      const [start, end] = useArc1 ? arc1 : arc2
      const angle = start + seededRandom(seed) * (end - start)
      
      const radiusJitter = tier.radius + (seededRandom(seed + 1) - 0.5) * 3
      const x = Math.cos(angle) * radiusJitter
      const z = Math.sin(angle) * radiusJitter
      
      const y = tier.yBase + seededRandom(seed + 2) * tier.rowHeight
      const scale = 0.7 + seededRandom(seed + 3) * 0.4
      const phase = seededRandom(seed + 4) * Math.PI * 2

      allPositions.push({ x, y, z, scale, phase, color: tier.color })
    }
  })

  return allPositions
}

const POSITIONS = generateTierPositions()
const TOTAL_COUNT = POSITIONS.length

export default function CrowdSilhouettes() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useRef(new THREE.Object3D())

  useEffect(() => {
    if (!meshRef.current) return
    const color = new THREE.Color()
    POSITIONS.forEach((p, i) => {
      dummy.current.position.set(p.x, p.y, p.z)
      dummy.current.scale.set(p.scale * 0.35, p.scale, p.scale * 0.2)
      dummy.current.rotation.set(0, -Math.atan2(p.x, p.z), 0) // Face the ring
      dummy.current.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.current.matrix)

      color.set(p.color)
      meshRef.current!.setColorAt(i, color)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [])

  // Animate crowd bobbing collectively for extreme performance (reduces CPU matrix calculations from 240/frame to 1)
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.position.y = Math.sin(t * 1.5) * 0.05
  })

  return (
    <>
      {/* Main instanced crowd silhouettes */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, TOTAL_COUNT]}
        frustumCulled={false}
        castShadow={false}
        receiveShadow={false}
      >
        {/* Slightly stylised box shape - more visible than capsule on dark bg */}
        <boxGeometry args={[1, 1, 0.5]} />
        <meshStandardMaterial
          roughness={0.9}
          metalness={0}
          emissive="#3a2a38"
          emissiveIntensity={0.4}
        />
      </instancedMesh>

      {/* Crowd cheering flash lights — reduced to 4 for performance */}
      {Array.from({ length: 4 }).map((_, i) => {
        const useArc1 = i % 2 === 0
        const [start, end] = useArc1 ? arc1 : arc2
        const t = (i < 2 ? i : i - 2) * 0.5 + 0.25
        const angle = start + t * (end - start)
        const r = 15 + Math.sin(i * 7.3) * 3
        return (
          <pointLight
            key={`crowd-light-${i}`}
            position={[Math.cos(angle) * r, 2.5, Math.sin(angle) * r]}
            intensity={4}
            distance={20}
            decay={2}
            color={i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#ff1744' : '#00e5ff'}
          />
        )
      })}
    </>
  )
}

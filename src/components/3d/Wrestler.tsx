'use client'

import { useRef, useMemo, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import gsap from 'gsap'

interface WrestlerProps {
  scale?: number
  rotation?: [number, number, number]
  position?: [number, number, number]
  activeSection?: number
}

function DevilJinModel({
  scale = 1.18,
  activeSection = 0,
}: {
  scale?: number
  activeSection?: number
}) {
  const meshRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/devil_jin.glb')

  // Clone scene with SkeletonUtils for proper SkinnedMesh bone binding
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = Math.min(Math.max(mat.roughness, 0.25), 0.85)
              mat.metalness = Math.min(Math.max(mat.metalness, 0.1), 0.7)
              mat.envMapIntensity = 1.5
            }
          })
        }
      }
    })

    return clone
  }, [scene])

  // GSAP Choreography: Dynamic Poses & Ring Positions per Scene
  useEffect(() => {
    if (!meshRef.current) return

    // Query 3D bone nodes directly from scene graph in effect
    const lShoulder = meshRef.current.getObjectByName('Arm left shoulder 2_069')
    const rShoulder = meshRef.current.getObjectByName('Arm right shoulder 2_0105')
    const lElbow = meshRef.current.getObjectByName('Arm left elbow_070')
    const rElbow = meshRef.current.getObjectByName('Arm right elbow_0106')
    const lWingBase = meshRef.current.getObjectByName('Wing left base_0178')
    const rWingBase = meshRef.current.getObjectByName('Wing right base_0185')
    const lThigh = meshRef.current.getObjectByName('Leg left thigh_0195')
    const rThigh = meshRef.current.getObjectByName('Leg right thigh_0212')
    const spine = meshRef.current.getObjectByName('Spine lower_07')
    const head = meshRef.current.getObjectByName('Head neck lower_09')

    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power2.inOut' } })

    if (activeSection === 0) {
      // ════════ BASE PAGE: POWERHOUSE ENTRANCE WARRIOR STANCE ════════
      tl.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'power2.out' }, 0)
      tl.to(meshRef.current.position, { x: 0, y: 0.35, z: 0 }, 0)
      tl.to(meshRef.current.rotation, { y: 0 }, 0)

      if (lShoulder) tl.to(lShoulder.rotation, { x: 0.2, y: 0.1, z: -1.05 }, 0)
      if (rShoulder) tl.to(rShoulder.rotation, { x: 0.2, y: -0.1, z: 1.05 }, 0)
      if (lElbow) tl.to(lElbow.rotation, { x: -0.25, y: 0.55, z: 0 }, 0)
      if (rElbow) tl.to(rElbow.rotation, { x: -0.25, y: -0.55, z: 0 }, 0)
      if (lWingBase) tl.to(lWingBase.rotation, { x: 0.1, y: 0.45, z: 0.2 }, 0)
      if (rWingBase) tl.to(rWingBase.rotation, { x: 0.1, y: -0.45, z: -0.2 }, 0)
      if (lThigh) tl.to(lThigh.rotation, { x: 0, y: 0, z: -0.1 }, 0)
      if (rThigh) tl.to(rThigh.rotation, { x: 0, y: 0, z: 0.1 }, 0)
      if (spine) tl.to(spine.rotation, { x: -0.05, y: 0, z: 0 }, 0)
      if (head) tl.to(head.rotation, { x: 0.05, y: 0, z: 0 }, 0)
    } else {
      // Smoothly hide 3D model when navigating away to other sections
      tl.to(meshRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.4, ease: 'power2.in' }, 0)
    }
  }, [activeSection])

  // Continuous subtle idle breathing & wing dynamics (only when activeSection === 0)
  useFrame(({ clock }) => {
    if (!meshRef.current || activeSection !== 0) return
    const elapsed = clock.getElapsedTime()

    const lWing = meshRef.current.getObjectByName('Wing left 1_0179')
    const rWing = meshRef.current.getObjectByName('Wing right 1_0186')

    const breath = Math.sin(elapsed * 1.6) * 0.001
    if (lWing) lWing.rotation.y += breath
    if (rWing) rWing.rotation.y -= breath

    // Subtle floating presence
    meshRef.current.position.y += Math.sin(elapsed * 2.0) * 0.0012
  })

  return (
    <group ref={meshRef} position={[0, 0.35, 0]}>
      {/* Key spotlight on Devil Jin */}
      <spotLight
        position={[0, 9, 5]}
        intensity={95}
        color="#fff8f0"
        distance={30}
        angle={Math.PI / 4}
        penumbra={0.7}
      />
      {/* Rim light (crimson demonic back aura) */}
      <pointLight position={[0, 3.5, -3.5]} intensity={55} color="#ff1744" distance={18} />
      {/* Front warm fill */}
      <pointLight position={[0, 2.5, 3.5]} intensity={45} color="#ffd700" distance={15} />

      {/* Model offset so feet rest cleanly on the canvas floor */}
      <primitive object={clonedScene} position={[0, 1.0, 0]} scale={[scale, scale, scale]} />
    </group>
  )
}

function WrestlerFallback() {
  return (
    <group position={[0, 0.35, 0]}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#111118" roughness={0.8} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

export default function Wrestler({ scale = 1.18, activeSection = 0 }: WrestlerProps) {
  return (
    <Suspense fallback={<WrestlerFallback />}>
      <DevilJinModel scale={scale} activeSection={activeSection} />
    </Suspense>
  )
}

// Preload the GLB model in background
useGLTF.preload('/models/devil_jin.glb')
'use client'

import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { usePortfolioStore } from '@/lib/store'
import { useReducedMotionEffect } from '@/hooks/useReducedMotion'

// Runway strobes: one row per ramp edge, cascading portal -> viewer on hover
const RUNWAY_NODES = 9
const RUNWAY_Z_START = -16.8
const RUNWAY_Z_END = -7.2
const PULSE_DURATION = 1.1

// The ramp in Arena.tsx is tilted -0.05 rad about X, centered at z = -12;
// this gives the top-surface height at any z so fixtures sit flush, not floating
const RAMP_SURFACE_Y = (z: number) => -0.225 + 0.0499 * (z + 12)
const RAMP_TILT_ROT: [number, number, number] = [-Math.PI / 2 - 0.05, 0, 0]

const BEBAS_FONT =
  'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.ttf'

// Radial glow whose alpha reaches exactly zero at the texture edge, so additive
// planes blend into the scene instead of showing a hard sprite boundary
function makeGlowTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(size, size)
  const d = img.data
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = ((x + 0.5) / size) * 2 - 1
      const ny = ((y + 0.5) / size) * 2 - 1
      const r = Math.min(1, Math.hypot(nx, ny))
      const alpha = Math.pow(1 - r, 2.4)
      const whiteness = Math.pow(1 - r, 1.6)
      const i = (y * size + x) * 4
      d[i] = Math.round(255 * whiteness)
      d[i + 1] = Math.round(229 + 26 * whiteness)
      d[i + 2] = 255
      d[i + 3] = Math.round(255 * alpha)
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Linear spill for the light pool on the floor: bright at the portal edge,
// fading toward the viewer and out to the sides
function makeSpillTexture(): THREE.CanvasTexture {
  const w = 128
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(w, h)
  const d = img.data
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = ((x + 0.5) / w) * 2 - 1
      // y = 0 is the top of the image, which maps to the portal side after the
      // floor rotation (texture v=1 points toward the titantron)
      const towardPortal = 1 - (y + 0.5) / h
      const alpha = Math.pow(towardPortal, 1.8) * Math.pow(1 - Math.abs(u), 2)
      const whiteness = Math.pow(towardPortal, 2)
      const i = (y * w + x) * 4
      d[i] = Math.round(255 * whiteness)
      d[i + 1] = Math.round(229 + 26 * whiteness)
      d[i + 2] = 255
      d[i + 3] = Math.round(255 * alpha)
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function EntrancePortal() {
  const reducedRef = useRef(false)
  useReducedMotionEffect((reduced) => {
    reducedRef.current = reduced
  })

  const glowTexture = useMemo(() => makeGlowTexture(), [])
  const spillTexture = useMemo(() => makeSpillTexture(), [])

  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const mouthMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const spillMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const trimMats = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  const runwayMats = useRef<(THREE.MeshStandardMaterial | null)[]>([])

  const hoverProgress = useRef(0)
  const pulseLevel = useRef(0)
  const lastPulseAt = useRef(0)

  useFrame(({ clock }, delta) => {
    const { portalHovered, portalPulseAt } = usePortfolioStore.getState()
    const t = clock.getElapsedTime()

    // One-shot detection of a new enter pulse, then decay back to zero
    if (portalPulseAt > lastPulseAt.current) {
      lastPulseAt.current = portalPulseAt
      pulseLevel.current = 1
    }
    pulseLevel.current = Math.max(0, pulseLevel.current - delta / PULSE_DURATION)

    hoverProgress.current = THREE.MathUtils.damp(
      hoverProgress.current,
      portalHovered ? 1 : 0,
      6,
      delta
    )

    const hover = hoverProgress.current
    const pulse = reducedRef.current ? pulseLevel.current * 0.3 : pulseLevel.current
    const breath = reducedRef.current ? 0.5 : Math.sin(t * 1.2) * 0.5 + 0.5

    if (coreMatRef.current) {
      coreMatRef.current.opacity = Math.min(
        1,
        0.75 + breath * 0.08 + hover * 0.2 + pulse * 0.25
      )
    }
    if (mouthMatRef.current) {
      mouthMatRef.current.opacity = 0.1 + breath * 0.03 + hover * 0.22 + pulse * 0.3
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity = 0.22 + breath * 0.05 + hover * 0.28 + pulse * 0.4
    }
    if (spillMatRef.current) {
      spillMatRef.current.opacity = 0.16 + breath * 0.03 + hover * 0.2 + pulse * 0.3
    }
    if (lightRef.current) {
      lightRef.current.intensity = 12 + breath * 2.5 + hover * 26 + pulse * 60
    }
    for (const mat of trimMats.current) {
      if (mat) mat.emissiveIntensity = 0.55 + hover * 1.05 + pulse * 1.8
    }

    // Cascade: nodes light from the portal (index 0) toward the viewer
    for (let i = 0; i < runwayMats.current.length; i++) {
      const mat = runwayMats.current[i]
      if (!mat) continue
      const idx = i % RUNWAY_NODES
      const lit = THREE.MathUtils.clamp(hover * (RUNWAY_NODES + 2) - idx, 0, 1)
      mat.emissiveIntensity = 0.28 + lit * 1.9 + pulse * 2.4
    }
  })

  return (
    <group>
      {/* Shifted down so the doorway sill meets the sloped ramp surface
          (ramp top is ~-0.49 at the portal end) and the pillars meet
          the titantron's lower edge at y≈5.2 */}
      <group position={[0, -0.5, 0]}>
        {/* ── Entrance doorway ── */}
        <group position={[0, 0, -17.2]}>
          {/* Tunnel interior: receding darkness so the glow reads as
              light at the end of a corridor, not a decal on a flat wall */}
          <group>
            <mesh position={[-1.675, 2.2, -1.7]}>
              <boxGeometry args={[0.15, 4.6, 3.4]} />
              <meshStandardMaterial color="#05060a" roughness={1} metalness={0} />
            </mesh>
            <mesh position={[1.675, 2.2, -1.7]}>
              <boxGeometry args={[0.15, 4.6, 3.4]} />
              <meshStandardMaterial color="#05060a" roughness={1} metalness={0} />
            </mesh>
            <mesh position={[0, 4.42, -1.7]}>
              <boxGeometry args={[3.5, 0.15, 3.4]} />
              <meshStandardMaterial color="#05060a" roughness={1} metalness={0} />
            </mesh>
            <mesh position={[0, 0, -1.7]}>
              <boxGeometry args={[3.5, 0.15, 3.4]} />
              <meshStandardMaterial color="#05060a" roughness={1} metalness={0} />
            </mesh>
          </group>

          {/* Bright core at the back of the tunnel */}
          <mesh position={[0, 2.2, -3.3]}>
            <planeGeometry args={[2.7, 3.8]} />
            <meshBasicMaterial
              ref={coreMatRef}
              map={glowTexture}
              transparent
              opacity={0.75}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Hot white slit — the point the eye lands on */}
          <mesh position={[0, 2.0, -3.35]}>
            <planeGeometry args={[1.0, 2.4]} />
            <meshBasicMaterial color="#dff8ff" transparent opacity={0.9} />
          </mesh>

          {/* Soft veil of light flooding out of the mouth, sized exactly
              to the opening so the frame columns occlude its edges */}
          <mesh position={[0, 2.2, 0.03]}>
            <planeGeometry args={[3.2, 4.3]} />
            <meshBasicMaterial
              ref={mouthMatRef}
              map={glowTexture}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Wide dim halo behind the frame — spills around the doorway
              geometry (depth-tested) for a rim of light on the stage */}
          <mesh position={[0, 2.2, 0.1]}>
            <planeGeometry args={[9, 9]} />
            <meshBasicMaterial
              ref={haloMatRef}
              map={glowTexture}
              color="#9fefff"
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Frame columns */}
          {[-1.78, 1.78].map((x) => (
            <mesh key={x} position={[x, 2.25, 0.15]} castShadow>
              <boxGeometry args={[0.36, 4.9, 0.55]} />
              <meshStandardMaterial color="#14141c" roughness={0.35} metalness={0.75} />
            </mesh>
          ))}

          {/* Header beam */}
          <mesh position={[0, 4.75, 0.15]}>
            <boxGeometry args={[4.1, 0.36, 0.55]} />
            <meshStandardMaterial color="#14141c" roughness={0.35} metalness={0.75} />
          </mesh>

          {/* Sill */}
          <mesh position={[0, -0.1, 0.15]}>
            <boxGeometry args={[4.1, 0.3, 0.7]} />
            <meshStandardMaterial color="#101018" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Gold trim on inside edges of the opening */}
          {[-1.58, 1.58].map((x, i) => (
            <mesh key={`trim-v-${x}`} position={[x, 2.25, 0.44]}>
              <boxGeometry args={[0.06, 4.3, 0.06]} />
              <meshStandardMaterial
                ref={(m) => {
                  trimMats.current[i] = m
                }}
                color="#b8962e"
                emissive="#d4af37"
                emissiveIntensity={0.55}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
          ))}
          <mesh position={[0, 4.52, 0.44]}>
            <boxGeometry args={[3.2, 0.06, 0.06]} />
            <meshStandardMaterial
              ref={(m) => {
                trimMats.current[2] = m
              }}
              color="#b8962e"
              emissive="#d4af37"
              emissiveIntensity={0.55}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>

          {/* Portal key light — spills onto the runway */}
          <pointLight
            ref={lightRef}
            position={[0, 2.4, 0.6]}
            color="#7fdfff"
            intensity={14}
            distance={26}
            decay={2}
          />
        </group>

        {/* ── Stage frame: pillars rising to the titantron ── */}
        {[-3.4, 3.4].map((x) => (
          <group key={`pillar-${x}`}>
            <mesh position={[x, 2.5, -17.4]} castShadow>
              <boxGeometry args={[0.55, 6.2, 0.55]} />
              <meshStandardMaterial color="#0e0e16" roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Static gold inset line on the inner face */}
            <mesh position={[x - Math.sign(x) * 0.29, 2.5, -17.1]}>
              <boxGeometry args={[0.04, 5.6, 0.04]} />
              <meshStandardMaterial
                color="#d4af37"
                emissive="#d4af37"
                emissiveIntensity={0.5}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))}
        {/* Cross beam tucked under the titantron */}
        <mesh position={[0, 5.2, -17.4]}>
          <boxGeometry args={[7.6, 0.4, 0.5]} />
          <meshStandardMaterial color="#0e0e16" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* ── Light pool spilling from the portal down the runway ── */}
      <mesh
        position={[0, RAMP_SURFACE_Y(-14.15) + 0.02, -14.15]}
        rotation={RAMP_TILT_ROT}
      >
        <planeGeometry args={[3.6, 5.5]} />
        <meshBasicMaterial
          ref={spillMatRef}
          map={spillTexture}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Runway strobes along both ramp edges, flush with the slope ── */}
      {[-2.1, 2.1].map((x, side) =>
        Array.from({ length: RUNWAY_NODES }).map((_, i) => {
          const z =
            RUNWAY_Z_START +
            (i / (RUNWAY_NODES - 1)) * (RUNWAY_Z_END - RUNWAY_Z_START)
          const flat = side * RUNWAY_NODES + i
          return (
            <mesh key={`runway-${flat}`} position={[x, RAMP_SURFACE_Y(z) + 0.035, z]}>
              <boxGeometry args={[0.09, 0.06, 0.55]} />
              <meshStandardMaterial
                ref={(m) => {
                  runwayMats.current[flat] = m
                }}
                color="#8a7520"
                emissive="#f0d060"
                emissiveIntensity={0.28}
                metalness={0.4}
                roughness={0.4}
              />
            </mesh>
          )
        })
      )}

      {/* ── Floor branding on the runway, matched to the ramp tilt ── */}
      <Suspense fallback={null}>
        <Text
          position={[0, RAMP_SURFACE_Y(-12.5) + 0.015, -12.5]}
          rotation={RAMP_TILT_ROT}
          fontSize={0.75}
          maxWidth={3.6}
          font={BEBAS_FONT}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
        >
          UTKARSH SOLANKI
          <meshBasicMaterial color="#d4af37" transparent opacity={0.16} depthWrite={false} />
        </Text>
      </Suspense>
    </group>
  )
}

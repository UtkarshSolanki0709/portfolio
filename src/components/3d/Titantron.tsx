'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const IMAGE_PATHS = [
  '/images/titantron-1.png',
  '/images/titantron-2.png',
  '/images/titantron-3.png',
  '/images/titantron-4.png',
  '/images/titantron-5.png',
]

const TitantronMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uBlend: { value: 0 },
    uTexCurrent: { value: new THREE.Texture() },
    uTexNext: { value: new THREE.Texture() },
    uGlitch: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uBlend;
    uniform float uGlitch;
    uniform sampler2D uTexCurrent;
    uniform sampler2D uTexNext;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      if (uGlitch > 0.05) {
        float g = random(vec2(floor(uv.y * 10.0), uTime)) * uGlitch;
        uv.x += (random(vec2(uTime)) - 0.5) * g;
      }
      vec4 col1 = texture2D(uTexCurrent, uv);
      vec4 col2 = texture2D(uTexNext, uv);
      vec4 color = mix(col1, col2, uBlend);
      float scanline = sin(vUv.y * 600.0 + uTime * 2.0) * 0.04;
      color.rgb -= scanline;
      vec2 grid = fract(vUv * vec2(400.0, 150.0));
      float dot = smoothstep(0.4, 0.5, length(grid - 0.5));
      color.rgb *= 1.0 - dot * 0.2;
      float noise = (random(uv + uTime) - 0.5) * 0.05;
      color.rgb += noise;
      color.rgb *= 1.1;
      gl_FragColor = color;
    }
  `,
}

function loadTexture(loader: THREE.TextureLoader, path: string): Promise<THREE.Texture> {
  return new Promise<THREE.Texture>((resolve) => {
    loader.load(
      path,
      (tex) => {
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        resolve(tex)
      },
      undefined,
      () => {
        console.warn(`Failed to load: ${path}`)
        resolve(new THREE.Texture())
      }
    )
  })
}

function TitantronScreen() {
  const [loadedTextures, setLoadedTextures] = useState<THREE.Texture[]>([])
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const indices = useRef({ active: 0, next: 1 })
  const lastSwitchTime = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBlend: { value: 0 },
      uTexCurrent: { value: new THREE.Texture() },
      uTexNext: { value: new THREE.Texture() },
      uGlitch: { value: 0 },
    }),
    []
  )

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let cancelled = false

    const initialPaths = IMAGE_PATHS.slice(0, 2)
    Promise.all(initialPaths.map((p) => loadTexture(loader, p))).then((initial) => {
      if (cancelled) return
      setLoadedTextures(initial)

      const timer = setTimeout(() => {
        const remainingPaths = IMAGE_PATHS.slice(2)
        Promise.all(remainingPaths.map((p) => loadTexture(loader, p))).then((rest) => {
          if (cancelled) return
          setLoadedTextures((prev) => [...prev, ...rest])
        })
      }, 1500)

      if (!cancelled) {
        cleanupTimer = timer
      }
    })

    let cleanupTimer: NodeJS.Timeout | undefined
    return () => {
      cancelled = true
      if (cleanupTimer) clearTimeout(cleanupTimer)
    }
  }, [])

  useFrame(({ clock }) => {
    if (!materialRef.current || loadedTextures.length < 2) return
    const time = clock.getElapsedTime()
    const interval = 8.0
    const fadeDuration = 1.5
    const cycleTime = time % interval

    let blend = 0
    let glitch = 0

    if (cycleTime > interval - fadeDuration) {
      blend = (cycleTime - (interval - fadeDuration)) / fadeDuration
      glitch = Math.pow(blend, 3) * 0.15
    } else {
      if (time - lastSwitchTime.current >= interval) {
        indices.current.active = indices.current.next
        indices.current.next = (indices.current.next + 1) % loadedTextures.length
        lastSwitchTime.current = Math.floor(time / interval) * interval
      }
      blend = 0
      glitch = 0
    }

    const { uniforms } = materialRef.current
    uniforms.uTime.value = time
    uniforms.uBlend.value = THREE.MathUtils.smoothstep(blend, 0, 1)
    const { active, next } = indices.current
    uniforms.uTexCurrent.value = loadedTextures[active]
    uniforms.uTexNext.value = loadedTextures[next]
    uniforms.uGlitch.value = glitch
  })

  if (loadedTextures.length === 0) return <TitantronFallback />

  return (
    <mesh>
      <planeGeometry args={[14, 5]} />
      <shaderMaterial ref={materialRef} {...TitantronMaterial} uniforms={uniforms} />
    </mesh>
  )
}

function TitantronFallback() {
  return (
    <mesh>
      <planeGeometry args={[14, 5]} />
      <meshBasicMaterial color="#050508" />
    </mesh>
  )
}

function SideBannerMesh({ label, x, rotY }: { label: string; x: number; rotY: number }) {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return new THREE.Texture()
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1400
    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()

    // Gold metallic gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#ffe57f')
    grad.addColorStop(0.2, '#ffd700')
    grad.addColorStop(0.5, '#d4af37')
    grad.addColorStop(0.8, '#aa820a')
    grad.addColorStop(1, '#ffe57f')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dark inset border
    ctx.strokeStyle = '#0a0a10'
    ctx.lineWidth = 24
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48)

    // Inner gold pinstripe
    ctx.strokeStyle = '#fff0a0'
    ctx.lineWidth = 6
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

    // Stacked Vertical Lettering for perfect upright readability
    const letters = label.split('')
    const startY = 140
    const availableHeight = canvas.height - 280
    const stepY = availableHeight / (letters.length - 1)

    // Letter shadow and dark outline for crisp contrast
    ctx.shadowColor = 'rgba(0,0,0,0.9)'
    ctx.shadowBlur = 18
    ctx.shadowOffsetX = 5
    ctx.shadowOffsetY = 5

    ctx.font = '900 135px "Impact", "Arial Black", "Trebuchet MS", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Dark stroke outline behind white letters
    ctx.strokeStyle = '#05050a'
    ctx.lineWidth = 14
    letters.forEach((char, i) => {
      ctx.strokeText(char, canvas.width / 2, startY + i * stepY)
    })

    // Pure white letter fill
    ctx.fillStyle = '#ffffff'
    letters.forEach((char, i) => {
      ctx.fillText(char, canvas.width / 2, startY + i * stepY)
    })

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    return tex
  }, [label])

  return (
    <group position={[x, -1, 1.8]} rotation={[0, rotY, 0]}>
      {/* Outer frame */}
      <mesh castShadow>
        <boxGeometry args={[3.4, 8.8, 0.2]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Main branded face with CanvasTexture */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[3.2, 8.6]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.3}
          metalness={0.4}
          emissive="#ffd700"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Edge highlight lighting */}
      <pointLight position={[0, 0, 1.5]} intensity={25} color="#ffd700" distance={8} />
    </group>
  )
}

export default function Titantron() {
  return (
    <group position={[0, 8, -18]}>
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[14.6, 5.6, 0.4]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.8} />
      </mesh>

      <TitantronScreen />

      {/* Edge glow strips */}
      {[
        { pos: [0, 2.6, 0.05] as [number, number, number], scale: [14.2, 0.08, 1] as [number, number, number] },
        { pos: [0, -2.6, 0.05] as [number, number, number], scale: [14.2, 0.08, 1] as [number, number, number] },
      ].map(({ pos, scale }, i) => (
        <mesh key={i} position={pos}>
          <planeGeometry args={[scale[0], scale[1]]} />
          <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Side Branding Panels with offline, reliable high-res Canvas Textures */}
      <SideBannerMesh label="UTKARSH" x={-9.8} rotY={0.45} />
      <SideBannerMesh label="SOLANKI" x={9.8} rotY={-0.45} />

      <pointLight position={[0, 4, -2]} intensity={50} color="#d4af37" distance={40} decay={2} />
    </group>
  )
}

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Utkarsh Solanki | Full Stack Engineer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #06060a 0%, #12121e 50%, #06060a 100%)',
          color: '#ffffff',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Golden frame accent */}
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '12px',
          }}
        />

        <span
          style={{
            fontSize: '24px',
            color: '#d4af37',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            fontWeight: 700,
          }}
        >
          THE MAIN EVENT
        </span>

        <h1
          style={{
            fontSize: '84px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '4px',
            margin: '0 0 20px 0',
            textTransform: 'uppercase',
          }}
        >
          UTKARSH SOLANKI
        </h1>

        <p
          style={{
            fontSize: '32px',
            color: '#00e5ff',
            letterSpacing: '2px',
            margin: 0,
            fontWeight: 600,
          }}
        >
          Full Stack Software Engineer · Web3 & AI
        </p>

        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            gap: '24px',
            fontSize: '20px',
            color: '#8888aa',
          }}
        >
          <span>React</span>
          <span>·</span>
          <span>Next.js</span>
          <span>·</span>
          <span>TypeScript</span>
          <span>·</span>
          <span>Node.js</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

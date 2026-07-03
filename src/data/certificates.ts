export interface Certificate {
  name: string
  issuer: string
  date: string
  credentialId: string
  verificationUrl: string
  tier: 'heavyweight' | 'intercontinental' | 'hardcore'
  category: 'gold' | 'cyan' | 'red'
}

export const certificates: Certificate[] = [
  {
    name: 'Advanced React Native Specialist',
    issuer: 'Meta / Coursera',
    date: 'OCT 2025',
    credentialId: 'RN-META-992A',
    verificationUrl: 'https://coursera.org',
    tier: 'heavyweight',
    category: 'gold',
  },
  {
    name: 'Professional Google Cloud Architect',
    issuer: 'Google Cloud',
    date: 'DEC 2025',
    credentialId: 'GCP-PCA-883B',
    verificationUrl: 'https://cloud.google.com',
    tier: 'heavyweight',
    category: 'gold',
  },
  {
    name: 'Generative AI Developer Certification',
    issuer: 'DeepLearning.AI',
    date: 'FEB 2026',
    credentialId: 'AI-GEN-774C',
    verificationUrl: 'https://deeplearning.ai',
    tier: 'intercontinental',
    category: 'cyan',
  },
  {
    name: 'Creative WebGL & Three.js Masterclass',
    issuer: 'Three.js Journey',
    date: 'NOV 2025',
    credentialId: 'TJS-WEBGL-665D',
    verificationUrl: 'https://threejs-journey.com',
    tier: 'intercontinental',
    category: 'cyan',
  },
  {
    name: 'Full-Stack Software Engineer Credentials',
    issuer: 'freeCodeCamp',
    date: 'MAY 2025',
    credentialId: 'FCC-FSD-556E',
    verificationUrl: 'https://freecodecamp.org',
    tier: 'hardcore',
    category: 'red',
  },
]

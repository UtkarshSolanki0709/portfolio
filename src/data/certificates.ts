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
    name: 'Google AI Essentials',
    issuer: 'Google / Coursera',
    date: '2026',
    credentialId: '2ZL9VZPAMSWX',
    verificationUrl: 'https://coursera.org',
    tier: 'heavyweight',
    category: 'gold',
  },
  {
    name: 'AWS Academy Graduate - Cloud Foundations',
    issuer: 'Amazon Web Services (AWS)',
    date: 'NOV 2025',
    credentialId: 'AWS-ACADEMY-CLOUDFOUNDATIONS',
    verificationUrl: 'https://aws.amazon.com/training/',
    tier: 'heavyweight',
    category: 'gold',
  },
  {
    name: 'Introduction to Data Science',
    issuer: 'Cisco Networking Academy',
    date: '2025',
    credentialId: 'CISCO-NETACAD-DS',
    verificationUrl: 'https://www.netacad.com/',
    tier: 'intercontinental',
    category: 'cyan',
  },
  {
    name: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    date: 'OCT 2024',
    credentialId: '14b26822-ac8f-44a9-9e6b-d370091f9e9b',
    verificationUrl: 'https://www.netacad.com/',
    tier: 'intercontinental',
    category: 'cyan',
  },
  {
    name: 'Project Management',
    issuer: 'NPTEL / Swayam',
    date: '2024',
    credentialId: 'NPTEL-SWAYAM-PM',
    verificationUrl: 'https://swayam.gov.in/',
    tier: 'hardcore',
    category: 'red',
  },
  {
    name: 'Data Analytics Job Simulation',
    issuer: 'Deloitte Australia (Forage)',
    date: 'JAN 2026',
    credentialId: 'Qkrg5RbmirWwWWnZb',
    verificationUrl: 'https://www.theforage.com/',
    tier: 'intercontinental',
    category: 'cyan',
  },
]

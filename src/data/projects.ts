export interface Project {
  slug: string
  title: string
  tier: 'main-event' | 'featured' | 'undercard' | 'dark-match'
  matchLabel: string
  opponent: string
  description: string
  longDescription: string
  screenshots: string[]
  videos?: string[]
  aspectRatio?: string
  stack: string[]
  features: string[]
  stats: { platforms: number; features: number; linesOfCode?: number }
  github?: string
  live?: string
}

export const projects: Project[] = [
  {
    slug: 'botzilla-website',
    tier: 'main-event',
    title: 'BotZilla',
    matchLabel: 'MAIN EVENT · TITLE MATCH',
    opponent: 'BOTZILLA',
    description:
      'Cut my music! You\'re looking at the undisputed heavyweight champion of AI research platforms. Real-time web search. Deep multi-modal analysis. Real AI research. Cry me a river if your current tools can\'t keep up.',
    longDescription:
      'Look at this architecture and tell me I\'m not the best in the world. Next.js 15 on the App Router, Clerk for iron-clad security, and a Supabase backend that hits harder than a Strong Style lariat in the Tokyo Dome. This isn\'t some cheap backyard gimmick; this is an AI-powered search and research machine designed to tear through data and synthesize knowledge in real-time.\n\nYou want deep research mode? We got it. You need automated citation generation? It\'s locked in the center of the ring. With Trigger handling background processing like a true ring general and Nemotron 3 Super pulling the strings, BotZilla processes complex multi-modal queries before you even realize the bell rang. We didn\'t just set the bar; we broke it over our knee. I\'m better than your average dev, and you know it.',
    screenshots: [
      '/images/projects/botzilla/1.png',
    ],
    videos: [
      '/videos/botzilla.mp4',
    ],
    stack: ['Next.js 15', 'React 18', 'Supabase', 'Clerk', 'Trigger', 'TailwindCSS'],
    features: ['Multi-Modal Search', 'Deep Research Mode', 'Automated Citations', 'Background Processing'],
    stats: { platforms: 1, features: 12, linesOfCode: 6500 },
    github: '',
    live: '',
  },
  {
    slug: 'convo-website',
    tier: 'featured',
    title: 'Convo',
    matchLabel: 'FEATURED · NO DQ',
    opponent: 'CONVO APP',
    description:
      'You think your chat app is elite? Convo is the excellence of execution in real-time communication. Instant WebSockets, zero latency, and live typing status—it\'s the Best There Is, the Best There Was, and the Best There Ever Will Be.',
    longDescription:
      'Listen up, marks. When you need real-time communication, you don\'t rely on some jabroni HTTP polling architecture. Convo runs on pure WebSockets, Node.js, and Express to deliver instant messaging with the ruthless aggression of a prime Attitude Era main event.\n\nWe\'re talking group chats, live typing indicators, and a React frontend so smooth it makes a flawless moonsault look sloppy. The backend orchestration ensures low-latency message delivery, keeping the conversation flowing without a single botch. It\'s not just another chat app—it\'s a certified, undisputed paradigm shift in how we build real-time systems.',
    screenshots: [
      '/images/projects/convo/1.png',
    ],
    videos: [
      '/videos/convo-blitz_2026-06-01_03-01-09.mp4',
    ],
    stack: ['React', 'Node.js', 'WebSockets', 'Express'],
    features: ['Real-time Messaging', 'Live Status', 'Group Chats', 'Zero Latency'],
    stats: { platforms: 1, features: 8, linesOfCode: 5100 },
    github: '',
    live: '',
  },
  {
    slug: 'smart-exhibition-app',
    tier: 'undercard',
    title: 'Smart Exhibition App',
    matchLabel: 'UNDERCARD · LADDER MATCH',
    opponent: 'SMART EXHIBITION APP',
    description:
      'Listen up: this is a full-stack React Native + Node.js platform that drags paper-based exhibition management into the modern era. Real-time QR scanning, visitor analytics, and exhibitor dashboards keep the crowd moving and the data honest.',
    longDescription:
      'If you’ve ever watched an event turn into a backstage scramble — paper badges, manual check-ins, scattered exhibitor comms — this is the system that restores order before the bell. It replaces the chaos with a unified real-time platform built for actual event pressure.\n\nThe card is split into three clean roles: a Visitor mobile app with QR check-in and interactive floor maps, an Exhibitor dashboard with live foot-traffic analytics and lead capture, and an Admin panel for event orchestration. React Native handles the mobile side, while Node.js/Express and MongoDB form the backend that keeps everything synced.\n\nThe real work is under the lights: WebSocket sync across 500+ concurrent visitors, offline-first QR scanning with background sync, and role-based permissions across three user types. No cheap-pop gimmick — just strong-style engineering with enough ECW grit to keep the arena from collapsing.',
    screenshots: [
      '/images/projects/smart-exhibition/1.png',
      '/images/projects/smart-exhibition/2.png',
      '/images/projects/smart-exhibition/3.png',
    ],
    videos: [
      '/videos/smart-exhibtion-video.mp4',
    ],
    aspectRatio: '9 / 16',
    stack: ['React Native', 'Node.js', 'MongoDB', 'Express'],
    features: [
      'QR Check-in',
      'Live Analytics',
      'Exhibitor Dashboard',
      'Visitor App',
      'Admin Panel',
    ],
    stats: { platforms: 3, features: 12, linesOfCode: 8400 },
    github: '',
    live: '',
  },
]

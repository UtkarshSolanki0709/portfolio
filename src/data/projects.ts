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
  release?: string
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
      'BotZilla is a Next.js 15 and Supabase-powered AI research assistant that runs deep web searches and synthesizes multi-source knowledge.\n\nI thought of building this because traditional LLM clients are static, slow, and lack access to fresh web data, making research workflows highly manual. I wanted a decoupled agent system that runs in the background and aggregates multi-source findings automatically.\n\nWhat makes this project different is its Trigger.dev background integration, allowing users to fire off deep research jobs that compile complete multi-source answers with auto-indexing citations.',
    screenshots: [
      '/images/projects/botzilla/1.png',
    ],
    videos: [
      '/videos/botzilla.mp4',
    ],
    stack: ['Next.js 15', 'React 18', 'Supabase', 'Clerk', 'Trigger', 'TailwindCSS'],
    features: ['Trigger.dev Async Jobs', 'Multi-Modal Synthesizer', 'Real-Time Web Indexing', 'Automatic Auto-Citations'],
    stats: { platforms: 1, features: 12, linesOfCode: 6500 },
    github: '',
    live: '',
  },
  {
    slug: 'travo-app',
    tier: 'featured',
    title: 'Travo',
    matchLabel: 'FEATURED · NO HOLDS BARRED',
    opponent: 'TRAVO APP',
    description:
      'Clear the runway! Travo is the cross-platform social travel companion connecting explorers worldwide with real-time location sharing, Geoapify turn-by-turn routing, interest-matched meetups, and high-def travel stories.',
    longDescription:
      'Travo is a full-featured, cross-platform social travel mobile application built with React Native, Expo SDK 54, Supabase, and Clerk.\n\nI built Travo to turn solo journeys into shared adventures. Traditional travel tools are static booking utilities with zero real-time discovery. Travo solves this by connecting travelers dynamically through live GPS proximity tracking, interest-matched activity groups, and instant join workflows.\n\nWhat makes Travo stand out is its integrated geospatial architecture paired with cloud media pipelines: Geoapify routing with turn-by-turn navigation & duration estimation, bi-directional Clerk-to-Supabase identity synchronization, and adaptive Cloudinary media delivery for traveler feeds and stories.',
    screenshots: [
      '/images/projects/travo/1.png',
    ],
    aspectRatio: '1 / 1',
    stack: ['React Native', 'Expo 54', 'TypeScript', 'Supabase', 'Clerk', 'Geoapify', 'Cloudinary', 'NativeWind'],
    features: [
      'Live Location & Proximity Tracking',
      'Geoapify Turn-by-Turn Routing',
      'Interest-Matched Meetup Groups',
      'Clerk & Supabase Auth Sync',
      'Cloudinary Dynamic Media Feed',
      'Real-Time Presence & Availability',
    ],
    stats: { platforms: 2, features: 14, linesOfCode: 7800 },
    github: 'https://github.com/UtkarshSolanki0709/Travo',
    release: 'https://github.com/UtkarshSolanki0709/Travo/releases/tag/v.1.0.1',
    live: 'https://github.com/UtkarshSolanki0709/Travo/releases/tag/v.1.0.1',
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
      'Convo is a real-time messaging application utilizing a React frontend, Node.js, Express, and WebSocket channels.\n\nI created this project to master bare-metal WebSocket coordination, avoiding heavy HTTP polling and bulky wrapper frameworks to ensure maximum performance.\n\nWhat makes this app different is its zero-polling architecture and lightweight WebSocket pipelines that deliver sub-millisecond sync, instant typing indicators, and connection recovery.',
    screenshots: [
      '/images/projects/convo/1.png',
    ],
    videos: [
      '/videos/convo-blitz_2026-06-01_03-01-09.mp4',
    ],
    stack: ['React', 'Node.js', 'WebSockets', 'Express'],
    features: ['Bare-Metal WebSockets', 'Instant Connection Recovery', 'Zero-Polling Architecture', 'Sub-millisecond Sync'],
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
      'Smart Exhibition is a full-stack event management ecosystem featuring a React Native mobile app, an exhibitor analytics dashboard, and an administrative orchestration panel.\n\nI thought of this project after seeing the massive lines, clunky paper check-ins, and complete lack of data analytics at local trade shows and conventions.\n\nWhat makes this project different is its offline-first QR scanning with background sync, real-time visitor flow heatmaps, and matching algorithms that function even on spotty venue Wi-Fi.',
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

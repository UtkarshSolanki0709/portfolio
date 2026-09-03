export type HubSection = 'projects' | 'certificates' | 'timeline' | 'skills' | 'contact'

export const HUB_LEVELS: {
  id: HubSection
  label: string
  icon: string
  accent: string
  hint: string
}[] = [
  { id: 'projects', label: 'PROJECTS', icon: '🎮', accent: 'var(--gold)', hint: 'WORLD 1' },
  { id: 'certificates', label: 'CERTIFICATES', icon: '🏆', accent: 'var(--cyan)', hint: 'WORLD 2' },
  { id: 'timeline', label: 'TIMELINE', icon: '📜', accent: 'var(--red-accent)', hint: 'WORLD 3' },
  { id: 'skills', label: 'SKILLS', icon: '💪', accent: 'var(--gold-light)', hint: 'WORLD 4' },
  { id: 'contact', label: 'CONTACT', icon: '📞', accent: 'var(--cyan)', hint: 'FINAL' },
]

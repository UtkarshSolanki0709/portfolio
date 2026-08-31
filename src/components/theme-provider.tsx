'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
      {...props}
    >
      <ThemeHotkeyHandler />
      {children}
    </NextThemesProvider>
  )
}

function ThemeHotkeyHandler() {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Safe check: ignore input, textarea, select, contenteditable
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      // Cmd+Shift+D or Ctrl+Shift+D or bare 'd' when not typing
      if ((e.key === 'd' || e.key === 'D') && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [theme, setTheme])

  return null
}

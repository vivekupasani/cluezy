'use client'

import { useEffect, useState } from 'react'

import { Globe } from 'lucide-react'

import { cn } from '@/lib/utils'
import { getCookie, setCookie } from '@/lib/utils/cookies'


export function SearchModeToggle() {
  const [isSearchMode, setIsSearchMode] = useState(true)

  useEffect(() => {
    const savedMode = getCookie('search-mode')
    if (savedMode !== null) {
      setIsSearchMode(savedMode === 'true')
    } else {
      setCookie('search-mode', 'true')
    }
  }, [])

  const handleSearchModeChange = () => {
    // Toggle the current state
    const newSearchMode = !isSearchMode
    setIsSearchMode(newSearchMode)
    // Update the cookie with the new state
    setCookie('search-mode', `${newSearchMode}`)
  }

  return (
    <div
      aria-label="Toggle search mode"
      // onClick={handleSearchModeChange}
      className={cn(
        "opacity-0 bg-gradient-to-tr from-card/55 via-card/70 to-card/45 backdrop-blur-sm drop-shadow-sm shadow-inner shadow-foreground/5 border border-border/80 rounded-full px-2 py-2 cursor-pointer items-center hover:text-foreground/80 transition-colors",
        isSearchMode && "text-chart-1 transition-colors duration-200 hover:text-chart-1/90",
      )}
    >
      <Globe size={18} />
      {/* <span className="text-xs">Search</span> */}
    </div>
  )
}

// 'gap-1 border border-input',
//         isSearchMode ? "text-secondary-foreground bg-secondary" : "text-muted-foreground bg-transparent",
//         'data-[state=on]:bg-secondary hover:bg-secondary/80 rounded-full',
//         'data-[state=on]:text-accent-blue-foreground',
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { getSettings } from '@/lib/settings'
import { NavbarClient } from './NavbarClient'

async function NavbarAuthState() {
  const [session, settings] = await Promise.all([auth(), getSettings()])
  const isAdmin = session?.user?.role === 'admin'
  return (
    <NavbarClient
      userName={session?.user?.name ?? undefined}
      userRole={session?.user?.role ?? undefined}
      darkModeEnabled={isAdmin ? true : settings.darkModeEnabled}
    />
  )
}

function NavbarAuthFallback() {
  return (
    <>
      {/* Logo placeholder */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-white/20 animate-pulse" />
        <div className="w-28 h-5 rounded-lg bg-white/20 animate-pulse" />
      </div>
      {/* Right-side skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/20 animate-pulse" />
        <div className="hidden md:block w-20 h-8 rounded-xl bg-white/20 animate-pulse" />
      </div>
    </>
  )
}

/**
 * Navbar starts transparent so it can sit directly over the home hero.
 * Once scrolled, globals.css adds a light glass background for readability.
 *
 * Text/icon colors are managed by NavbarClient (white over hero,
 * dark brand colors after scrolling past it).
 *
 * Scroll opacity is handled purely by CSS:
 *   #site-header[data-scrolled="true"] in globals.css
 */
export function Navbar() {
  return (
    <header
      id="site-header"
      className="fixed top-0 left-0 right-0 z-50 rounded-b-2xl bg-transparent border-b border-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/*
          NavbarClient renders the logo wordmark first in its fragment,
          then nav links, then right-side actions — all color-reactive.
        */}
        <Suspense fallback={<NavbarAuthFallback />}>
          <NavbarAuthState />
        </Suspense>
      </div>
    </header>
  )
}

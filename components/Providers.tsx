'use client'

import { SessionProvider } from 'next-auth/react'
import { createContext, useContext, useEffect, useState } from 'react'
import { CartProvider } from '@/context/CartContext'

interface ProvidersProps {
  children: React.ReactNode
  darkModeEnabled?: boolean
}

interface ThemeContextValue {
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within Providers')
  return context
}

export function Providers({ children, darkModeEnabled = true }: ProvidersProps) {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return darkModeEnabled && window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const setTheme = (nextTheme: 'light' | 'dark') => {
    setThemeState(darkModeEnabled ? nextTheme : 'light')
  }

  return (
    <SessionProvider>
      <ThemeContext.Provider value={{ resolvedTheme: theme, setTheme }}>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeContext.Provider>
    </SessionProvider>
  )
}





// $$$$$$$$$$$$$$$$$$$     OLD CODE- down     $$$$$$$$$$$$$$$$$$$$$$$$$$_-----------------------------------------------------




// 'use client'

// import { SessionProvider } from 'next-auth/react'
// import { ThemeProvider } from 'next-themes'
// import { CartProvider } from '@/context/CartContext'

// interface ProvidersProps {
//   children: React.ReactNode
//   darkModeEnabled?: boolean
// }

// export function Providers({ children, darkModeEnabled = true }: ProvidersProps) {
//   return (
//     <SessionProvider>
//       <ThemeProvider
//         attribute="class"
//         defaultTheme="light"
//         enableSystem={false}
//         disableTransitionOnChange
//         forcedTheme={darkModeEnabled ? undefined : 'light'}
//       >
//         <CartProvider>
//           {children}
//         </CartProvider>
//       </ThemeProvider>
//     </SessionProvider>
//   )
// }

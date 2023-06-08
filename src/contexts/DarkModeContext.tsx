import { createContext, useEffect, useState } from "react"

export interface IDarkModeContext {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<IDarkModeContext>({
  isDarkMode: false,
  toggleDarkMode: () => {
    // set up later in provider
  }
})

type Props = React.HTMLAttributes<React.ProviderProps<IDarkModeContext>>
export function DarkModeProvider({ ...p }: Props) {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(v => !v)
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }} {...p} />
  )
}

export default DarkModeContext

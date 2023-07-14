import { LOCAL_STORAGE } from "@/utils/constants"
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

function getLocalStorageValue(): boolean | null {
  const lsValue = localStorage.getItem(LOCAL_STORAGE.darkMode)
  if (!lsValue || !["false", "true"].includes(lsValue)) return null
  return Boolean(JSON.parse(lsValue))
}

function getCssValue(): boolean {
  localStorage.removeItem(LOCAL_STORAGE.darkMode)
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function getInitialValue(): boolean {
  const ls = getLocalStorageValue()
  return ls === null ? getCssValue() : ls
}

type Props = React.HTMLAttributes<React.ProviderProps<IDarkModeContext>>
export function DarkModeProvider({ ...p }: Props) {
  const [isDarkMode, setIsDarkMode] = useState(getInitialValue())

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#00172A")
    } else {
      document.documentElement.classList.remove("dark")
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#FFFFFF")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(value => {
      const newValue = !value
      localStorage.setItem(LOCAL_STORAGE.darkMode, JSON.stringify(newValue))
      return newValue
    })
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }} {...p} />
  )
}

export default DarkModeContext

import { createContext, useEffect, useState } from "react"

export interface IMobileContext {
  isMobile: boolean
  width: number
}

const MobileContext = createContext<IMobileContext>({
  isMobile: false,
  width: window.innerWidth,
})

type Props = React.HTMLAttributes<React.ProviderProps<IMobileContext>>

export function MobileProvider({ ...p }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <MobileContext.Provider value={{ isMobile, width }} {...p} />
}

export default MobileContext

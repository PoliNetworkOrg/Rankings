import { createContext, useState } from "react"

export interface IMobileContext {
  isMobile: boolean
  width: number
}

const MobileContext = createContext<IMobileContext>({
  isMobile: false,
  width: window.innerWidth
})

type Props = React.HTMLAttributes<React.ProviderProps<IMobileContext>>

export function MobileProvider({ ...p }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [width, setWidth] = useState(window.innerWidth)

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth)
    setIsMobile(window.innerWidth < 768)
  })

  return <MobileContext.Provider value={{ isMobile, width }} {...p} />
}

export default MobileContext

import { createContext, useState } from "react"

export interface IMobileContext {
  isMobile: boolean
}

const MobileContext = createContext<IMobileContext>({
  isMobile: false
})

type Props = React.HTMLAttributes<React.ProviderProps<IMobileContext>>

export function MobileProvider({ ...p }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth < 768)
  })

  return <MobileContext.Provider value={{ isMobile }} {...p} />
}

export default MobileContext

import { DarkModeProvider } from "./DarkModeContext"
import { MobileProvider } from "./MobileContext"

interface Props {
  children: React.ReactNode
}
export default function ContextProvider({ children }: Props) {
  return (
    <DarkModeProvider>
      <MobileProvider>{children}</MobileProvider>
    </DarkModeProvider>
  )
}

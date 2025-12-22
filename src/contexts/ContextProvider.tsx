import { DarkModeProvider } from "./DarkModeContext"
import { MobileProvider } from "./MobileContext"
import { SettingsProvider } from "./SettingsContext"

interface Props {
  children: React.ReactNode
}
export default function ContextProvider({ children }: Props) {
  return (
    <DarkModeProvider>
      <SettingsProvider>
        <MobileProvider>{children}</MobileProvider>
      </SettingsProvider>
    </DarkModeProvider>
  )
}

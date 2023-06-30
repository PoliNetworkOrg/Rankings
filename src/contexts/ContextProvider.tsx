import { DarkModeProvider } from "./DarkModeContext"
import { DataProvider } from "./DataContext"
import { MobileProvider } from "./MobileContext"

interface Props {
  children: React.ReactNode
}
export default function ContextProvider({ children }: Props) {
  return (
    <DarkModeProvider>
      <DataProvider>
        <MobileProvider>{children}</MobileProvider>
      </DataProvider>
    </DarkModeProvider>
  )
}

import Header from "./components/Header"
import Viewer from "./components/Viewer/Viewer"
import { MobileProvier } from "./contexts/MobileContext"

export default function App() {
  return (
    <MobileProvier>
      <div className="flex h-screen flex-col items-center justify-start overflow-y-hidden bg-white text-black dark:bg-slate-900 dark:text-white">
        <Header />
        <Viewer />
      </div>
    </MobileProvier>
  )
}

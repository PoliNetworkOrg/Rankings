import Header from "./components/Header"
import Viewer from "./components/Viewer/Viewer"
import ContextProvider from "./contexts/ContextProvider"

export default function App() {
  return (
    <ContextProvider>
      <div className="flex h-screen flex-col items-center justify-start overflow-y-hidden bg-white text-black dark:bg-slate-900 dark:text-white">
        <Header />
        <Viewer />
      </div>
    </ContextProvider>
  )
}

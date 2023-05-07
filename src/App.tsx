import Header from "./components/Header"
import Viewer from "./components/Viewer/Viewer"

export default function App() {
  return (
    <div className="flex h-screen overflow-y-hidden flex-col items-center justify-start bg-white text-black dark:bg-slate-900 dark:text-white">
      <Header />
      <Viewer />
    </div>
  )
}

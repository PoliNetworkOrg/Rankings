import ContextProvider from "./contexts/ContextProvider"
import { IconContext } from "react-icons"
import Router from "./components/Router"

export default function App() {
  return (
    <ContextProvider>
      <IconContext.Provider value={{ size: "28px" }}>
        <Router />
      </IconContext.Provider>
    </ContextProvider>
  )
}

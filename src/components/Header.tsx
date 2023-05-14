import {
  MdOutlineLightMode as LightIcon,
  MdOutlineDarkMode as DarkIcon
} from "react-icons/md"
import { LINKS } from "../utils/constants"
import logo from "../static/logo3000.webp"
import { useContext } from "react"
import DarkModeContext from "../contexts/DarkModeContext"
import { IconContext } from "react-icons"

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)
  return (
    <header className="w-full border-b border-slate-800/20 dark:border-slate-300/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-4">
        <div className="max-sm:flex-[0.25] sm:flex-1">
          <a
            href={LINKS.polinetworkMain}
            rel="noreferrer noopener"
            target="_blank"
            className="flex items-center gap-2"
          >
            <img src={logo} className="h-auto w-16" />
            <span className="text-lg font-bold max-sm:hidden">PoliNetwork</span>
          </a>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold max-md:text-xl">
            Graduatorie PoliMi
          </h1>
        </div>
        <div className="flex items-center justify-end max-sm:flex-[0.25] sm:flex-1">
          <IconContext.Provider
            value={{ size: "2rem", className: "react-icons" }}
          >
            <button onClick={toggleDarkMode}>
              {isDarkMode ? <DarkIcon /> : <LightIcon />}
            </button>
          </IconContext.Provider>
        </div>
      </div>
    </header>
  )
}

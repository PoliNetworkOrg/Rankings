import { useContext } from "react"
import {
  MdOutlineLightMode as LightIcon,
  MdOutlineDarkMode as DarkIcon
} from "react-icons/md"
import { LINKS } from "@/utils/constants"
import logo from "@/static/logo3000.webp"
import DarkModeContext from "@/contexts/DarkModeContext"
import { Link } from "@tanstack/router"
import { Button } from "./ui/button"

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)
  return (
    <header className="w-full border-b border-slate-800/20 dark:border-slate-300/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-2">
        <div className="flex max-sm:flex-[0.25] sm:flex-1">
          <a
            href={LINKS.polinetworkMain}
            rel="noreferrer noopener"
            target="_blank"
            className="flex items-center gap-3 rounded-md p-1 pr-4 text-black hover:bg-slate-400/10 hover:no-underline dark:text-white dark:hover:bg-slate-200/10"
          >
            <img src={logo} className="h-auto w-10" />
            <span className="text-lg font-semibold max-sm:hidden">
              PoliNetwork
            </span>
          </a>
        </div>
        <div className="flex-1 text-center">
          <Link
            to="/"
            className="text-black hover:no-underline dark:text-white"
          >
            <h1 className="text-2xl font-bold max-[300px]:text-xl">Rankings</h1>
          </Link>
        </div>
        <div className="flex items-center justify-end max-sm:flex-[0.25] sm:flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-xs"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <DarkIcon /> : <LightIcon />}
          </Button>
        </div>
      </div>
    </header>
  )
}

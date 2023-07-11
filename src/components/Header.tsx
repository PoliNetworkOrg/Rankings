import { useContext } from "react"
import {
  MdOutlineLightMode as LightIcon,
  MdOutlineDarkMode as DarkIcon
} from "react-icons/md"
import logo from "@/static/logo3000.webp"
import DarkModeContext from "@/contexts/DarkModeContext"
import { Link } from "@tanstack/router"
import { Button } from "./ui/button"

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)
  return (
    <header className="w-full border-b border-slate-800/20 dark:border-slate-300/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <div className="flex flex-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md text-black hover:no-underline dark:text-white"
          >
            <img src={logo} className="h-auto w-10" />
            <span className="max-[450px]:hidden text-lg font-semibold">
              PoliNetwork
            </span>
            <h1 className="text-md rounded-md bg-slate-900/10 px-2 py-1 font-bold dark:bg-slate-100/10">
              Rankings
            </h1>
          </Link>
        </div>
        <div className="flex items-center justify-end">
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

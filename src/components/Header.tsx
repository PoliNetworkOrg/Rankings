import { LINKS } from "../utils/constants"
import logo from "../static/logo3000.webp"

export default function Header() {
  return (
    <div className="border-b border-slate-800/20 dark:border-slate-300/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-4">
        <div className="flex-1">
          <a
            href={LINKS.polinetworkMain}
            rel="noreferrer noopener"
            target="_blank"
            className="flex items-center gap-2"
          >
            <img src={logo} className="h-auto w-16" />
            <span className="text-lg font-bold">PoliNetwork</span>
          </a>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">Graduatorie PoliMi</h1>
        </div>
        <div className="flex-1 text-right">
          <span>i18n</span>
        </div>
      </div>
    </div>
  )
}

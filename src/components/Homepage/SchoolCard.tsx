import { Link } from "@tanstack/react-router"
import type { School } from "@/utils/types/data/school"
import { cn } from "@/utils/ui"

type SchoolConfig = {
  icon: string
  description: string
  gradient: string
  hoverGradient: string
}

const SCHOOL_CONFIG: Record<School, SchoolConfig> = {
  Architettura: {
    icon: "🏛️",
    description: "Progettazione architettonica e spaziale",
    gradient: "from-amber-500/10 to-orange-500/10",
    hoverGradient: "hover:from-amber-500/20 hover:to-orange-500/20",
  },
  Design: {
    icon: "🎨",
    description: "Design del prodotto e comunicazione",
    gradient: "from-pink-500/10 to-purple-500/10",
    hoverGradient: "hover:from-pink-500/20 hover:to-purple-500/20",
  },
  Ingegneria: {
    icon: "⚙️",
    description: "Scienze e tecnologie ingegneristiche",
    gradient: "from-blue-500/10 to-cyan-500/10",
    hoverGradient: "hover:from-blue-500/20 hover:to-cyan-500/20",
  },
  Urbanistica: {
    icon: "🏙️",
    description: "Pianificazione urbana e territoriale",
    gradient: "from-green-500/10 to-emerald-500/10",
    hoverGradient: "hover:from-green-500/20 hover:to-emerald-500/20",
  },
}

type Props = {
  school: School
  yearCount?: number
}

export function SchoolCard({ school, yearCount }: Props) {
  const config = SCHOOL_CONFIG[school]

  return (
    <Link to="/$school" params={{ school }} className="group block h-full">
      <div
        className={cn(
          "relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br p-5 transition-all duration-300",
          "hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg",
          "dark:border-slate-700 dark:hover:border-slate-600",
          config.gradient,
          config.hoverGradient
        )}
      >
        <div className="flex items-start justify-between">
          <span className="text-4xl" role="img" aria-label={school}>
            {config.icon}
          </span>
          {yearCount !== undefined && (
            <span className="rounded-full bg-slate-900/10 px-2 py-0.5 font-medium text-slate-600 text-xs dark:bg-slate-100/10 dark:text-slate-400">
              {yearCount} {yearCount === 1 ? "anno" : "anni"}
            </span>
          )}
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
            {school}
          </h3>
          <p className="mt-1 text-slate-600 text-sm dark:text-slate-400">
            {config.description}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-slate-900/5 transition-transform duration-300 group-hover:scale-150 dark:bg-slate-100/5" />
      </div>
    </Link>
  )
}

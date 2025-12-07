import {
  LuAlertCircle,
  LuAlertTriangle,
  LuCheckCircle2,
  LuInfo,
} from "react-icons/lu"
import { capitaliseWords } from "@/utils/strings/capitalisation"
import type { Level } from "@/utils/types/alert"
import { cn } from "@/utils/ui"

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  level: Level
}

export default function Alert({
  children,
  className = "",
  level,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "flex w-full gap-4 rounded-lg border p-4 text-left",
        getColors(level),
        className
      )}
      {...props}
    >
      <div>{GetIcon(level)}</div>
      <div>
        <p className="pb-2 font-bold text-lg">{capitaliseWords(level)}</p>
        <div>{children}</div>
      </div>
    </div>
  )
}

function GetIcon(level: Level) {
  switch (level) {
    case "error":
      return <LuAlertCircle />
    case "warning":
      return <LuAlertTriangle />
    case "info":
      return <LuInfo />
    case "success":
      return <LuCheckCircle2 />
  }
}

const getColors = (level: Level) => {
  switch (level) {
    case "error":
      return "bg-red-300/5 border-red-600 text-red-600 dark:bg-red-100/5 dark:border-red-300 dark:text-red-300"
    case "warning":
      return "bg-amber-300/5 border-amber-600 text-amber-600 dark:bg-amber-100/5 dark:border-amber-200 dark:text-amber-200"
    case "info":
      return "bg-sky-300/5 border-sky-600 text-sky-600 dark:bg-sky-100/5 dark:border-sky-200 dark:text-sky-200"
    case "success":
      return "bg-green-300/5 border-green-600 text-green-600 dark:bg-green-100/5 dark:border-green-200 dark:text-green-200"
  }
}

import {
  LuAlertCircle,
  LuAlertTriangle,
  LuCheckCircle2,
  LuInfo
} from "react-icons/lu"
import { capitalizeWords } from "@/utils/strings"
import { Level } from "@/utils/types/alert"
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
        <p className="pb-2 text-lg font-bold">{capitalizeWords(level)}</p>
        <div>{children}</div>
      </div>
    </div>
  )
}

function GetIcon(level: Level) {
  if (level === "error") return <LuAlertCircle />
  if (level === "warning") return <LuAlertTriangle />
  if (level === "info") return <LuInfo />
  if (level === "success") return <LuCheckCircle2 />
}

const getColors = (level: Level) => {
  if (level === "error")
    return "bg-red-300/5 border-red-600 text-red-600 dark:bg-red-100/5 dark:border-red-300 dark:text-red-300"
  if (level === "warning")
    return "bg-amber-300/5 border-amber-600 text-amber-600 dark:bg-amber-100/5 dark:border-amber-200 dark:text-amber-200"
  if (level === "info")
    return "bg-sky-300/5 border-sky-600 text-sky-600 dark:bg-sky-100/5 dark:border-sky-200 dark:text-sky-200"
  if (level === "success")
    return "bg-green-300/5 border-green-600 text-green-600 dark:bg-green-100/5 dark:border-green-200 dark:text-green-200"
}

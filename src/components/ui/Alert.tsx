import { MdErrorOutline, MdInfoOutline, MdWarningAmber } from "react-icons/md"
import { capitalizeWords } from "../../utils/strings"
import { Level } from "../../utils/types/alert"

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
      className={`flex w-full rounded-lg ${getColors(
        level
      )} gap-4 p-4 text-left ${className}`}
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
  if (level === "error") return <MdErrorOutline />
  if (level === "warning") return <MdWarningAmber />
  if (level === "info") return <MdInfoOutline />
  if (level === "success") return <MdErrorOutline />
}

const getColors = (level: Level) => {
  if (level === "error")
    return "bg-red-200/30 text-red-900 dark:bg-red-500/10 dark:text-red-100"
  if (level === "warning")
    return "bg-amber-200/30 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"
  if (level === "info")
    return "bg-sky-200/30 text-sky-900 dark:bg-sky-400/10 dark:text-sky-100"
  if (level === "success")
    return "bg-green-200/30 text-green-900 dark:bg-green-400/10 dark:text-green-100"
}

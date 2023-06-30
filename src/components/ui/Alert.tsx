import { MdErrorOutline, MdInfoOutline, MdWarningAmber } from "react-icons/md"
import { capitalizeWords } from "../../utils/strings"

type Level = "info" | "warning" | "success" | "error"

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  level: Level
}

export default function Alert({ children, className, level, ...props }: Props) {
  return (
    <div
      className={`flex w-full rounded-lg bg-${getColor(
        level
      )}-400/40 gap-4 p-4 text-left ${className}`}
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

const getColor = (level: Level) => {
  if (level === "error") return "red"
  if (level === "warning") return "yellow"
  if (level === "info") return "blue"
  if (level === "success") return "green"
}

import { cn } from "@/utils/ui"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  fullWidth?: boolean
  paddingTop?: boolean
}

export default function Page({
  children,
  className = "",
  fullWidth = false,
  paddingTop = true,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-1 flex-col items-start gap-4 px-4 pb-8",
        fullWidth ? "max-w-full" : "mx-auto max-w-7xl",
        paddingTop ? "pt-4 max-sm:pt-3" : "",
        className
      )}
    >
      {children}
    </div>
  )
}

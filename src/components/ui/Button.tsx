export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  disabled?: boolean
  active?: boolean
  circle?: boolean
}

export default function Button({
  children,
  className,
  active,
  disabled,
  circle,
  onClick,
  ...p
}: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center gap-4  transition-colors  ${
        className ?? ""
      } ${
        active
          ? "bg-blue-300 hover:bg-blue-300/80 dark:bg-blue-700 dark:hover:bg-blue-700/80"
          : disabled
          ? "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-400"
          : "bg-slate-200 hover:bg-slate-300/80 dark:bg-slate-700 dark:hover:bg-slate-700/80"
      } ${circle ? "rounded-full px-2 py-2" : "rounded-lg px-4 py-2"}`}
      onClick={e => {
        if (!disabled) onClick?.(e)
      }}
      {...p}
    >
      {children}
    </button>
  )
}

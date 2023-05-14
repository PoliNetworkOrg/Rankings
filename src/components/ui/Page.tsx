interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  fullWidth?: boolean
  paddingTop?: boolean
}

export default function Page({
  children,
  className = "",
  fullWidth = false,
  paddingTop = true
}: Props) {
  return (
    <div
      className={`relative ${
        fullWidth ? "max-w-full" : "mx-auto max-w-7xl"
      } flex w-full flex-1 flex-col items-center px-2 ${
        paddingTop ? "py-4" : "pb-4"
      } ${className}`}
    >
      {children}
    </div>
  )
}

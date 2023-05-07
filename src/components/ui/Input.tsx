interface Props extends React.HTMLAttributes<HTMLInputElement> {
  onValue: (value: string) => void
  value: string
}

export default function Input({ value, onValue, className = "", ...p }: Props) {
  return (
    <input
      className={`w-full rounded border-none bg-slate-300 p-2 outline-none dark:bg-slate-700 ${className}`}
      value={value}
      onChange={e => onValue?.(e.currentTarget.value)}
      {...p}
    />
  )
}

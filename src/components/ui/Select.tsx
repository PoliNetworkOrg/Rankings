interface Props<T> extends React.HTMLAttributes<HTMLSelectElement> {
  options: T[] | readonly T[]
  value: T
}

export default function Select<T extends string | number>({
  options,
  value,
  className,
  ...p
}: Props<T>) {
  return (
    <select
      value={value}
      className={`w-full rounded-lg border-none bg-slate-300 p-2 outline-none dark:bg-slate-700 ${className}`}
      {...p}
    >
      {options.map(o => (
        <option value={o}>{o}</option>
      ))}
    </select>
  )
}

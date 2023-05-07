import { useId } from "react"
import Button from "./Button.tsx"

interface Props<T> extends React.HTMLAttributes<HTMLDivElement> {
  options: T[] | readonly T[]
  active: T
  onOptionSelect: (option: T) => void
  useColumn?: boolean
}
export default function ButtonSelect<T extends number | string>({
  className,
  options,
  active,
  useColumn,
  onOptionSelect,
  ...p
}: Props<T>) {
  const id = useId()
  return (
    <div
      className={`${
        useColumn ? "flex flex-col justify-start" : "flex justify-center"
      } w-full gap-4 max-sm:flex-wrap ${className ?? ""}`}
      {...p}
    >
      {options.map((o, i) => (
        <Button
          key={`${id}btn-${i}`}
          className={useColumn ? "" : "flex-1"}
          onClick={() => onOptionSelect(o)}
          active={active === o}
        >
          {o}
        </Button>
      ))}
    </div>
  )
}

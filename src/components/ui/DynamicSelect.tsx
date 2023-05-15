import { useContext, useId } from "react"
import MobileContext from "../../contexts/MobileContext"
import Button from "./Button"

interface SelectProps<T> extends React.HTMLAttributes<HTMLSelectElement> {
  onOptionSelect: (option: T) => void
  options: T[] | readonly T[]
  value: T
}

interface ButtonSelectProps<T> extends SelectProps<T> {
  useColumn?: boolean
}

export default function DynamicSelect<T extends string>({
  useColumn = false,
  options,
  value,
  onOptionSelect,
  className = ""
}: ButtonSelectProps<T>) {
  const { isMobile } = useContext(MobileContext)
  return isMobile ? (
    <Select
      options={options}
      className={className}
      value={value}
      onOptionSelect={onOptionSelect}
    />
  ) : (
    <ButtonSelect
      options={options}
      value={value}
      onOptionSelect={onOptionSelect}
      useColumn={useColumn}
      className={className}
    />
  )
}

export function Select<T extends string>({
  options,
  value,
  className = "",
  onOptionSelect
}: SelectProps<T> & React.HTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <select
      value={value}
      className={`w-full rounded-lg border-none bg-slate-200 p-2 outline-none dark:bg-slate-700 ${className}`}
      onChange={e => onOptionSelect(e.target.value as T)}
    >
      {options.map(o => (
        <option key={`select${id}${o}`} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

type ButtonSelectPropsHtml<T> = ButtonSelectProps<T>
export function ButtonSelect<T extends string>({
  className = "",
  options,
  value,
  useColumn,
  onOptionSelect,
  ...p
}: ButtonSelectPropsHtml<T> & React.HTMLAttributes<HTMLDivElement>) {
  const id = useId()
  return (
    <div
      className={`${
        useColumn
          ? "h-full w-auto flex-col justify-start overflow-y-auto pr-2 scrollbar-thin"
          : "justify-center"
      } flex w-full gap-4 max-sm:flex-wrap ${className}`}
      {...p}
    >
      {options.map((o, i) => (
        <Button
          key={`${id}btn-${i}`}
          className={useColumn ? "" : "flex-1"}
          onClick={() => onOptionSelect(o)}
          active={value === o}
        >
          {o}
        </Button>
      ))}
    </div>
  )
}

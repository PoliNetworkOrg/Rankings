import { EnrollStats as IEnrollStats } from "../../utils/types.ts"

interface SingleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  label: string
  value: string | number
}
const Single = ({ label, value, ...props }: SingleProps) => (
  <p
    className="flex-1 rounded bg-slate-100 py-2 px-1 text-center dark:bg-slate-800"
    {...props}
  >
    <span className="mr-2 text-black/50 dark:text-white/50">{label}</span>
    {value}
  </p>
)

interface Props {
  stats: IEnrollStats
}
export default function EnrollStats({ stats }: Props) {
  return (
    stats && (
      <div className="mb-4 grid w-full grid-cols-2 flex-wrap items-center gap-4 lg:flex">
        <Single label="Candidates" value={stats.candidates} />
        <Single label="Passed" value={stats.allowed} />
        <Single label="Pass ratio" value={stats.allowedPct} />
        {stats.minScoreToPass !== 0 && (
          <Single label="Score-to-pass" value={stats.minScoreToPass} />
        )}
      </div>
    )
  )
}

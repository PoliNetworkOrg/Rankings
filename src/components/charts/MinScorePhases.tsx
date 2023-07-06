import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"
import { CourseSummary } from "../../utils/types/data/parsed/Ranking/RankingSummary"
import { hashCode } from "../../utils/hash"
import CustomMap from "../../utils/CustomMap"

export type MinScorePhasesObj = CustomMap<number, MinScorePhasesObj_PhasesMap>
export type MinScorePhasesObj_PhasesMap = CustomMap<string, CourseSummary>

type Data = DataSingle[]
type DataSingle = {
  anno: number
  [phase: string]: number
}

type Props = {
  stats?: MinScorePhasesObj
}

export default function MinScorePhases({ stats }: Props) {
  if (!stats) return <></>
  const data = getData(stats)

  const phases = data
    .map(year => Object.keys(year).filter(key => key != "anno"))
    .flat()

  const set = Array.from(new Set(phases))

  const uniquePhases = set.map(phase => ({
    phase,
    color: "#" + Math.abs(hashCode(phase)).toString(16).slice(0, 6)
  }))

  return (
    <LineChart
      width={1000}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="anno" />
      <YAxis />
      <Tooltip />
      <Legend />
      {uniquePhases.map(p => (
        <Line
          type="monotone"
          dataKey={p.phase}
          stroke={p.color}
          key={p.phase}
        />
      ))}
    </LineChart>
  )
}

function getData(stats: MinScorePhasesObj): Data {
  const data: Data = stats.entriesArr().map(([year, phases]) => {
    const data: DataSingle = {
      anno: year
    }
    phases.forEach((stats, phase) => (data[phase] = stats.minScoreToEnroll))
    return data
  })

  return data
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import Ranking from "../../utils/types/data/parsed/Ranking";

type Props = {
  ranking?: Ranking;
};
export default function VotoCandidatiChart({ ranking }: Props) {
  if (!ranking) return <></>;

  const chartData = getData(ranking);

  return (
    <BarChart
      width={1000}
      height={500}
      data={chartData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="voto" />
      <YAxis />
      <Tooltip labelStyle={{ background: "red" }} />
      <Legend />
      <Bar dataKey="candidati" fill="#8884d8">
        {chartData.map((entry, index) => (
          <Cell
            cursor="pointer"
            fill={entry.voto >= 60 ? "#82ca9d" : "red"}
            key={`cell-${index}`}
          />
        ))}
      </Bar>
    </BarChart>
  );
}

function getData(ranking: Ranking) {
  const stats = ranking.rankingSummary.resultsSummarized;

  const chartData = stats.entriesArr().map(([score, candidates]) => ({
    name: score,
    voto: score,
    candidati: candidates,
  }));
  return chartData;
}

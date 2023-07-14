import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CourseSummary } from "../../utils/types/data/parsed/Ranking/RankingSummary";
import CustomMap from "../../utils/CustomMap";
import { useContext } from "react";
import DarkModeContext from "../../contexts/DarkModeContext";

export type MinScorePhasesObj = CustomMap<number, MinScorePhasesObj_PhasesMap>;
export type MinScorePhasesObj_PhasesMap = CustomMap<string, CourseSummary>;

type Data = DataSingle[];
type DataSingle = {
  anno: number;
  [phase: string]: number;
};

type Props = {
  stats?: MinScorePhasesObj;
};

export default function MinScorePhases({ stats }: Props) {
  const { isDarkMode } = useContext(DarkModeContext);
  if (!stats) return <></>;
  const data = getData(stats);

  const phases = data
    .map((year) => Object.keys(year).filter((key) => key != "anno"))
    .flat();

  const set = Array.from(new Set(phases));

  const colors = generateColors(set.length, isDarkMode);
  const uniquePhases = set.map((phase, idx) => ({
    phase,
    color: colors[idx],
  }));

  return (
    <LineChart
      width={1000}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="anno" />
      <YAxis />
      <Tooltip />
      <Legend />
      {uniquePhases.map((p) => (
        <Line
          type="monotone"
          dataKey={p.phase}
          stroke={p.color}
          key={p.phase}
        />
      ))}
    </LineChart>
  );
}

function getData(stats: MinScorePhasesObj): Data {
  const data: Data = stats.entriesArr().map(([year, phases]) => {
    const data: DataSingle = {
      anno: year,
    };
    phases.forEach((stats, phase) => (data[phase] = stats.minScoreToEnroll));
    return data;
  });

  return data;
}

function generateColors(n: number, darkTheme: boolean): string[] {
  const colors: string[] = [];
  for (let i = 0; i < n; i++) {
    let r, g, b;
    if (darkTheme) {
      // Generate a random light color for dark theme
      r = Math.floor(Math.random() * 100) + 155; // Red component
      g = Math.floor(Math.random() * 100) + 155; // Green component
      b = Math.floor(Math.random() * 100) + 155; // Blue component
    } else {
      // Generate a random dark color for light theme
      r = Math.floor(Math.random() * 100); // Red component
      g = Math.floor(Math.random() * 100); // Green component
      b = Math.floor(Math.random() * 100); // Blue component
    }
    const color = `rgb(${r}, ${g}, ${b})`;
    const hexColor = rgbToHex(color);
    colors.push(hexColor);
  }
  return colors;
}

function rgbToHex(rgb: string): string {
  const components = rgb.replace(/[^\d,]/g, "").split(",");

  const hexComponents = components.map((component) => {
    const decimalValue = parseInt(component, 10);
    const hexValue = decimalValue.toString(16).padStart(2, "0");
    return hexValue;
  });

  const hexColor = "#" + hexComponents.join("");

  return hexColor;
}

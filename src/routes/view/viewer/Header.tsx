import { MdNavigateNext } from "react-icons/md"
import Ranking from "@/utils/types/data/parsed/Ranking"
import { Link, useParams } from "@tanstack/router"

type Props = {
  ranking?: Ranking
}
export default function ViewHeader({ ranking }: Props) {
  const { school, year } = useParams()

  if (!school) return <></>
  return (
    <div className="flex w-full items-center justify-start">
      <div className="flex items-center overflow-x-auto text-lg scrollbar-thin">
        <Link to="/">Homepage</Link>
        <Spacer />
        <Link to="/view/$school" params={{ school }}>
          {school}
        </Link>
        {year && (
          <>
            <Spacer />
            <Link to="/view/$school/$year" params={{ school, year }}>
              {year}
            </Link>
          </>
        )}
        {ranking && (
          <>
            <Spacer />
            <p>{ranking.phase}</p>
          </>
        )}
      </div>
    </div>
  )
}

function Spacer() {
  return (
    <span className="px-2">
      <MdNavigateNext />
    </span>
  )
}

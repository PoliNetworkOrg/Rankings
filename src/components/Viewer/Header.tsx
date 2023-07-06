import { MdNavigateNext } from "react-icons/md"
import { Link, useParams } from "react-router-dom"
import Ranking from "../../utils/types/data/parsed/Ranking"

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
        <Link to={`/view/${school}`}>{school}</Link>
        {year && (
          <>
            <Spacer />
            <Link to={`/view/${school}/${year}`}>{year}</Link>
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

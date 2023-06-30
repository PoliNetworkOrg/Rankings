import { MdNavigateNext } from "react-icons/md"
import { Link, useParams } from "react-router-dom"

export default function ViewHeader() {
  const { school, year, phase } = useParams()

  if (!school) return <></>
  return (
    <div className="flex items-center justify-start p-2">
      <div className="flex items-center text-lg">
        <Link to="/">{school}</Link>
        {year && (
          <>
            <Spacer />
            <Link to={`/view/${school}`}>{year}</Link>
          </>
        )}
        {phase && (
          <>
            <Spacer />
            <Link to={`/view/${school}/${year}`}>{phase}</Link>
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

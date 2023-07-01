import { MdNavigateNext } from "react-icons/md"
import { Link, useParams } from "react-router-dom"

export default function ViewHeader() {
  const { school, year, phase } = useParams()

  if (!school) return <></>
  return (
    <div className="flex w-full items-center justify-start p-2">
      <div className="flex items-center overflow-x-auto text-lg">
        <Link to="/">Homepage</Link>
        <Spacer />
        <Link to={`/view/${school}`}>{school}</Link>
        {year && (
          <>
            <Spacer />
            <Link to={`/view/${school}/${year}`}>{year}</Link>
          </>
        )}
        {phase && (
          <>
            <Spacer />
            <p>{phase}</p>
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

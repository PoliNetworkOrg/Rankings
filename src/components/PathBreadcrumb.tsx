import { Link, useParams } from "@tanstack/react-router"
import { LuArrowRight, LuHouse } from "react-icons/lu"

export default function PathBreadcrumb() {
  const params = useParams({
    shouldThrow: false,
    strict: false,
    select({ school, year }) {
      return { school, year }
    },
  })

  if (!params || !params.school) return null
  const { school, year } = params

  return (
    <div className="flex h-8 w-full items-center gap-2 text-lg">
      <Link to="/">
        <LuHouse size={18} />
      </Link>
      <LuArrowRight size={18} />
      <Link to="/$school" params={{ school }}>
        {school}
      </Link>
      {year && (
        <>
          <LuArrowRight size={18} />
          <Link to="/$school/$year" params={{ school, year }}>
            {year}
          </Link>
        </>
      )}
    </div>
  )
}

import { Link, useParams } from "@tanstack/router"
import { PhaseLink } from "../../utils/types/data/parsed/Index/RankingFile"
import Button from "../ui/Button"

type Props = {
  phasesLinks?: PhaseLink[]
}

export default function PhaseSelector({ phasesLinks }: Props) {
  const { school, year } = useParams()
  if (!school || !year) return <></>

  return (
    <div className="flex flex-wrap gap-4">
      {phasesLinks?.map(phase => {
        return (
          <Link
            className="max-sm:w-full"
            to="/view/$school/$year/$phase"
            params={{
              school,
              year,
              phase: phase.href
            }}
            key={phase.href}
            children={({ isActive }) => (
              <Button className="w-full" active={isActive}>
                {phase.name}
              </Button>
            )}
          />
        )
      })}
    </div>
  )
}

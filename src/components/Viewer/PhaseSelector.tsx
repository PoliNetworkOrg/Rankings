import { NavLink } from "react-router-dom"
import { PhaseLink } from "../../utils/types/data/parsed/Index/RankingFile"
import Button from "../custom-ui/Button"

type Props = {
  phasesLinks?: PhaseLink[]
}

export default function PhaseSelector({ phasesLinks }: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      {phasesLinks?.map(phase => {
        return (
          <NavLink
            className="max-sm:w-full"
            to={`../${phase.href}`}
            relative="path"
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

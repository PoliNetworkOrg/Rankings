import { Loader } from "@tanstack/react-loaders"
import type Data from "@/utils/data/data"
import { NotFoundError } from "@/utils/errors"
import type School from "@/utils/types/data/School"

type Props = {
  school: School
  year: number
  phase: string
  data: Data
}

export const rankingLoader = new Loader({
  fn: async (props: Props) => {
    const { school, year, phase, data } = props
    const phases = await data.getPhases(school, year)
    const ranking = await data.loadRanking(school, year, phase)

    const phaseLink = phases?.all.find((p) => p.href === phase)
    const phaseGroup = phaseLink && phases?.groups.get(phaseLink.group.value)

    if (!ranking || !phases) throw new NotFoundError()
    return { ranking, phases, data, phaseLink, phaseGroup }
  },
})

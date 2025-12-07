import { Loader } from "@tanstack/react-loaders"
import type Data from "@/utils/data/data"
import { NotFoundError } from "@/utils/errors"
import type School from "@/utils/types/data/School"

type LoaderProps = {
  school: School
  year: number
  data: Data
}

export const choosePhaseLoader = new Loader({
  fn: async ({ school, year, data }: LoaderProps) => {
    const phases = await data.getPhases(school, year)
    if (!phases) throw new NotFoundError()
    return { phases }
  },
})

import { Loader } from "@tanstack/react-loaders"
import type Data from "@/utils/data/data"
import { NotFoundError } from "@/utils/errors"
import type School from "@/utils/types/data/School"

type Props = {
  school: School
  data: Data
}

export const chooseYearLoader = new Loader({
  fn: async ({ school, data }: Props) => {
    const years = data.getYears(school)
    if (!years) throw new NotFoundError()
    return { years }
  },
})

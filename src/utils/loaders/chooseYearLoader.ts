import { Loader } from "@tanstack/react-loaders"
import Data from "@/utils/data/data"
import School from "@/utils/types/data/School"
import { NotFoundError } from "@/utils/errors"

type Props = {
  school: School
  data: Data
}

export const chooseYearLoader = new Loader({
  fn: async ({ school, data }: Props) => {
    const years = data.getYears(school)
    if (!years) throw new NotFoundError()
    return { years }
  }
})

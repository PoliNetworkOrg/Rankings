import { Loader } from "@tanstack/react-loaders";
import Data from "@/utils/data/data";
import School from "@/utils/types/data/School";
import { NotFoundError } from "@/utils/errors";

type LoaderProps = {
  school: School;
  year: number;
  data: Data;
};

export const choosePhaseLoader = new Loader({
  fn: async ({ school, year, data }: LoaderProps) => {
    const phases = await data.getPhasesLinks(school, year);
    if (!phases) throw new NotFoundError();
    return { phases };
  },
});

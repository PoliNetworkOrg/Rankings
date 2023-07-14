import { Loader } from "@tanstack/react-loaders";
import Data from "@/utils/data/data";
import School from "@/utils/types/data/School";
import { NotFoundError } from "@/utils/errors";

type Props = {
  school: School;
  year: number;
  phase: string;
  data: Data;
};

export const rankingLoader = new Loader({
  fn: async (props: Props) => {
    const { school, year, phase, data } = props;
    const ranking = await data.loadRanking(school, year, phase);

    if (!ranking) throw new NotFoundError();
    return { ranking, data };
  },
});

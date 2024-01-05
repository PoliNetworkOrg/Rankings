import { Link, Navigate, Route, ErrorComponent } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import School from "@/utils/types/data/School";
import { NotFoundError } from "@/utils/errors";
import { homepageRoute } from ".";
import { ButtonGrid } from "@/components/Homepage/ButtonGrid";
import {
  PhaseGroup,
  PhaseLink,
} from "@/utils/types/data/parsed/Index/RankingFile";
import { NO_GROUP } from "@/utils/constants";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import Data from "@/utils/data/data";

const STALE_TIME = 60_000; // 1 minute

const choosePhaseQueryOptions = (
  pData: Promise<Data>,
  school: School,
  year: number,
) =>
  queryOptions({
    queryKey: ["choosePhase", school, year],
    queryFn: async () => {
      const data = await pData;
      const phases = await data.getPhases(school, year);
      if (!phases) throw new NotFoundError();
      return { phases };
    },
    staleTime: STALE_TIME,
  });

export const choosePhaseRoute = new Route({
  getParentRoute: () => homepageRoute,
  path: "/$school/$year",
  parseParams: ({ school, year }) => ({
    school: school as School,
    year: Number(year),
  }),
  staleTime: STALE_TIME,
  loader: async ({
    context: { queryClient, data },
    params: { school, year },
  }) =>
    queryClient.ensureQueryData(choosePhaseQueryOptions(data, school, year)),

  errorComponent: function ErrorChoosePhase({ error }) {
    if (error instanceof NotFoundError)
      return <Navigate from={choosePhaseRoute.fullPath} to=".." />;

    return <ErrorComponent error={error} />;
  },
  component: ChoosePhase,
});

function ChoosePhase() {
  const { school, year } = choosePhaseRoute.useParams();
  const { data } = choosePhaseRoute.useRouteContext();
  const { phases } = useSuspenseQuery(
    choosePhaseQueryOptions(data, school, year),
  ).data;

  return (
    <>
      <p className="w-full text-xl">Scegli una graduatoria</p>
      {phases.groups.valuesArr().map((group) => (
        <Group
          group={group}
          phases={group.phases}
          school={school}
          year={year}
          key={group.value}
        />
      ))}
    </>
  );
}

type GroupProps = ButtonsProps & {
  group: PhaseGroup;
};

function Group({ group, ...props }: GroupProps) {
  return (
    <>
      {group.value !== NO_GROUP && <p>{group.label}</p>}
      <Buttons {...props} />
    </>
  );
}

type ButtonsProps = {
  school: School;
  year: number;
  phases: PhaseLink[];
};

function Buttons({ school, year, phases }: ButtonsProps) {
  return (
    <ButtonGrid length={phases.length}>
      {phases.map((phase) => (
        <Link
          to="/view/$school/$year/$phase"
          params={{ school, year, phase: phase.href }}
          key={phase.href}
          className="h-full"
        >
          <Button size="card" variant="secondary" className="h-full w-full">
            <span className="text-base">{phase.name}</span>
          </Button>
        </Link>
      ))}
    </ButtonGrid>
  );
}

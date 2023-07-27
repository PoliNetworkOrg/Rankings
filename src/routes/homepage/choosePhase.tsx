import { Link, Navigate, Route, ErrorComponent } from "@tanstack/router";
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

export const choosePhaseRoute = new Route({
  getParentRoute: () => homepageRoute,
  path: "/$school/$year",
  parseParams: ({ school, year }) => ({
    school: school as School,
    year: Number(year),
  }),
  loader: async ({ context, params }) => {
    const data = await context.data;
    const variables = { ...params, data };

    const { choosePhase } = context.loaderClient.loaders;

    const result = await choosePhase.load({ variables });
    return result;
  },
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError)
      return <Navigate from={choosePhaseRoute.fullPath} to=".." />;

    return <ErrorComponent error={error} />;
  },
  component: function ChoosePhase({ useParams, useLoader }) {
    const { groups } = useLoader().phases;
    const { school, year } = useParams();

    return (
      <>
        <p className="w-full text-xl">Scegli una graduatoria</p>
        <>
          {groups.valuesArr().map((group) => (
            <Group
              group={group}
              phases={group.phases}
              school={school}
              year={year}
              key={group.value}
            />
          ))}
        </>
      </>
    );
  },
});

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

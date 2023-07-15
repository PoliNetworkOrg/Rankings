import { Link, Navigate, Route, ErrorComponent } from "@tanstack/router";
import { Button } from "@/components/ui/button";
import School from "@/utils/types/data/School";
import { NotFoundError } from "@/utils/errors";
import { homepageRoute } from ".";
import { ButtonGrid } from "@/components/Homepage/ButtonGrid";

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
    const { phases } = useLoader();
    const { school, year } = useParams();

    return (
      <>
        <p className="w-full text-xl">Scegli una graduatoria</p>
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
      </>
    );
  },
});

import { ErrorComponent, Link, Navigate, Route } from "@tanstack/react-router";
import School from "@/utils/types/data/School";
import { Button } from "@/components/ui/button";
import { NotFoundError } from "@/utils/errors";
import { homepageRoute } from ".";
import { ButtonGrid } from "@/components/Homepage/ButtonGrid";
import Spinner from "@/components/custom-ui/Spinner";
import { useState } from "react";
import Data from "@/utils/data/data";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

const STALE_TIME = 60_000; // 1 minute

const chooseYearQueryOptions = (pData: Promise<Data>, school: School) =>
  queryOptions({
    queryKey: ["chooseYear", school],
    queryFn: async () => {
      const data = await pData;
      const years = data.getYears(school);
      if (!years) throw new NotFoundError();
      return { years };
    },
    staleTime: STALE_TIME,
  });

export const chooseYearRoute = new Route({
  getParentRoute: () => homepageRoute,
  path: "$school",
  parseParams: ({ school }) => ({
    school: school as School,
  }),
  staleTime: STALE_TIME,
  loader: async ({ context: { queryClient, data }, params: { school } }) =>
    queryClient.ensureQueryData(chooseYearQueryOptions(data, school)),
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) return <Navigate to="/" />;

    return <ErrorComponent error={error} />;
  },
  component: ChooseYear,
});

function ChooseYear() {
  const { school } = chooseYearRoute.useParams();
  const { data } = chooseYearRoute.useRouteContext();
  const { years } = useSuspenseQuery(chooseYearQueryOptions(data, school)).data;

  const [clicked, setClicked] = useState(false);

  return clicked ? (
    <div className="w-full">
      <Spinner />
    </div>
  ) : (
    <>
      <p className="w-full text-xl">Scegli un anno di immatricolazione</p>
      <ButtonGrid length={years.length}>
        {years
          .sort((a, b) => b - a)
          .map((year) => (
            <Link
              to="/home/$school/$year"
              params={{ school, year }}
              key={year}
              className="h-full"
              onClick={() => setClicked(true)}
            >
              <Button size="card" variant="secondary" className="h-full w-full">
                <span className="text-lg">{year}</span>
              </Button>
            </Link>
          ))}
      </ButtonGrid>
    </>
  );
}

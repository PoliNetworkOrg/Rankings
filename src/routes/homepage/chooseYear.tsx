import { ErrorComponent, Link, Navigate, Route } from "@tanstack/router";
import School from "@/utils/types/data/School";
import { Button } from "@/components/ui/button";
import { NotFoundError } from "@/utils/errors";
import { homepageRoute } from ".";
import { ButtonGrid } from "@/components/Homepage/ButtonGrid";

export const chooseYearRoute = new Route({
  getParentRoute: () => homepageRoute,
  path: "$school",
  parseParams: ({ school }) => ({
    school: school as School,
  }),
  loader: async ({ context, params }) => {
    const data = await context.data;
    const variables = { ...params, data };

    const loader = context.loaderClient.loaders.chooseYear;
    const result = await loader.load({ variables });

    return result;
  },
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) return <Navigate to="/" />;

    return <ErrorComponent error={error} />;
  },
  component: function ChooseYear({ useLoader, useParams }) {
    const { years } = useLoader();
    const { school } = useParams();

    return (
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
              >
                <Button
                  size="card"
                  variant="secondary"
                  className="h-full w-full"
                >
                  <span className="text-lg">{year}</span>
                </Button>
              </Link>
            ))}
        </ButtonGrid>
      </>
    );
  },
});

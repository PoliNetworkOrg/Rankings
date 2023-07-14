import { Link, Route } from "@tanstack/router";
import { Button } from "@/components/ui/button";
import { homepageRoute } from ".";
import { ButtonGrid } from "@/components/Homepage/ButtonGrid";

export const chooseSchoolRoute = new Route({
  getParentRoute: () => homepageRoute,
  path: "/",
  loader: async ({ context }) => {
    const { data } = context;
    return await data;
  },
  component: function ChooseSchool({ useLoader }) {
    const data = useLoader();

    return (
      <>
        <h3 className="w-full text-2xl font-bold">
          Benvenuto nello storico delle graduatorie del{" "}
          <span className="whitespace-nowrap">Politecnico di Milano!</span>
        </h3>
        <p className="w-full text-xl">
          Inizia scegliendo la scuola di tuo interesse
        </p>
        <ButtonGrid length={data.schools.length}>
          {data.schools.map((school) => (
            <Link
              to="/home/$school"
              params={{ school: school }}
              key={school}
              className="h-full"
            >
              <Button size="card" variant="secondary" className="h-full w-full">
                <span className="text-lg">{school}</span>
              </Button>
            </Link>
          ))}
        </ButtonGrid>
      </>
    );
  },
});

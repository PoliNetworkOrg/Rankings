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
          👋 Ciao!{" "}
          <span className="whitespace-nowrap">Questo sito raccoglie</span>{" "}
          <span className="whitespace-nowrap">lo storico</span>{" "}
          <span className="whitespace-nowrap">delle graduatorie</span>{" "}
          <span className="whitespace-nowrap">del Politecnico di Milano.</span>
        </h3>
        <p className="w-full text-xl">
          Inizia scegliendo la Scuola di tuo interesse
        </p>
        <ButtonGrid length={data.schools.length}>
          {data.schools.sort().map((school) => (
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

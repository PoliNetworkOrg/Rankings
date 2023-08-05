import { Link, Route } from "@tanstack/router";
import { Button } from "@/components/ui/button";
import { homepageRoute } from ".";
import { ButtonGrid } from "@/components/Homepage/ButtonGrid";
import DevSettings from "@/components/DevSettings";

export const chooseSchoolRoute = new Route({
  getParentRoute: () => homepageRoute,
  path: "/",
  loader: async ({ context }) => {
    const { data, isDev } = context;
    const awaitedData = await data;
    return { data: awaitedData, isDev };
  },
  component: function ChooseSchool({ useLoader }) {
    const { data, isDev } = useLoader();

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
          Inizia scegliendo l'area di studi di tuo interesse
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
        {isDev && <DevSettings data={data} />}
      </>
    );
  },
});

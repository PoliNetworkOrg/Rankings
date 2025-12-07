import { Link, Route } from "@tanstack/router"
import DevSettings from "@/components/DevSettings"
import { ButtonGrid } from "@/components/Homepage/ButtonGrid"
import { Button } from "@/components/ui/button"
import type School from "@/utils/types/data/School"
import { homepageRoute } from "."

function getSchoolEmoji(school: School) {
  switch (school) {
    case "Architettura":
      return <span className="mr-2 rotate-[270deg] text-lg">&#128208;</span>
    case "Design":
      return <span className="mr-2 text-lg">&#128396;&#65039;</span>
    case "Ingegneria":
      return <span className="mr-2 text-lg">&#128736;&#65039;</span>
    case "Urbanistica":
      return <span className="mr-2 text-lg">&#127969;</span>
  }
}

export const chooseSchoolRoute = new Route({
  getParentRoute: () => homepageRoute,
  path: "/",
  loader: async ({ context }) => {
    const { data, devData, isDev } = context
    const awaitedData = await data
    const awaitedDevData = await devData
    return { data: awaitedData, devData: awaitedDevData, isDev }
  },
  component: function ChooseSchool({ useLoader }) {
    const { data, devData, isDev } = useLoader()

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
                {getSchoolEmoji(school)}
                <span className="text-lg">{school}</span>
              </Button>
            </Link>
          ))}
        </ButtonGrid>
        {isDev && <DevSettings stableData={data} mainData={devData} />}
      </>
    )
  },
})

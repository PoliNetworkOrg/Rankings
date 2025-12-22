import type { School } from "@/utils/types/data/school"

export function SchoolEmoji({ school }: { school: School }) {
  switch (school) {
    case "Architettura":
      return <span className="mr-2 rotate-270 text-lg">&#128208;</span>
    case "Design":
      return <span className="mr-2 text-lg">&#128396;&#65039;</span>
    case "Ingegneria":
      return <span className="mr-2 text-lg">&#128736;&#65039;</span>
    case "Urbanistica":
      return <span className="mr-2 text-lg">&#127969;</span>
  }
}

export const LINKS = {
  polinetworkMain: "https://polinetwork.org",
  githubSource: {
    web: "https://github.com/PoliNetworkOrg/Rankings",
    dati: "https://github.com/PoliNetworkOrg/rankings-dati",
    script: "https://github.com/PoliNetworkOrg/rankings-backend-go",
  },
  issuesUrl: "https://github.com/PoliNetworkOrg/Rankings/issues",
  dataRepoUrlRaw:
    "https://raw.githubusercontent.com/PoliNetworkOrg/rankings-data",
  dataRepoUrl: "https://github.com/PoliNetworkOrg/rankings-data",
  githubPreviewDomain: "polinetworkorg.github.io",
} as const

export enum DATA_REF {
  STABLE = "stable",
  MAIN = "main",
}

export const DATA_SOURCE = { github: "github", local: "local" } as const

export const SCHOOLS = [
  "Architettura",
  "Ingegneria",
  "Design",
  "Urbanistica",
] as const

export const ALERT_LEVELS = ["error", "warning", "success", "info"] as const

export const ABS_ORDER = "absorder" as const
export const NO_GROUP = "__no_group__"

export const SALT = "saltPoliNetwork" as const

export const LOCAL_STORAGE = {
  darkMode: "pnr_dark_mode",
  searchedStudentId: "pnr_searched_student_id",
}

type Credit = {
  name: string
  role?: string
  tgLink?: string
}
export const CREDITS: Credit[] = [
  {
    name: "Lorenzo Corallo",
    role: "Developer",
    tgLink: "https://t.me/lorenzocorallo",
  },
  {
    name: "Tommaso Morganti",
    role: "Developer",
    tgLink: "https://t.me/toto04_1",
  },
  {
    name: "Giovanni Malausa",
    role: "Designer",
    tgLink: "https://t.me/giovannimalausa",
  },
]

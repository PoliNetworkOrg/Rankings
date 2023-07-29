export const LINKS = {
  polinetworkMain: "https://polinetwork.org",
  githubSource: "https://github.com/PoliNetworkOrg/Rankings",
  dataRepoUrlRaw:
    "https://raw.githubusercontent.com/PoliNetworkOrg/RankingsDati",
  dataRepoUrl: "https://github.com/PoliNetworkOrg/RankingsDati",
  githubPreviewDomain: "polinetworkorg.github.io",
} as const;

export enum DATA_REF {
  STABLE = "stable",
  MAIN = "main",
}

export const SCHOOLS = [
  "Architettura",
  "Ingegneria",
  "Design",
  "Urbanistica",
] as const;

export const ALERT_LEVELS = ["error", "warning", "success", "info"] as const;

export const ABS_ORDER = "absorder" as const;
export const NO_GROUP = "__no_group__";

export const SALT = "saltPoliNetwork" as const;

export const LOCAL_STORAGE = {
  darkMode: "pnr_dark_mode",
};

import urlJoin from "url-join"
import { LINKS } from "./constants"

const LOCAL_HTTP_SERVER = "http://localhost:6767"
function getProdRef(ref: "main"): string {
  return urlJoin(LINKS.dataRepoUrlRaw, `/refs/heads/${ref}/data/`)
}

export function getDataUrl(path: string): string {
  const base =
    import.meta.env.PROD || import.meta.env.VITE_USE_PROD_DATA
      ? getProdRef("main")
      : LOCAL_HTTP_SERVER

  return urlJoin(base, path)
}

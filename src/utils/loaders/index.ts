import { LoaderClient } from "@tanstack/react-loaders"
import { choosePhaseLoader } from "./choosePhaseLoader"
import { chooseYearLoader } from "./chooseYearLoader"
import { rankingLoader } from "./rankingLoader"

export const loaderClient = new LoaderClient({
  getLoaders: () => ({
    ranking: rankingLoader,
    choosePhase: choosePhaseLoader,
    chooseYear: chooseYearLoader,
  }),
})

declare module "@tanstack/react-loaders" {
  interface Register {
    loaderClient: typeof loaderClient
  }
}

import { LoaderClient } from "@tanstack/react-loaders";
import { rankingLoader } from "./rankingLoader";
import { choosePhaseLoader } from "./choosePhaseLoader";
import { chooseYearLoader } from "./chooseYearLoader";

export const loaderClient = new LoaderClient({
  loaders: [rankingLoader, choosePhaseLoader, chooseYearLoader],
});

declare module "@tanstack/react-loaders" {
  interface Register {
    loaderClient: typeof loaderClient;
  }
}

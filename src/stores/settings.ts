import { persistentMap } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";

type Settings = {
  accessToken: string;
}

export const settingsStore = persistentMap<Settings>(
  "settings:",
  {
    accessToken: ""
  },
);

logger({
  settingsStore: settingsStore,
});
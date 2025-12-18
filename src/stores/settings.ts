import { persistentMap } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";


type Settings = {
  accessToken: string;
}


// Store Management
export const settingsStore = persistentMap<Settings>(
  "settings:",
  {
    accessToken: ""
  },
);

// Logger
logger({
  feedStore: settingsStore,
});
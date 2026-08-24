import { snackShopDataset } from "./snackShop";
import { musicStoreDataset } from "./musicStore";
import { tradingCoDataset } from "./tradingCo";
import { libraryDataset } from "./library";
import { leaderboardDataset } from "./leaderboard";
import type { Dataset } from "./types";

export const builtInDatasets: Dataset[] = [
  snackShopDataset,
  musicStoreDataset,
  tradingCoDataset,
  libraryDataset,
  leaderboardDataset,
];

export function getBuiltInDataset(id: string): Dataset | undefined {
  return builtInDatasets.find((d) => d.id === id);
}

export type { Dataset, DatasetTable, DatasetColumn } from "./types";

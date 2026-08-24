import { snackShopDataset } from "./snackShop";
import { musicStoreDataset } from "./musicStore";
import { tradingCoDataset } from "./tradingCo";
import type { Dataset } from "./types";

export const builtInDatasets: Dataset[] = [snackShopDataset, musicStoreDataset, tradingCoDataset];

export function getBuiltInDataset(id: string): Dataset | undefined {
  return builtInDatasets.find((d) => d.id === id);
}

export type { Dataset, DatasetTable, DatasetColumn } from "./types";

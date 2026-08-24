"use client";

import { useState } from "react";
import { DatasetPicker } from "./DatasetPicker";
import { SqlExplorer } from "./SqlExplorer";
import type { Dataset } from "@/lib/datasets/types";

export function ExplorePage() {
  const [dataset, setDataset] = useState<Dataset | null>(null);

  if (!dataset) {
    return <DatasetPicker onSelect={setDataset} />;
  }

  return <SqlExplorer dataset={dataset} onBack={() => setDataset(null)} />;
}

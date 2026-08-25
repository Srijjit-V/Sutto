"use client";

import { useRef, useState } from "react";
import { Database, Upload } from "lucide-react";
import { builtInDatasets } from "@/lib/datasets";
import { parseCsvToDataset, CsvImportError } from "@/lib/datasets/csvImport";
import type { Dataset } from "@/lib/datasets/types";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB — plenty for a teaching CSV

export function DatasetPicker({ onSelect }: { onSelect: (dataset: Dataset) => void }) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploadError(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Please upload a .csv file (export Excel sheets as CSV first).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("That file is too large (max 2MB for now).");
      return;
    }
    setUploading(true);
    try {
      const text = await file.text();
      const dataset = parseCsvToDataset(text, file.name);
      onSelect(dataset);
    } catch (err) {
      setUploadError(err instanceof CsvImportError ? err.message : "Couldn't read that file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="font-heading text-2xl font-extrabold mb-1">Explore</h1>
      <p className="mb-6 text-[var(--muted-foreground)]">
        Pick a dataset and run any SQL you want — no challenges, no checking, just explore.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {builtInDatasets.map((dataset, i) => (
          <button
            key={dataset.id}
            onClick={() => onSelect(dataset)}
            className="clay-card clay-card-interactive rise-in p-4 text-left flex flex-col gap-2 cursor-pointer"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Database className="size-6 text-[var(--primary)]" aria-hidden />
            <h2 className="font-bold">{dataset.name}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">{dataset.description}</p>
            <p className="text-xs font-mono text-[var(--muted-foreground)]">
              {dataset.tables.map((t) => t.name).join(", ")}
            </p>
          </button>
        ))}
      </div>

      <div className="clay-card p-5">
        <h2 className="font-bold mb-1 flex items-center gap-2">
          <Upload className="size-4" aria-hidden /> Bring your own data
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-3">
          Upload a CSV file — the first row should be column headers. Column types (number vs.
          text) are guessed automatically. (Excel/.xlsx isn&apos;t supported directly yet — export
          your sheet as CSV first. The usual CSV-import library for Excel had unpatched security
          advisories, so it&apos;s left out for now.)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="clay-btn px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm disabled:opacity-50"
        >
          {uploading ? "Reading file…" : "Choose CSV file"}
        </button>
        {uploadError && <p className="text-sm text-[var(--destructive)] mt-2">{uploadError}</p>}
      </div>
    </div>
  );
}

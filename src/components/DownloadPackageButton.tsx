"use client";

import { Download } from "lucide-react";

interface Props {
  fileName: string;
  content: string;
}

export function DownloadPackageButton({ fileName, content }: Props) {
  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="bg-primary text-primary-foreground font-body-md text-body-md font-bold py-3 px-6 rounded-lg hover:bg-primary-container transition-colors min-h-[48px] flex items-center gap-2"
    >
      <Download className="size-5" />
      Download Package
    </button>
  );
}

"use client";

import { useState } from "react";

import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import {
  OutputCollectionState,
  OutputFileEntry,
} from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

export default function FileUploader() {
  const [files, setFiles] = useState<OutputFileEntry[]>([]);

  function handleDone(e: OutputCollectionState) {
    const successfulFiles = e.allEntries.filter(
      (file) => file.status === "success"
    );
    setFiles(successfulFiles);

    console.log("Successful files:", successfulFiles);
    console.log("All files:", files);
  }

  return (
    <FileUploaderRegular
      pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
      onDoneClick={handleDone}
      maxLocalFileSizeBytes={10000000}
    />
  );
}

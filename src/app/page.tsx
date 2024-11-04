"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Folder, File } from "@prisma/client";
import { AxiosError } from "axios";
import { useEffect } from "react";

import { readFolders, readFiles } from "./query-functions";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();
  const {
    data: folders,
    status: foldersStatus,
    error: foldersError,
  } = useQuery<Folder[], AxiosError>({
    queryKey: ["folders"],
    queryFn: () => readFolders(user!.id),
  });
  const {
    data: files,
    status: filesStatus,
    error: filesError,
  } = useQuery<File[], AxiosError>({
    queryKey: ["files"],
    queryFn: () => readFiles(user!.id),
  });

  useEffect(() => {
    if (foldersStatus === "error" || filesStatus === "error") {
      const errorMessage =
        (foldersError?.response?.data as { error: string })?.error ||
        (filesError?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      if (foldersStatus === "success" && filesStatus === "success") {
        console.log("Folders:", folders);
        console.log("Files:", files);
      }
    }
  }, [
    foldersError,
    foldersStatus,
    folders,
    filesError,
    filesStatus,
    files,
    toast,
  ]);

  return <></>;
}

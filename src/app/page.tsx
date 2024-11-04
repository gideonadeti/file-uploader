"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Folder, File } from "@prisma/client";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { readFolders, readFiles } from "./query-functions";
import { FileOrFolder } from "./types";
import { DataTable } from "./components/data-table/table";
import { columns } from "./components/data-table/columns";
import { Spinner } from "@/components/spinner";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();

  const [items, setItems] = useState<FileOrFolder[]>([]);

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
    } else if (foldersStatus === "success" && filesStatus === "success") {
      const folderItems = folders
        .filter((folder) => folder.name !== "Root" && folder.parentId === null) // Exclude root folder
        .map((folder) => ({
          id: folder.id,
          name: folder.name,
          type: "folder",
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
        }));

      const fileItems = files.map((file) => ({
        id: file.id,
        name: file.name,
        type: "file",
        size: file.size,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      }));

      setItems([...folderItems, ...fileItems]);
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

  return (
    <div className="flex-grow px-8 py-4">
      {foldersStatus === "pending" || filesStatus === "pending" ? (
        <Spinner className="mx-auto" />
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </div>
  );
}

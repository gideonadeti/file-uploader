"use client";

import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Folder } from "@prisma/client";

import { Button } from "@/components/ui/button";
import AddFolder from "@/components/add-folder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface ActionsProps<TData> {
  row: Row<TData>;
}

export default function Actions<TData>({ row }: ActionsProps<TData>) {
  const folder = row.original as Folder;
  const [folderUpdateOpen, setFolderUpdateOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setFolderUpdateOpen(true)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>Download</DropdownMenuItem>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>

      <AddFolder
        open={folderUpdateOpen}
        onOpenChange={setFolderUpdateOpen}
        defaultValue={folder.name}
        folderUpdateId={folder.id}
      />
    </DropdownMenu>
  );
}

"use client";

import { useState } from "react";

// import FileUploader from "./file-uploader";
import { ModeToggler } from "@/components/mode-toggler";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import AddFolder from "./add-folder";
import UploadFile from "./upload-file";

export function AppSidebar() {
  const [openFolder, setOpenFolder] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <ModeToggler />
        <Button variant="outline" onClick={() => setOpenFolder(true)}>
          Add Folder
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button variant="outline" onClick={() => setOpenUpload(true)}>
            Upload File
          </Button>
        </SidebarGroup>
      </SidebarContent>
      <AddFolder
        open={openFolder}
        onOpenChange={setOpenFolder}
        defaultValue=""
        folderUpdateId=""
      />
      <UploadFile open={openUpload} setOpen={setOpenUpload} />
    </Sidebar>
  );
}

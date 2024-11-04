"use client";

import { useState } from "react";

// import FileUploader from "./file-uploader";
import { ModeToggler } from "@/components/mode-toggler";
import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import AddFolder from "./add-folder";

export function AppSidebar() {
  const [openFolder, setOpenFolder] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <ModeToggler />
        <Button variant="outline" onClick={() => setOpenFolder(true)}>
          Add Folder
        </Button>
      </SidebarHeader>
      <AddFolder open={openFolder} onOpenChange={setOpenFolder} />
    </Sidebar>
  );
}

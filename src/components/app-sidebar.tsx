import FileUploader from "./file-uploader";
import { ModeToggler } from "@/components/mode-toggler";
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarFooter className="flex flex-row items-center justify-between">
        <ModeToggler />
        <FileUploader />
      </SidebarFooter>
    </Sidebar>
  );
}

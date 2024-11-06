import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteFolder } from "@/app/query-functions";

export default function DeleteFolder({
  open,
  onOpenChange,
  folderDeleteId,
}: {
  folderDeleteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => deleteFolder(folderDeleteId),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });

      toast({
        description: message,
      });
      onOpenChange(false); // Close dialog after success
    },
    onError: (error) => {
      console.error(error);

      const errorMessage =
        (error.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast({
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  function handleDelete() {
    mutate();
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => isOpen && onOpenChange(isOpen)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this folder?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone, and all files in this folder will be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={status === "pending"}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={status === "pending"}
            onClick={handleDelete}
          >
            {status === "pending" ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

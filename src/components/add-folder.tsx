import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFolder } from "@/app/query-functions";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateFolder } from "@/app/query-functions";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function AddFolder({
  open,
  onOpenChange,
  defaultValue,
  folderUpdateId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue: string;
  folderUpdateId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {folderUpdateId ? "Update Folder" : "Create Folder"}
          </DialogTitle>
        </DialogHeader>
        <AddFolderForm
          defaultValue={defaultValue}
          folderUpdateId={folderUpdateId}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddFolderForm({
  defaultValue,
  folderUpdateId,
}: {
  defaultValue: string;
  folderUpdateId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: defaultValue || "" },
  });
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => {
      if (folderUpdateId) {
        return updateFolder(folderUpdateId, form.getValues("name"));
      } else {
        return createFolder(form.getValues("name"), user!.id);
      }
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
      form.reset({ name: "" });

      toast({
        description: message,
      });
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

  function onSubmit() {
    mutate();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

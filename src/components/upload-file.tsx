"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { AxiosError } from "axios";
import { Folder } from "@prisma/client";
import {
  OutputCollectionState,
  OutputFileEntry,
} from "@uploadcare/react-uploader";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

import { useToast } from "@/hooks/use-toast";
import { createFiles } from "@/app/query-functions";
import { Button } from "@/components/ui/button";
import { File } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  folderId: z.string(),
});

export default function UploadFile({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <UploadFileForm />
      </DialogContent>
    </Dialog>
  );
}

function UploadFileForm() {
  const { data: folders } = useQuery<Folder[]>({ queryKey: ["folders"] });
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { toast } = useToast();

  // Track form state and uploaded files
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [fileObjects, setFileObjects] = useState<OutputFileEntry[]>([]);

  const { mutate, status } = useMutation<string, AxiosError, File[]>({
    mutationFn: (files) =>
      createFiles(user!.id, form.getValues("folderId"), files),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });

      setFileObjects([]); // Clear the uploaded files
      toast({ description: message });
    },
    onError: (error) => {
      console.error(error);
      const description =
        (error.response?.data as { error: string })?.error ||
        "Something went wrong";
      toast({
        description,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit() {
    const files: File[] = [];

    fileObjects.forEach((fileObject) => {
      files.push({
        userId: user!.id,
        folderId: form.getValues("folderId"),
        name: fileObject.name,
        size: fileObject.size,
        url: fileObject.cdnUrl as string,
      });
    });

    mutate(files);
  }

  // Handle file upload completion
  function handleFileUpload(e: OutputCollectionState) {
    const successfulFiles = e.allEntries.filter(
      (file) => file.status === "success"
    );
    setFileObjects(successfulFiles);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Folder Selection */}
        <FormField
          control={form.control}
          name="folderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders?.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Uploader */}
        <FormItem>
          <FormLabel>Files</FormLabel>
          <FileUploaderRegular
            pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
            onDoneClick={handleFileUpload}
            maxLocalFileSizeBytes={10000000}
          />
          <FormDescription>You can upload one or more files.</FormDescription>
        </FormItem>

        {/* Submit Button */}
        <Button type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

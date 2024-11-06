export interface FileOrFolder {
  id: string;
  name: string;
  type: string;
  size?: string; // optional, only for files
  createdAt: Date;
  updatedAt: Date;
}

export interface File {
  userId: string;
  folderId: string;
  name: string;
  size: number;
  url: string;
}

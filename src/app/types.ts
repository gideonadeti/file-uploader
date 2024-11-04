export interface FileOrFolder {
  id: string;
  name: string;
  type: string;
  size?: string; // optional, only for files
  createdAt: Date;
  updatedAt: Date;
}

import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export async function readFolders(userId: string) {
  try {
    const folders = await prismaClient.folder.findMany({
      where: {
        userId,
      },
    });

    // Create root folder if it doesn't exist
    if (folders.length === 0) {
      const folder = await createFolder(userId, "Root");

      return [folder];
    }

    return folders;
  } catch (error) {
    console.error("Error reading folders:", error);

    throw error;
  }
}

export async function createFolder(userId: string, name: string) {
  try {
    const folder = await prismaClient.folder.create({
      data: {
        userId,
        name,
      },
    });

    return folder;
  } catch (error) {
    console.error("Error creating folder:", error);

    throw error;
  }
}

export async function readFiles(userId: string) {
  try {
    const files = await prismaClient.file.findMany({
      where: {
        userId,
      },
    });

    return files;
  } catch (error) {
    console.error("Error reading files:", error);

    throw error;
  }
}

export async function readFolder(name: string) {
  try {
    const folder = await prismaClient.folder.findFirst({
      where: {
        name,
      },
    });

    return folder;
  } catch (error) {
    console.error("Error reading folder:", error);

    throw error;
  }
}

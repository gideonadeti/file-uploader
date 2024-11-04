import axios from "axios";

export async function readFolders(userId: string) {
  try {
    const response = await axios.get("/api/folders", {
      params: {
        userId,
      },
    });

    return response.data.folders;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function readFiles(userId: string) {
  try {
    const response = await axios.get("/api/files", {
      params: {
        userId,
      },
    });

    return response.data.files;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function createFolder(name: string, userId: string) {
  try {
    const response = await axios.post("/api/folders", {
      name,
      userId,
    });

    return response.data.message;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

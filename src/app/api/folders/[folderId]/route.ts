import { NextRequest, NextResponse } from "next/server";

import { readFolder, updateFolder } from "../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  const { folderId } = await params;
  const { name } = await req.json();

  try {
    const folder = await readFolder(name.trim());

    if (folder) {
      return NextResponse.json(
        { error: "Folder name already exists." },
        { status: 400 }
      );
    }

    await updateFolder(folderId, name);

    return NextResponse.json(
      { message: "Folder updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating folder:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating folder." },
      { status: 500 }
    );
  }
}

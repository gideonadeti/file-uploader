import { NextRequest, NextResponse } from "next/server";

import { readFolders, createFolder, readFolder } from "../../../../prisma/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const folders = await readFolders(userId.trim());

    return NextResponse.json({ folders }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error reading folders." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { name, userId } = await req.json();

  if (!name || !userId) {
    return NextResponse.json(
      { error: "Name and userId are required" },
      { status: 400 }
    );
  }

  try {
    const folder = await readFolder(name.trim());

    if (folder) {
      return NextResponse.json(
        { error: "Folder already exists." },
        { status: 400 }
      );
    }

    await createFolder(userId.trim(), name.trim());

    return NextResponse.json(
      { message: "Folder created successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error creating folder." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

import { readFiles, createFiles } from "../../../../prisma/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const files = await readFiles(userId);

    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error reading files." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId, folderId, files } = await req.json();

  if (!userId || !folderId || !files) {
    return NextResponse.json(
      { error: "userId, folderId and files are required" },
      { status: 400 }
    );
  }

  try {
    await createFiles(userId, folderId, files);

    return NextResponse.json(
      { message: "Files created successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while creating files." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

import { readFolders } from "../../../../prisma/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const folders = await readFolders(userId);

    return NextResponse.json({ folders }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error reading folders." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { serverAuth } from "@/lib/server-auth";
import { updateLeaderboard } from "@/actions/admin/games";

export async function POST() {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await updateLeaderboard();

  if (result.success) {
    return NextResponse.json({ message: "Leaderboard updated successfully" });
  } else {
    return NextResponse.json(
      { error: "Failed to update leaderboard" },
      { status: 500 }
    );
  }
}

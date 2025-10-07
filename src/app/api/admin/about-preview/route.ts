import { NextResponse } from "next/server";
import { getAboutContent } from "@/actions/about-content";

export async function GET() {
  try {
    const content = await getAboutContent();

    return NextResponse.json({
      whoIAm: content.whoIAm || {},
      journey: content.journey || {},
      purpose: content.purpose || {},
      missionVision: content.missionVision || {},
    });
  } catch (error) {
    console.error("Error fetching about preview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch about preview data" },
      { status: 500 }
    );
  }
}

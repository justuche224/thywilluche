import { NextResponse } from "next/server";
import { getNgoContent } from "@/actions/ngo-content";

export async function GET() {
  try {
    const content = await getNgoContent();

    return NextResponse.json({
      hero: content.hero || {},
      mission: content.mission || {},
      vision: content.vision || {},
      programs: content.programs || {},
      education: content.education || {},
      healthcare: content.healthcare || {},
      development: content.development || {},
      impact: content.impact || {},
      cta: content.cta || {},
    });
  } catch (error) {
    console.error("Error fetching NGO preview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch NGO preview data" },
      { status: 500 }
    );
  }
}

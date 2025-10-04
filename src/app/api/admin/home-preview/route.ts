import { getHomeContent } from "@/actions/home-content";
import { getSocials } from "@/actions/contact-info";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const content = await getHomeContent();
    const socials = await getSocials();

    return NextResponse.json({
      hero: content.hero || {},
      whoIAm: content.whoIAm || {},
      socials,
    });
  } catch (error) {
    console.error("Error fetching preview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch preview data" },
      { status: 500 }
    );
  }
}

import { getServiceSection } from "@/actions/services-content";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const overviewData = await getServiceSection("overview");
    const coachingData = await getServiceSection("coaching");
    const ghostwritingData = await getServiceSection("ghostwriting");
    const consultingData = await getServiceSection("consulting");

    return NextResponse.json({
      overview: overviewData || {},
      coaching: coachingData || {},
      ghostwriting: ghostwritingData || {},
      consulting: consultingData || {},
    });
  } catch (error) {
    console.error("Error fetching services preview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch services preview data" },
      { status: 500 }
    );
  }
}

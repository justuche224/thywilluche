import { NextRequest, NextResponse } from "next/server";
import { getCitiesOfState } from "@countrystatecity/countries";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryIso2 = searchParams.get("countryIso2");
    const stateIso2 = searchParams.get("stateIso2");

    if (!countryIso2 || !stateIso2) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          error: "Country and State ISO2 codes are required",
        },
        { status: 400 }
      );
    }

    const cities = await getCitiesOfState(countryIso2, stateIso2);
    return NextResponse.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error:
          error instanceof Error ? error.message : "Failed to fetch cities",
      },
      { status: 500 }
    );
  }
}

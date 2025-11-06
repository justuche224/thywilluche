import { NextRequest, NextResponse } from "next/server";
import { getStatesOfCountry } from "@countrystatecity/countries";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryIso2 = searchParams.get("countryIso2");

    if (!countryIso2) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          error: "Country ISO2 code is required",
        },
        { status: 400 }
      );
    }

    const states = await getStatesOfCountry(countryIso2);
    return NextResponse.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error:
          error instanceof Error ? error.message : "Failed to fetch states",
      },
      { status: 500 }
    );
  }
}

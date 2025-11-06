import { NextResponse } from "next/server";
import { getCountries } from "@countrystatecity/countries";

export async function GET() {
  try {
    const countries = await getCountries();
    return NextResponse.json({
      success: true,
      data: countries,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error:
          error instanceof Error ? error.message : "Failed to fetch countries",
      },
      { status: 500 }
    );
  }
}

"use server";

import {
  getCountries,
  getStatesOfCountry,
  getCitiesOfState,
} from "@countrystatecity/countries";

export async function fetchCountries() {
  try {
    const countries = await getCountries();
    return {
      success: true,
      data: countries,
    };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return {
      success: false,
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to fetch countries",
    };
  }
}

export async function fetchStates(countryIso2: string) {
  try {
    if (!countryIso2) {
      return {
        success: false,
        data: [],
        error: "Country ISO2 code is required",
      };
    }

    const states = await getStatesOfCountry(countryIso2);
    return {
      success: true,
      data: states,
    };
  } catch (error) {
    console.error("Error fetching states:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch states",
    };
  }
}

export async function fetchCities(countryIso2: string, stateIso2: string) {
  try {
    if (!countryIso2 || !stateIso2) {
      return {
        success: false,
        data: [],
        error: "Country and State ISO2 codes are required",
      };
    }

    const cities = await getCitiesOfState(countryIso2, stateIso2);
    return {
      success: true,
      data: cities,
    };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch cities",
    };
  }
}

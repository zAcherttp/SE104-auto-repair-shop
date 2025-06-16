"use server";

import { ApiResponse, CarBrand } from "@/lib/type";
import { supabase } from "@/lib/supabase";

export async function fetchCarBrands(): Promise<ApiResponse<CarBrand[]>> {
  try {
    const { data, error } = await supabase.rpc("get_all_brands");
    if (error) throw error;

    const baseUrl =
      "https://jueekjhwpelvczabbwli.supabase.co/storage/v1/object/public/";

    const carBrands: CarBrand[] = data.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
      authorized: brand.authorized,
      logo_path: brand.logo ? baseUrl + String(brand.logo) : null,
    }));

    console.log("Fetched car brands:", carBrands);

    return { data: carBrands, error: null };
  } catch (error) {
    return {
      error: new Error("Failed to fetch car brands"),
      data: undefined,
    };
  }
}

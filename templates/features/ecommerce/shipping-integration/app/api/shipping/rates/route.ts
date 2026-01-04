import { NextRequest, NextResponse } from "next/server";
import { getShippingRates, Address, Package } from "@/lib/shipping/carriers";
import { validateAddress } from "@/lib/shipping/rate-calculator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destination, packages } = body;

    // Validate destination address
    const validation = validateAddress(destination as Address);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid address", details: validation.errors },
        { status: 400 }
      );
    }

    // Get shipping rates
    const rates = await getShippingRates(
      origin as Address,
      destination as Address,
      packages as Package[]
    );

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Failed to get shipping rates:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping rates" },
      { status: 500 }
    );
  }
}


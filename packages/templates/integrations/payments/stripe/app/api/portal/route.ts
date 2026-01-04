import { NextResponse } from "next/server";
import { createPortalSession, getOrCreateCustomer } from "@/lib/stripe/server";
import { getUser } from "@/lib/supabase/server";

export async function POST() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer({
      email: user.email!,
      userId: user.id,
    });

    // Create portal session
    const session = await createPortalSession({
      customerId: customer.id,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}


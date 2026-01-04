import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, CheckoutItem } from "@/lib/billing/stripe-checkout";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, successUrl, cancelUrl, customerEmail, metadata } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    const checkoutItems: CheckoutItem[] = items.map((item: Record<string, unknown>) => ({
      name: item.name as string,
      description: item.description as string | undefined,
      amount: item.amount as number,
      quantity: item.quantity as number || 1,
      image: item.image as string | undefined,
    }));

    const session = await createCheckoutSession(
      checkoutItems,
      successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      { customerEmail, metadata }
    );

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}


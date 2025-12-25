import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "../../../../lib/paddle";
import { createServerSupabaseClient } from "../../../../lib/supabase";

// Paddle webhook event types
interface PaddleWebhookEvent {
  event_id: string;
  event_type: string;
  occurred_at: string;
  notification_id: string;
  data: {
    id: string;
    status?: string;
    customer_id?: string;
    custom_data?: {
      userId?: string;
      plan?: string;
    };
    items?: Array<{
      price?: {
        id: string;
      };
    }>;
    current_billing_period?: {
      ends_at: string;
    };
    [key: string]: any;
  };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing paddle-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhook(rawBody, signature);
    if (!isValid) {
      console.error("Webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Parse the webhook event
    const event: PaddleWebhookEvent = JSON.parse(rawBody);
    const supabase = await createServerSupabaseClient();

    switch (event.event_type) {
      case "transaction.completed": {
        // Payment successful - subscription created or renewed
        const data = event.data;
        const userId = data.custom_data?.userId;
        const plan = data.custom_data?.plan;

        if (userId && plan) {
          await supabase
            .from("users")
            .update({
              subscription_plan: plan,
              subscription_status: "active",
              paddle_customer_id: data.customer_id,
              paddle_subscription_id: data.id,
            })
            .eq("id", userId);
        }
        break;
      }

      case "subscription.created":
      case "subscription.activated": {
        const data = event.data;
        const customerId = data.customer_id;

        // Find user by Paddle customer ID
        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("paddle_customer_id", customerId)
          .single();

        if (users) {
          const priceId = data.items?.[0]?.price?.id;

          // Determine plan from price ID
          let plan = "pro"; // default
          if (priceId === process.env.PADDLE_TEAM_PRICE_ID) {
            plan = "team";
          }

          await supabase
            .from("users")
            .update({
              subscription_plan: plan,
              subscription_status: data.status || "active",
              paddle_subscription_id: data.id,
              subscription_period_end: data.current_billing_period?.ends_at,
            })
            .eq("id", users.id);
        }
        break;
      }

      case "subscription.updated": {
        const data = event.data;
        const customerId = data.customer_id;

        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("paddle_customer_id", customerId)
          .single();

        if (users) {
          await supabase
            .from("users")
            .update({
              subscription_status: data.status,
              subscription_period_end: data.current_billing_period?.ends_at,
            })
            .eq("id", users.id);
        }
        break;
      }

      case "subscription.canceled": {
        const data = event.data;
        const customerId = data.customer_id;

        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("paddle_customer_id", customerId)
          .single();

        if (users) {
          await supabase
            .from("users")
            .update({
              subscription_plan: "free",
              subscription_status: "canceled",
              paddle_subscription_id: null,
            })
            .eq("id", users.id);
        }
        break;
      }

      case "subscription.paused": {
        const data = event.data;
        const customerId = data.customer_id;

        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("paddle_customer_id", customerId)
          .single();

        if (users) {
          await supabase
            .from("users")
            .update({
              subscription_status: "paused",
            })
            .eq("id", users.id);
        }
        break;
      }

      case "subscription.past_due": {
        const data = event.data;
        const customerId = data.customer_id;

        const { data: users } = await supabase
          .from("users")
          .select("id")
          .eq("paddle_customer_id", customerId)
          .single();

        if (users) {
          await supabase
            .from("users")
            .update({
              subscription_status: "past_due",
            })
            .eq("id", users.id);
        }
        break;
      }

      default:
        console.log(`Unhandled Paddle event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Paddle webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


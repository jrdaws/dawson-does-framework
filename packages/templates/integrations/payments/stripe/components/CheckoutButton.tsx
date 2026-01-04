"use client";

import { useState } from "react";
import { getStripe } from "@/lib/stripe/client";

interface CheckoutButtonProps {
  priceId: string;
  children: React.ReactNode;
  className?: string;
}

export function CheckoutButton({
  priceId,
  children,
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        console.error("Checkout error:", error);
        alert("Failed to start checkout. Please try again.");
        return;
      }

      const stripe = await getStripe();
      if (!stripe) {
        console.error("Stripe failed to load");
        return;
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}


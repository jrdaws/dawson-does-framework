"use client";

import { useState } from "react";

interface BillingPortalButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function BillingPortalButton({
  children,
  className,
}: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const { url, error } = await response.json();

      if (error) {
        console.error("Portal error:", error);
        alert("Failed to open billing portal. Please try again.");
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error("Portal error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Loading..." : children}
    </button>
  );
}


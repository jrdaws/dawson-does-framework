"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProviderBase
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
          colorText: "hsl(var(--foreground))",
          colorInputBackground: "hsl(var(--input))",
          colorInputText: "hsl(var(--foreground))",
          borderRadius: "0.5rem",
        },
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-primary-foreground",
          card: "bg-card border border-border shadow-sm",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton:
            "bg-muted hover:bg-muted/80 border-border text-foreground",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-input border-border text-foreground",
          footerActionLink: "text-primary hover:text-primary/80",
          identityPreviewText: "text-foreground",
          identityPreviewEditButton: "text-primary",
        },
      }}
    >
      {children}
    </ClerkProviderBase>
  );
}


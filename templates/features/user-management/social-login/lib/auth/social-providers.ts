/**
 * Social Authentication Providers
 * 
 * Handles OAuth sign-in with Google, GitHub, and other providers.
 */

import { createClient } from "@/lib/supabase";

export type SocialProvider = "google" | "github" | "discord" | "twitter";

export interface SocialAuthResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Initiate OAuth sign-in with a social provider
 */
export async function signInWithProvider(
  provider: SocialProvider,
  redirectTo?: string
): Promise<SocialAuthResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo || `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.url) {
    return { success: true, redirectUrl: data.url };
  }

  return { success: false, error: "Failed to get OAuth URL" };
}

/**
 * Get display info for providers
 */
export const PROVIDER_INFO: Record<SocialProvider, { name: string; icon: string; color: string }> = {
  google: {
    name: "Google",
    icon: "google",
    color: "#4285f4",
  },
  github: {
    name: "GitHub",
    icon: "github",
    color: "#24292e",
  },
  discord: {
    name: "Discord",
    icon: "discord",
    color: "#5865F2",
  },
  twitter: {
    name: "Twitter",
    icon: "twitter",
    color: "#1DA1F2",
  },
};

/**
 * Get available OAuth providers based on configuration
 */
export function getAvailableProviders(): SocialProvider[] {
  const providers: SocialProvider[] = [];

  // Check for configured providers via env vars
  if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    providers.push("google");
  }
  if (process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) {
    providers.push("github");
  }
  if (process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID) {
    providers.push("discord");
  }
  if (process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID) {
    providers.push("twitter");
  }

  // Default to common providers if none configured
  if (providers.length === 0) {
    return ["google", "github"];
  }

  return providers;
}


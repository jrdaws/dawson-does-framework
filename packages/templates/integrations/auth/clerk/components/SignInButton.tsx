"use client";

import { SignInButton as ClerkSignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { UserButton } from "./UserButton";

interface SignInButtonProps {
  mode?: "modal" | "redirect";
  showSignUp?: boolean;
  className?: string;
}

export function SignInButton({
  mode = "modal",
  showSignUp = true,
  className = "",
}: SignInButtonProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
    );
  }

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ClerkSignInButton mode={mode}>
        <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
          Sign In
        </button>
      </ClerkSignInButton>
      
      {showSignUp && (
        <SignUpButton mode={mode}>
          <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Sign Up
          </button>
        </SignUpButton>
      )}
    </div>
  );
}


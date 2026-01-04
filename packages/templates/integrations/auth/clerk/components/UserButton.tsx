"use client";

import { UserButton as ClerkUserButton, useUser } from "@clerk/nextjs";

interface UserButtonProps {
  afterSignOutUrl?: string;
  showName?: boolean;
}

export function UserButton({
  afterSignOutUrl = "/",
  showName = false,
}: UserButtonProps) {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {showName && user?.firstName && (
        <span className="text-sm text-foreground hidden sm:inline">
          {user.firstName}
        </span>
      )}
      <ClerkUserButton afterSignOutUrl={afterSignOutUrl} />
    </div>
  );
}


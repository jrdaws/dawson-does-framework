import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/server";

/**
 * Clerk Helper Utilities
 *
 * This module provides utility functions for common Clerk authentication
 * and user management tasks.
 */

/**
 * Get the current authenticated user's ID
 * Returns null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Get the current authenticated user's full data
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const user = await currentUser();
  return user;
}

/**
 * Require authentication - throws error if not authenticated
 * Useful for server actions and API routes
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized - Authentication required");
  }

  return userId;
}

/**
 * Check if user has a specific role
 * @param role - The role to check for (e.g., "admin", "moderator")
 */
export async function hasRole(role: string): Promise<boolean> {
  const { sessionClaims } = await auth();

  if (!sessionClaims) {
    return false;
  }

  // Roles can be stored in metadata or custom claims
  const roles = (sessionClaims.metadata as any)?.roles as string[] | undefined;

  return roles ? roles.includes(role) : false;
}

/**
 * Get user by ID (requires admin privileges)
 * @param userId - The Clerk user ID
 */
export async function getUserById(userId: string): Promise<User> {
  try {
    const user = await clerkClient().users.getUser(userId);
    return user;
  } catch (error: any) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

/**
 * Update user metadata
 * @param userId - The Clerk user ID
 * @param metadata - Public or private metadata to update
 */
export async function updateUserMetadata(
  userId: string,
  metadata: {
    publicMetadata?: Record<string, any>;
    privateMetadata?: Record<string, any>;
  }
): Promise<User> {
  try {
    const user = await clerkClient().users.updateUser(userId, metadata);
    return user;
  } catch (error: any) {
    throw new Error(`Failed to update user metadata: ${error.message}`);
  }
}

/**
 * Get user's email addresses
 */
export async function getUserEmails(): Promise<string[]> {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  return user.emailAddresses.map((email) => email.emailAddress);
}

/**
 * Check if user's email is verified
 */
export async function isEmailVerified(): Promise<boolean> {
  const user = await currentUser();

  if (!user || !user.primaryEmailAddress) {
    return false;
  }

  return user.primaryEmailAddress.verification?.status === "verified";
}

/**
 * Get user's organization memberships
 */
export async function getUserOrganizations() {
  const { userId, orgId, orgRole, orgSlug } = await auth();

  if (!userId) {
    return null;
  }

  return {
    currentOrgId: orgId,
    currentOrgRole: orgRole,
    currentOrgSlug: orgSlug,
  };
}

/**
 * Ban a user (requires admin privileges)
 * @param userId - The Clerk user ID to ban
 */
export async function banUser(userId: string): Promise<User> {
  try {
    const user = await clerkClient().users.banUser(userId);
    return user;
  } catch (error: any) {
    throw new Error(`Failed to ban user: ${error.message}`);
  }
}

/**
 * Unban a user (requires admin privileges)
 * @param userId - The Clerk user ID to unban
 */
export async function unbanUser(userId: string): Promise<User> {
  try {
    const user = await clerkClient().users.unbanUser(userId);
    return user;
  } catch (error: any) {
    throw new Error(`Failed to unban user: ${error.message}`);
  }
}

/**
 * Get user's session information
 */
export async function getSession() {
  const { sessionId, sessionClaims } = await auth();

  return {
    sessionId,
    sessionClaims,
  };
}

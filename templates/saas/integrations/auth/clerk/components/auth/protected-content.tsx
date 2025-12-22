"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

/**
 * Protected Client Component Example
 *
 * This demonstrates how to create protected content in client components
 * using Clerk's React hooks.
 *
 * Key hooks:
 * - useUser(): Get user data and loading state
 * - useAuth(): Get auth state and helper functions
 */
export function ProtectedContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          Authentication Required
        </h3>
        <p className="text-yellow-700 mb-4">
          Please sign in to view this content.
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Render protected content for authenticated users
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Protected Client Component
          </h2>
          <p className="text-gray-600">
            This content is only visible to authenticated users.
          </p>
        </div>
        <button
          onClick={() => signOut(() => router.push("/"))}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-4 rounded transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-500">User ID:</span>
          <p className="text-gray-900 font-mono text-sm">{user.id}</p>
        </div>

        {user.primaryEmailAddress && (
          <div>
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <p className="text-gray-900">{user.primaryEmailAddress.emailAddress}</p>
          </div>
        )}

        {user.firstName && (
          <div>
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <p className="text-gray-900">
              {user.firstName} {user.lastName || ""}
            </p>
          </div>
        )}
      </div>

      {/* Example: Fetching protected data */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Client-Side API Call Example
        </h3>
        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/protected");
              const data = await response.json();
              console.log("Protected API response:", data);
              alert(`Success! Check console for response.`);
            } catch (error) {
              console.error("API call failed:", error);
              alert("Failed to fetch protected data");
            }
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Fetch Protected Data
        </button>
        <p className="text-sm text-gray-500 mt-2">
          This button demonstrates calling a protected API route from a client component.
          Clerk automatically includes the auth token in the request.
        </p>
      </div>
    </div>
  );
}

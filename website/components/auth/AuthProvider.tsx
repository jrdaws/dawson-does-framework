"use client";

import { AuthProvider as AuthContextProvider } from "@/lib/auth-context";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for the AuthProvider.
 * Use this in layout.tsx to provide auth context to the entire app.
 * 
 * @example
 * // In app/layout.tsx
 * import { AuthProvider } from "@/components/auth/AuthProvider";
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>{children}</AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}

export default AuthProvider;


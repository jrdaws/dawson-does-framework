"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "./supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithGithub: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const configured = isSupabaseConfigured();

  // Initialize auth state
  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configured]);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    if (!configured) {
      return { error: { message: "Supabase not configured" } as AuthError };
    }

    setError(null);
    const supabase = getSupabase();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError);
    }

    return { error: signInError };
  }, [configured]);

  // Sign up with email/password
  const signUp = useCallback(async (email: string, password: string) => {
    if (!configured) {
      return { error: { message: "Supabase not configured" } as AuthError };
    }

    setError(null);
    const supabase = getSupabase();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError);
    }

    return { error: signUpError };
  }, [configured]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    if (!configured) {
      return { error: { message: "Supabase not configured" } as AuthError };
    }

    setError(null);
    const supabase = getSupabase();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError);
    }

    return { error: oauthError };
  }, [configured]);

  // Sign in with GitHub
  const signInWithGithub = useCallback(async () => {
    if (!configured) {
      return { error: { message: "Supabase not configured" } as AuthError };
    }

    setError(null);
    const supabase = getSupabase();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError);
    }

    return { error: oauthError };
  }, [configured]);

  // Sign out
  const signOut = useCallback(async () => {
    if (!configured) return;

    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, [configured]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    isConfigured: configured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


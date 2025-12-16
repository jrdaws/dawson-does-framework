import { AuthUser, ProviderHealth, Session } from "./types";

export interface AuthProvider {
  readonly name: string;
  getSession(req: Request): Promise<Session | null>;
  requireSession(req: Request): Promise<Session>;
  signInWithEmail(email: string, redirectTo?: string): Promise<void>;
  signInWithOAuth(provider: "google" | "apple" | "facebook", redirectTo?: string): Promise<void>;
  signOut(session: Session): Promise<void>;
  getUser(userId: string): Promise<AuthUser | null>;
  health(): Promise<ProviderHealth>;
}

/**
 * Session Management for Analytics
 * 
 * Manages user sessions for tracking across page views.
 */

export interface AnalyticsSession {
  id: string;
  userId?: string;
  startedAt: string;
  lastActivityAt: string;
  pageViews: number;
  traits?: Record<string, unknown>;
}

const SESSION_KEY = "analytics_session";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Get or create analytics session
 */
export function getSession(): AnalyticsSession {
  if (typeof sessionStorage === "undefined") {
    // Server-side or SSR
    return {
      id: generateSessionId(),
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      pageViews: 0,
    };
  }

  const stored = sessionStorage.getItem(SESSION_KEY);

  if (stored) {
    try {
      const session = JSON.parse(stored) as AnalyticsSession;
      
      // Check if session is still valid (within timeout)
      const lastActivity = new Date(session.lastActivityAt).getTime();
      const now = Date.now();
      
      if (now - lastActivity < SESSION_TIMEOUT) {
        // Update last activity
        session.lastActivityAt = new Date().toISOString();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      }
    } catch {
      // Invalid session, create new
    }
  }

  // Create new session
  const session: AnalyticsSession = {
    id: generateSessionId(),
    startedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    pageViews: 0,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Update session with new page view
 */
export function recordPageView(): void {
  if (typeof sessionStorage === "undefined") return;

  const session = getSession();
  session.pageViews++;
  session.lastActivityAt = new Date().toISOString();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Set user ID on session
 */
export function setSessionUser(userId: string): void {
  if (typeof sessionStorage === "undefined") return;

  const session = getSession();
  session.userId = userId;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear session (on logout)
 */
export function clearSession(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Get session duration in seconds
 */
export function getSessionDuration(): number {
  const session = getSession();
  const started = new Date(session.startedAt).getTime();
  const now = Date.now();
  return Math.round((now - started) / 1000);
}

/**
 * Check if this is a new session
 */
export function isNewSession(): boolean {
  if (typeof sessionStorage === "undefined") return true;
  return !sessionStorage.getItem(SESSION_KEY);
}

/**
 * Get session metrics
 */
export function getSessionMetrics(): {
  duration: number;
  pageViews: number;
  isAuthenticated: boolean;
} {
  const session = getSession();
  return {
    duration: getSessionDuration(),
    pageViews: session.pageViews,
    isAuthenticated: !!session.userId,
  };
}


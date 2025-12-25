/**
 * User Tracking Module
 * 
 * Track user behavior and journeys for analytics.
 */

import { createClient } from "@/lib/supabase";
import { getSession } from "@/lib/analytics/session";

export interface UserEvent {
  userId?: string;
  sessionId: string;
  event: string;
  properties?: Record<string, unknown>;
  timestamp: string;
  page?: string;
  referrer?: string;
}

export interface UserJourney {
  sessionId: string;
  userId?: string;
  events: UserEvent[];
  startedAt: string;
  endedAt?: string;
  duration?: number;
}

/**
 * Track a user event
 */
export async function trackEvent(
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const supabase = createClient();
  const session = getSession();

  const eventData: UserEvent = {
    sessionId: session.id,
    userId: session.userId,
    event,
    properties,
    timestamp: new Date().toISOString(),
    page: typeof window !== "undefined" ? window.location.pathname : undefined,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
  };

  try {
    await supabase.from("user_events").insert(eventData);
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}

/**
 * Track page view with user context
 */
export async function trackPageView(page: string): Promise<void> {
  await trackEvent("page_view", { page });
}

/**
 * Track user action
 */
export async function trackAction(
  action: string,
  target?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await trackEvent("user_action", { action, target, ...metadata });
}

/**
 * Track conversion
 */
export async function trackConversion(
  conversionType: string,
  value?: number,
  metadata?: Record<string, unknown>
): Promise<void> {
  await trackEvent("conversion", { conversionType, value, ...metadata });
}

/**
 * Get user journey for a session
 */
export async function getUserJourney(sessionId: string): Promise<UserJourney | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_events")
    .select("*")
    .eq("session_id", sessionId)
    .order("timestamp");

  if (error || !data || data.length === 0) {
    return null;
  }

  const events = data as UserEvent[];
  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];

  return {
    sessionId,
    userId: firstEvent.userId,
    events,
    startedAt: firstEvent.timestamp,
    endedAt: lastEvent.timestamp,
    duration: new Date(lastEvent.timestamp).getTime() - new Date(firstEvent.timestamp).getTime(),
  };
}

/**
 * Get recent events for a user
 */
export async function getUserEvents(
  userId: string,
  limit = 100
): Promise<UserEvent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_events")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to get user events:", error);
    return [];
  }

  return data || [];
}

/**
 * Get event counts by type
 */
export async function getEventCounts(
  startDate?: Date,
  endDate?: Date
): Promise<Record<string, number>> {
  const supabase = createClient();

  let query = supabase.from("user_events").select("event");

  if (startDate) {
    query = query.gte("timestamp", startDate.toISOString());
  }
  if (endDate) {
    query = query.lte("timestamp", endDate.toISOString());
  }

  const { data, error } = await query;

  if (error || !data) {
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.event] = (counts[row.event] || 0) + 1;
  }

  return counts;
}

/**
 * Identify user (call after login)
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  const session = getSession();
  session.userId = userId;
  session.traits = traits;
  
  // Store in session storage
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("analytics_session", JSON.stringify(session));
  }

  // Track identify event
  trackEvent("identify", { userId, ...traits });
}


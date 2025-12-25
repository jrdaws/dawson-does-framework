/**
 * Conversion Funnels Module
 * 
 * Track user progression through key flows.
 */

import { createClient } from "@/lib/supabase";

export interface FunnelStep {
  id: string;
  name: string;
  event: string;
  order: number;
}

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  steps: FunnelStep[];
}

export interface FunnelAnalysis {
  funnel: Funnel;
  stepMetrics: StepMetrics[];
  overallConversion: number;
  totalUsers: number;
  period: { start: Date; end: Date };
}

export interface StepMetrics {
  step: FunnelStep;
  users: number;
  conversionRate: number;
  dropoffRate: number;
  averageTime?: number; // Time to reach this step from previous
}

/**
 * Define a conversion funnel
 */
export async function createFunnel(funnel: Omit<Funnel, "id">): Promise<Funnel | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("funnels")
    .insert({
      name: funnel.name,
      description: funnel.description,
      steps: funnel.steps,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create funnel:", error);
    return null;
  }

  return data;
}

/**
 * Get all funnels
 */
export async function getFunnels(): Promise<Funnel[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("funnels")
    .select("*")
    .order("name");

  if (error || !data) {
    return [];
  }

  return data;
}

/**
 * Analyze funnel performance
 */
export async function analyzeFunnel(
  funnelId: string,
  startDate: Date,
  endDate: Date
): Promise<FunnelAnalysis | null> {
  const supabase = createClient();

  // Get funnel definition
  const { data: funnel, error: funnelError } = await supabase
    .from("funnels")
    .select("*")
    .eq("id", funnelId)
    .single();

  if (funnelError || !funnel) {
    return null;
  }

  const steps = funnel.steps as FunnelStep[];
  const stepMetrics: StepMetrics[] = [];
  let previousStepUsers = 0;

  // Analyze each step
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    
    // Count unique users who completed this step
    const { count, error } = await supabase
      .from("user_events")
      .select("session_id", { count: "exact", head: true })
      .eq("event", step.event)
      .gte("timestamp", startDate.toISOString())
      .lte("timestamp", endDate.toISOString());

    if (error) {
      console.error(`Failed to analyze step ${step.name}:`, error);
      continue;
    }

    const users = count || 0;
    const conversionRate = i === 0 
      ? 100 
      : previousStepUsers > 0 
        ? (users / previousStepUsers) * 100 
        : 0;
    const dropoffRate = 100 - conversionRate;

    stepMetrics.push({
      step,
      users,
      conversionRate,
      dropoffRate,
    });

    previousStepUsers = users;
  }

  const totalUsers = stepMetrics[0]?.users || 0;
  const finalStepUsers = stepMetrics[stepMetrics.length - 1]?.users || 0;
  const overallConversion = totalUsers > 0 ? (finalStepUsers / totalUsers) * 100 : 0;

  return {
    funnel: funnel as Funnel,
    stepMetrics,
    overallConversion,
    totalUsers,
    period: { start: startDate, end: endDate },
  };
}

/**
 * Get funnel comparison over time periods
 */
export async function compareFunnelPeriods(
  funnelId: string,
  periods: { start: Date; end: Date }[]
): Promise<FunnelAnalysis[]> {
  const analyses: FunnelAnalysis[] = [];

  for (const period of periods) {
    const analysis = await analyzeFunnel(funnelId, period.start, period.end);
    if (analysis) {
      analyses.push(analysis);
    }
  }

  return analyses;
}

/**
 * Common funnel templates
 */
export const FUNNEL_TEMPLATES = {
  signup: {
    name: "Signup Funnel",
    description: "Track user registration flow",
    steps: [
      { id: "1", name: "Landing Page", event: "page_view", order: 1 },
      { id: "2", name: "Signup Start", event: "signup_started", order: 2 },
      { id: "3", name: "Email Verified", event: "email_verified", order: 3 },
      { id: "4", name: "Profile Complete", event: "profile_completed", order: 4 },
    ],
  },
  checkout: {
    name: "Checkout Funnel",
    description: "Track purchase completion",
    steps: [
      { id: "1", name: "Add to Cart", event: "add_to_cart", order: 1 },
      { id: "2", name: "View Cart", event: "view_cart", order: 2 },
      { id: "3", name: "Begin Checkout", event: "begin_checkout", order: 3 },
      { id: "4", name: "Payment Info", event: "payment_info_entered", order: 4 },
      { id: "5", name: "Purchase Complete", event: "purchase", order: 5 },
    ],
  },
  onboarding: {
    name: "Onboarding Funnel",
    description: "Track new user activation",
    steps: [
      { id: "1", name: "Account Created", event: "signup_completed", order: 1 },
      { id: "2", name: "First Action", event: "first_action", order: 2 },
      { id: "3", name: "Feature Used", event: "core_feature_used", order: 3 },
      { id: "4", name: "Fully Activated", event: "activation_complete", order: 4 },
    ],
  },
};


/**
 * Analytics Reports Module
 * 
 * Generate and export analytics reports.
 */

import { createClient } from "@/lib/supabase";

export interface ReportConfig {
  id?: string;
  name: string;
  type: ReportType;
  dateRange: DateRange;
  metrics: string[];
  dimensions?: string[];
  filters?: Record<string, unknown>;
}

export type ReportType = 
  | "overview"
  | "traffic"
  | "conversions"
  | "revenue"
  | "custom";

export interface DateRange {
  start: Date;
  end: Date;
  preset?: "today" | "yesterday" | "7d" | "30d" | "90d" | "custom";
}

export interface ReportData {
  config: ReportConfig;
  generatedAt: string;
  summary: Record<string, number | string>;
  timeSeries?: TimeSeriesData[];
  breakdown?: BreakdownData[];
}

export interface TimeSeriesData {
  date: string;
  [metric: string]: string | number;
}

export interface BreakdownData {
  dimension: string;
  value: string;
  metrics: Record<string, number>;
}

/**
 * Generate a report
 */
export async function generateReport(config: ReportConfig): Promise<ReportData | null> {
  try {
    const report: ReportData = {
      config,
      generatedAt: new Date().toISOString(),
      summary: {},
      timeSeries: [],
      breakdown: [],
    };

    // Generate based on report type
    switch (config.type) {
      case "overview":
        await populateOverviewReport(report);
        break;
      case "traffic":
        await populateTrafficReport(report);
        break;
      case "conversions":
        await populateConversionsReport(report);
        break;
      case "revenue":
        await populateRevenueReport(report);
        break;
      case "custom":
        await populateCustomReport(report);
        break;
    }

    return report;
  } catch (error) {
    console.error("Failed to generate report:", error);
    return null;
  }
}

async function populateOverviewReport(report: ReportData): Promise<void> {
  const supabase = createClient();
  const { start, end } = report.config.dateRange;

  // Get page views
  const { count: pageViews } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  // Get unique sessions
  const { data: sessions } = await supabase
    .from("page_views")
    .select("session_id")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  const uniqueSessions = new Set(sessions?.map((s) => s.session_id)).size;

  // Get conversions
  const { count: conversions } = await supabase
    .from("user_events")
    .select("*", { count: "exact", head: true })
    .eq("event", "conversion")
    .gte("timestamp", start.toISOString())
    .lte("timestamp", end.toISOString());

  report.summary = {
    pageViews: pageViews || 0,
    uniqueSessions,
    conversions: conversions || 0,
    conversionRate: uniqueSessions > 0 
      ? ((conversions || 0) / uniqueSessions * 100).toFixed(2) + "%"
      : "0%",
  };
}

async function populateTrafficReport(report: ReportData): Promise<void> {
  const supabase = createClient();
  const { start, end } = report.config.dateRange;

  // Get traffic by source
  const { data } = await supabase
    .from("page_views")
    .select("referrer, session_id")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  // Aggregate by source
  const sourceMap = new Map<string, Set<string>>();
  for (const row of data || []) {
    const source = parseReferrerSource(row.referrer);
    if (!sourceMap.has(source)) {
      sourceMap.set(source, new Set());
    }
    sourceMap.get(source)?.add(row.session_id);
  }

  report.breakdown = Array.from(sourceMap.entries()).map(([source, sessions]) => ({
    dimension: "source",
    value: source,
    metrics: { sessions: sessions.size },
  }));
}

async function populateConversionsReport(report: ReportData): Promise<void> {
  const supabase = createClient();
  const { start, end } = report.config.dateRange;

  const { data } = await supabase
    .from("user_events")
    .select("properties, timestamp")
    .eq("event", "conversion")
    .gte("timestamp", start.toISOString())
    .lte("timestamp", end.toISOString());

  // Group by conversion type
  const typeMap = new Map<string, number>();
  for (const row of data || []) {
    const type = (row.properties as Record<string, unknown>)?.conversionType as string || "unknown";
    typeMap.set(type, (typeMap.get(type) || 0) + 1);
  }

  report.breakdown = Array.from(typeMap.entries()).map(([type, count]) => ({
    dimension: "conversionType",
    value: type,
    metrics: { conversions: count },
  }));

  report.summary = {
    totalConversions: data?.length || 0,
  };
}

async function populateRevenueReport(report: ReportData): Promise<void> {
  const supabase = createClient();
  const { start, end } = report.config.dateRange;

  const { data } = await supabase
    .from("orders")
    .select("total, created_at, status")
    .eq("status", "confirmed")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  const totalRevenue = (data || []).reduce((sum, order) => sum + order.total, 0);
  const orderCount = data?.length || 0;

  report.summary = {
    totalRevenue: `$${totalRevenue.toFixed(2)}`,
    orderCount,
    averageOrderValue: orderCount > 0 
      ? `$${(totalRevenue / orderCount).toFixed(2)}`
      : "$0.00",
  };
}

async function populateCustomReport(report: ReportData): Promise<void> {
  // Custom reports would be built based on config.metrics and config.dimensions
  report.summary = {
    note: "Custom report - configure metrics and dimensions",
  };
}

/**
 * Parse referrer URL to get source
 */
function parseReferrerSource(referrer: string | null): string {
  if (!referrer) return "Direct";
  
  try {
    const url = new URL(referrer);
    const host = url.hostname.replace("www.", "");
    
    if (host.includes("google")) return "Google";
    if (host.includes("facebook") || host.includes("fb.")) return "Facebook";
    if (host.includes("twitter") || host.includes("t.co")) return "Twitter";
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("instagram")) return "Instagram";
    
    return host;
  } catch {
    return "Unknown";
  }
}

/**
 * Export report to CSV
 */
export function exportReportToCsv(report: ReportData): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`Report: ${report.config.name}`);
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");
  
  // Summary
  lines.push("Summary");
  for (const [key, value] of Object.entries(report.summary)) {
    lines.push(`${key},${value}`);
  }
  lines.push("");
  
  // Breakdown
  if (report.breakdown && report.breakdown.length > 0) {
    lines.push("Breakdown");
    const firstRow = report.breakdown[0];
    const metricKeys = Object.keys(firstRow.metrics);
    lines.push(`${firstRow.dimension},${metricKeys.join(",")}`);
    
    for (const row of report.breakdown) {
      const values = metricKeys.map((k) => row.metrics[k]);
      lines.push(`${row.value},${values.join(",")}`);
    }
  }
  
  return lines.join("\n");
}

/**
 * Save report
 */
export async function saveReport(report: ReportData): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_reports")
    .insert({
      name: report.config.name,
      config: report.config,
      data: report,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save report:", error);
    return null;
  }

  return data?.id;
}

/**
 * Get saved reports
 */
export async function getSavedReports(): Promise<{ id: string; name: string; createdAt: string }[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_reports")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((r) => ({
    id: r.id,
    name: r.name,
    createdAt: r.created_at,
  }));
}


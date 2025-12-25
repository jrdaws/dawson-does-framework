"use client";

import { useEffect, useState } from "react";
import {
  getFunnels,
  analyzeFunnel,
  Funnel,
  FunnelAnalysis,
  FUNNEL_TEMPLATES,
} from "@/lib/analytics/funnels";

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FunnelAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end: new Date(),
  });

  useEffect(() => {
    getFunnels().then((data) => {
      setFunnels(data);
      if (data.length > 0) {
        setSelectedFunnel(data[0].id);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedFunnel) {
      setIsLoading(true);
      analyzeFunnel(selectedFunnel, dateRange.start, dateRange.end)
        .then(setAnalysis)
        .finally(() => setIsLoading(false));
    }
  }, [selectedFunnel, dateRange]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Conversion Funnels</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Funnel
        </button>
      </div>

      {/* Funnel selector and date range */}
      <div className="flex gap-4 mb-8">
        <select
          value={selectedFunnel || ""}
          onChange={(e) => setSelectedFunnel(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
        >
          {funnels.map((funnel) => (
            <option key={funnel.id} value={funnel.id}>
              {funnel.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const days = parseInt(e.target.value);
            setDateRange({
              start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
              end: new Date(),
            });
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : analysis ? (
        <div className="space-y-8">
          {/* Overview stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Total Users"
              value={analysis.totalUsers.toLocaleString()}
            />
            <StatCard
              label="Overall Conversion"
              value={`${analysis.overallConversion.toFixed(1)}%`}
              color={analysis.overallConversion > 20 ? "green" : "yellow"}
            />
            <StatCard
              label="Steps"
              value={analysis.stepMetrics.length.toString()}
            />
          </div>

          {/* Funnel visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              {analysis.funnel.name}
            </h2>
            <FunnelVisualization metrics={analysis.stepMetrics} />
          </div>

          {/* Step details table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Step Details
            </h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Step
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Users
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Conversion
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Dropoff
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.stepMetrics.map((metric, index) => (
                  <tr
                    key={metric.step.id}
                    className="border-b border-gray-100 dark:border-gray-700"
                  >
                    <td className="py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="dark:text-white">{metric.step.name}</span>
                      </span>
                    </td>
                    <td className="text-right py-3 dark:text-white">
                      {metric.users.toLocaleString()}
                    </td>
                    <td className="text-right py-3">
                      <span
                        className={
                          metric.conversionRate > 80
                            ? "text-green-600"
                            : metric.conversionRate > 50
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {metric.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-3 text-gray-500 dark:text-gray-400">
                      {metric.dropoffRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No funnel selected or no data available.
        </div>
      )}

      {/* Templates */}
      {funnels.length === 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Get Started with Templates
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(FUNNEL_TEMPLATES).map(([key, template]) => (
              <div
                key={key}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <h3 className="font-medium dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {template.description}
                </p>
                <p className="text-xs text-gray-400">
                  {template.steps.length} steps
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "default",
}: {
  label: string;
  value: string;
  color?: "default" | "green" | "yellow" | "red";
}) {
  const colors = {
    default: "bg-white dark:bg-gray-800",
    green: "bg-green-50 dark:bg-green-900/20",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20",
    red: "bg-red-50 dark:bg-red-900/20",
  };

  return (
    <div className={`${colors[color]} rounded-lg p-6 shadow`}>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold dark:text-white">{value}</p>
    </div>
  );
}

function FunnelVisualization({
  metrics,
}: {
  metrics: { step: { name: string }; users: number; conversionRate: number }[];
}) {
  const maxUsers = Math.max(...metrics.map((m) => m.users), 1);

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => {
        const widthPercent = (metric.users / maxUsers) * 100;

        return (
          <div key={index} className="flex items-center gap-4">
            <div className="w-32 text-sm text-gray-600 dark:text-gray-400 truncate">
              {metric.step.name}
            </div>
            <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
            <div className="w-20 text-right text-sm">
              <span className="dark:text-white">{metric.users}</span>
              <span className="text-gray-400 ml-1">
                ({metric.conversionRate.toFixed(0)}%)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


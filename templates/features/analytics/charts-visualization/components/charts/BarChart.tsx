"use client";

import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface DataPoint {
  [key: string]: string | number;
}

interface BarChartProps {
  data: DataPoint[];
  xAxisKey: string;
  bars: {
    dataKey: string;
    color: string;
    name?: string;
  }[];
  height?: number;
  layout?: "vertical" | "horizontal";
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  className?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function BarChart({
  data,
  xAxisKey,
  bars,
  height = 300,
  layout = "horizontal",
  showGrid = true,
  showLegend = true,
  stacked = false,
  className = "",
}: BarChartProps) {
  const isVertical = layout === "vertical";

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar data={data} layout={layout}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          {isVertical ? (
            <>
              <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis
                type="category"
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                width={100}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          {showLegend && <Legend />}
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.color || COLORS[index % COLORS.length]}
              name={bar.name || bar.dataKey}
              stackId={stacked ? "stack" : undefined}
              radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            />
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}


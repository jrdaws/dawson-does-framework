"use client";

import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  [key: string]: string | number;
}

interface LineChartProps {
  data: DataPoint[];
  xAxisKey: string;
  lines: {
    dataKey: string;
    color: string;
    name?: string;
  }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function LineChart({
  data,
  xAxisKey,
  lines,
  height = 300,
  showGrid = true,
  showLegend = true,
  className = "",
}: LineChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLine data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          {showLegend && <Legend />}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              name={line.name || line.dataKey}
            />
          ))}
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
}


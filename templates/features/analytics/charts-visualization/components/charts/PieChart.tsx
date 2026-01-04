"use client";

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  className?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export function PieChart({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = 100,
  showLegend = true,
  showLabels = true,
  className = "",
}: PieChartProps) {
  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            label={showLabels ? renderLabel : undefined}
            labelLine={showLabels}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          {showLegend && <Legend />}
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Donut Chart variant
 */
export function DonutChart(props: Omit<PieChartProps, "innerRadius">) {
  return <PieChart {...props} innerRadius={60} />;
}


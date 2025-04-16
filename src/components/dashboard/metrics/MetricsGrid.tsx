
import React from "react";
import { MetricCard } from "./MetricCard";
import { DashboardMetric } from "./types";

interface MetricsGridProps {
  metrics: DashboardMetric[];
  isLoading: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="text-sm font-medium h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="text-xs text-muted-foreground h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} />
      ))}
    </div>
  );
};

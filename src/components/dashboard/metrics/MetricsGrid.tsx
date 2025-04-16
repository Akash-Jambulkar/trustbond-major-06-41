
import React from "react";
import { MetricCard } from "./MetricCard";
import { DashboardMetric } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsGridProps {
  metrics: DashboardMetric[];
  isLoading: boolean;
  title?: string;
}

export const MetricsGrid = ({ metrics, isLoading, title }: MetricsGridProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-xl font-semibold text-trustbond-dark mb-3">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-3 p-6 border rounded-lg shadow-sm">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Calculate grid columns based on number of metrics
  const getGridColumns = () => {
    const count = metrics.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  };
  
  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold text-trustbond-dark mb-3">{title}</h2>}
      <div className={`grid ${getGridColumns()} gap-6`}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
};

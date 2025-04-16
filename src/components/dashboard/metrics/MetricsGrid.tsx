
import React from "react";
import { MetricCard } from "./MetricCard";
import { DashboardMetric } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsGridProps {
  metrics: DashboardMetric[];
  isLoading: boolean;
}

export const MetricsGrid = ({ metrics, isLoading }: MetricsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="space-y-3 p-6 border rounded-lg">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} />
      ))}
    </div>
  );
};
